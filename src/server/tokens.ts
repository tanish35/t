import { requireUser } from "@/server/require-user";
import { ingestTokens, projects } from "@/db/schema";
import { db } from "@/db";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { createHash, randomBytes } from "node:crypto";

const createTokenSchema = z.object({
  projectId: z.cuid2(),
  name: z.string().min(1).max(100),
  expiry: z.enum(["1h", "4h", "8h", "24h", "1w", "1m", "1y", "never"]),
});

const EXPIRY_OPTIONS = [
  { value: "1h", label: "1 hour", ms: 60 * 60 * 1000 },
  { value: "4h", label: "4 hours", ms: 4 * 60 * 60 * 1000 },
  { value: "8h", label: "8 hours", ms: 8 * 60 * 60 * 1000 },
  { value: "24h", label: "24 hours", ms: 24 * 60 * 60 * 1000 },
  { value: "1w", label: "1 week", ms: 7 * 24 * 60 * 60 * 1000 },
  { value: "1m", label: "1 month", ms: 30 * 24 * 60 * 60 * 1000 },
  { value: "1y", label: "1 year", ms: 365 * 24 * 60 * 60 * 1000 },
  { value: "never", label: "Never", ms: undefined },
] as const;

export const createToken = createServerFn({
  method: "POST",
})
  .validator(createTokenSchema)
  .handler(async ({ data }) => {
    const user = await requireUser();
    const rawToken = `rf_${randomBytes(32).toString("base64url")}`;
    const hashedToken = createHash("sha256").update(rawToken).digest("hex");
    const tokenSuffix = rawToken.slice(-4);
    const expiryOption = EXPIRY_OPTIONS.find(
      (option) => option.value === data.expiry,
    );
    const expiryDate = expiryOption?.ms
      ? new Date(Date.now() + expiryOption.ms)
      : null;
    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, data.projectId),
        eq(projects.ownerId, user.id),
      ),
    });
    if (!project) {
      throw new Response("Project not found", { status: 404 });
    }
    await db.insert(ingestTokens).values({
      projectId: data.projectId,
      name: data.name,
      tokenHash: hashedToken,
      tokenSuffix,
      expiresAt: expiryDate,
    });
    return { token: rawToken, tokenSuffix, expiresAt: expiryDate };
  });

const revokeTokenSchema = z.object({
  tokenId: z.cuid2(),
});

export const revokeToken = createServerFn({
  method: "POST",
})
  .validator(revokeTokenSchema)
  .handler(async ({ data }) => {
    const user = await requireUser();
    const [token] = await db
      .update(ingestTokens)
      .set({ revokedAt: new Date() })
      .from(projects)
      .where(
        and(
          eq(ingestTokens.id, data.tokenId),
          eq(ingestTokens.projectId, projects.id),
          eq(projects.ownerId, user.id),
        ),
      )
      .returning({ id: ingestTokens.id });
    if (!token) {
      throw new Response("Token not found", { status: 404 });
    }
  });
