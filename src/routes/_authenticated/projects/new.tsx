import { createFileRoute } from "@tanstack/react-router";
import { StepForm } from "@/components/step-form";
import type { Step, StepValues } from "@/components/step-form";

export const Route = createFileRoute("/_authenticated/projects/new")({
  component: NewProjectRoute,
});

// Add a step here and the form picks it up — question, control and animation included.
const steps: Step[] = [
  {
    name: "name",
    type: "text",
    question: "What should we call this project?",
    hint: "You can rename it later.",
    placeholder: "Acme onboarding",
  },
  {
    name: "description",
    type: "textarea",
    question: "What's it about?",
    hint: "A line or two is plenty. Shift + Enter for a new line.",
    placeholder: "Session replays for the new onboarding flow",
  },
];

function NewProjectRoute() {
  function handleSubmit(values: StepValues) {
    console.log("new project", values);
  }

  return (
    <div className="h-screen flex-1">
      <StepForm
        steps={steps}
        onSubmit={handleSubmit}
        submitLabel="Create project"
        doneMessage="Project created."
      />
    </div>
  );
}
