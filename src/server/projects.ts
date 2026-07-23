import { requireUser } from "@/server/require-user";
import { projects } from "@/db/schema";
import { db } from "@/db";
import z from "zod";
import { and, eq } from "drizzle-orm";

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(""),
});

export async function createProject(
  input: z.infer<typeof createProjectSchema>,
) {
  const user = await requireUser();
  const result = createProjectSchema.safeParse(input);
  if (!result.success) {
    throw new Response("Invalid input", { status: 400 });
  }
  const { name, description } = result.data;
  const [project] = await db
    .insert(projects)
    .values({
      name,
      description,
      ownerId: user.id,
    })
    .returning();
  return project;
}

export async function listProjects() {
  const user = await requireUser();
  const projectsList = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, user.id));
  return projectsList;
}

const getProjectSchema = z.object({
  projectId: z.cuid2(),
});

export async function getProject(param: z.infer<typeof getProjectSchema>) {
  const result = getProjectSchema.safeParse(param);
  if (!result.success) {
    throw new Response("Invalid input", { status: 400 });
  }
  const data = result.data;
  const user = await requireUser();
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, data.projectId), eq(projects.ownerId, user.id)));
  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }
  return project;
}

export async function deleteProject(param: z.infer<typeof getProjectSchema>) {
  const result = getProjectSchema.safeParse(param);
  if (!result.success) {
    throw new Response("Invalid input", { status: 400 });
  }
  const data = result.data;
  const user = await requireUser();
  const [deletedProject] = await db
    .delete(projects)
    .where(and(eq(projects.id, data.projectId), eq(projects.ownerId, user.id)))
    .returning();
  if (!deletedProject) {
    throw new Response("Project not found", { status: 404 });
  }
  return { success: true };
}

const updateProjectSchema = z.object({
  projectId: z.cuid2(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export async function updateProject(
  input: z.infer<typeof updateProjectSchema>,
) {
  const result = updateProjectSchema.safeParse(input);
  if (!result.success) {
    throw new Response("Invalid input", { status: 400 });
  }
  const data = result.data;
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
    .where(and(eq(projects.id, data.projectId), eq(projects.ownerId, user.id)))
    .returning();
  if (!updatedProject) {
    throw new Response("Project not found", { status: 404 });
  }
  return updatedProject;
}
