import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { getProject } from "@/server/projects";

export const Route = createFileRoute(
  "/_authenticated/projects/$projectId/edit",
)({
  beforeLoad: async ({ params }) => {
    const project = await getProject({ data: { projectId: params.projectId } });
    return { project };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { project } = Route.useRouteContext();

  return <ProjectDetails project={project} />;
}
