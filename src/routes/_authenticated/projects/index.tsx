import { createFileRoute } from "@tanstack/react-router";
import { ProjectsList } from "@/components/projects/ProjectsList";

export const Route = createFileRoute("/_authenticated/projects/")({
  component: ProjectsDashboard,
});

function ProjectsDashboard() { return <ProjectsList />; }
