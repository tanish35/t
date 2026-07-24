export type StepOption = { label: string; value: string };

type StepBase = {
  name: string;
  question: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  validate?: (value: string) => string | null;
};

export type Step =
  | (StepBase & { type: "text" | "textarea" | "date" })
  | (StepBase & { type: "radio" | "select"; options: StepOption[] });

export type StepValues = Record<string, string>;
