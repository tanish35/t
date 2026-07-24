import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetails } from "@/components/projects/ProjectDetails";

export const Route = createFileRoute(
  "/_authenticated/projects/$projectId/edit",
)({
  component: RouteComponent,
});

function RouteComponent() { return <ProjectDetails projectId={Route.useParams().projectId} />; }
