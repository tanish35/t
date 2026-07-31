import { createFileRoute } from "@tanstack/react-router";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { getProjects } from "@/server/projects";

export const Route = createFileRoute("/_authenticated/projects/")({
  beforeLoad: async () => {
    const projects = await getProjects();
    return { projects };
  },
  component: ProjectsDashboard,
});

function ProjectsDashboard() {
  const { projects } = Route.useRouteContext();

  return <ProjectsList projects={projects} />;
}
