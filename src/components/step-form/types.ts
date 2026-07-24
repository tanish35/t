export type StepOption = { label: string; value: string };
import { z } from "zod";

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

const stepValuesSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(""),
});
export type StepValues = z.infer<typeof stepValuesSchema>;
