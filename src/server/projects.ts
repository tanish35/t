import { requireUser } from "@/server/require-user";
import { projects } from "@/db/schema";
import { db } from "@/db";
import z from "zod";
import { and, eq } from "drizzle-orm";
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
    const projectsList = await db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, user.id));
    return projectsList;
  },
);

const getProjectSchema = z.object({
  projectId: z.cuid2(),
});

export const getProject = createServerFn({ method: "GET" })
  .validator(getProjectSchema)
  .handler(async ({ data }) => {
    const user = await requireUser();
    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, data.projectId),
        eq(projects.ownerId, user.id),
      ),
    });
    if (!project) {
      throw new Response("Project not found", { status: 404 });
    }
    return project;
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
