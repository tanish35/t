import { createFileRoute } from "@tanstack/react-router";

import { HeroLanding } from "@/components/ui/hero-landing";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <HeroLanding />
    </main>
  );
}
