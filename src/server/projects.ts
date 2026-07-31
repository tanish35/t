import { requireUser } from "@/server/require-user";
import { ingestTokens, projects, recordings, replayEvents } from "@/db/schema";
import { db } from "@/db";
import z from "zod";
import { and, count, countDistinct, eq, desc } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(""),
});

export const createProject = createServerFn({ method: "POST" })
  .validator(createProjectSchema)
  .handler(async ({ data }) => {
    const user = await requireUser();
    const { name, description } = data;
    const [project] = await db
      .insert(projects)
      .values({
        name,
        description,
        ownerId: user.id,
      })
      .returning();

    return project;
  });

export const getProjects = createServerFn({ method: "GET" }).handler(
  async () => {
    const user = await requireUser();
    return db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        recordingCount: countDistinct(recordings.id),
        eventCount: count(replayEvents.id),
      })
      .from(projects)
      .leftJoin(recordings, eq(recordings.projectId, projects.id))
      .leftJoin(replayEvents, eq(replayEvents.recordingId, recordings.id))
      .where(eq(projects.ownerId, user.id))
      .groupBy(projects.id, projects.name, projects.description);
  },
);

const getProjectSchema = z.object({
  projectId: z.cuid2(),
});

export const getProject = createServerFn({ method: "GET" })
  .validator(getProjectSchema)
  .handler(async ({ data }) => {
    const user = await requireUser();

    const [project] = await db
      .select()
      .from(projects)
      .where(
        and(eq(projects.id, data.projectId), eq(projects.ownerId, user.id)),
      )
      .limit(1);

    if (!project) {
      throw new Response("Project not found", { status: 404 });
    }

    const [projectRecordings, projectIngestTokens, projectEvents] =
      await Promise.all([
        db
          .select()
          .from(recordings)
          .where(eq(recordings.projectId, project.id))
          .orderBy(desc(recordings.createdAt)),

        db
          .select({
            id: ingestTokens.id,
            projectId: ingestTokens.projectId,
            name: ingestTokens.name,
            tokenSuffix: ingestTokens.tokenSuffix,
            lastUsedAt: ingestTokens.lastUsedAt,
            expiresAt: ingestTokens.expiresAt,
            revokedAt: ingestTokens.revokedAt,
            createdAt: ingestTokens.createdAt,
          })
          .from(ingestTokens)
          .where(eq(ingestTokens.projectId, project.id))
          .orderBy(desc(ingestTokens.createdAt)),
        db
          .select({
            totalEvents: count(replayEvents.id),
          })
          .from(replayEvents)
          .leftJoin(recordings, eq(replayEvents.recordingId, recordings.id))
          .where(eq(recordings.projectId, project.id)),
      ]);

    return {
      ...project,
      recordings: projectRecordings,
      ingestTokens: projectIngestTokens,
      totalEvents: projectEvents[0]?.totalEvents ?? 0,
    };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .validator(getProjectSchema)
  .handler(async ({ data }) => {
    const user = await requireUser();
    const [deletedRow] = await db
      .delete(projects)
      .where(
        and(eq(projects.id, data.projectId), eq(projects.ownerId, user.id)),
      )
      .returning();
    if (!deletedRow) {
      throw new Response("Project not found", { status: 404 });
    }
    return { success: true };
  });

const updateProjectSchema = z.object({
  projectId: z.cuid2(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const updateProject = createServerFn({ method: "POST" })
  .validator(updateProjectSchema)
  .handler(async ({ data }) => {
    const user = await requireUser();
    if (data.name === undefined && data.description === undefined) {
      throw new Response("No fields to update", { status: 400 });
    }
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
      })
      .where(
        and(eq(projects.id, data.projectId), eq(projects.ownerId, user.id)),
      )
      .returning();
    if (!updatedProject) {
      throw new Response("Project not found", { status: 404 });
    }
    return updatedProject;
  });
