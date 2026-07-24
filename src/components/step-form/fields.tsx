import { cn } from "@/lib/utils";
import type { Step } from "./types";

const fieldClass =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-lg text-white outline-none backdrop-blur-sm transition placeholder:text-white/35 focus:border-white/40 focus:bg-white/10";

type StepFieldProps = {
  step: Step;
  value: string;
  onChange: (value: string) => void;

  onAdvance: () => void;
};

export function StepField({
  step,
  value,
  onChange,
  onAdvance,
}: StepFieldProps) {
  switch (step.type) {
    case "text":
      return (
        <input
          autoFocus
          type="text"
          value={value}
          placeholder={step.placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdvance();
            }
          }}
          className={fieldClass}
        />
      );

    case "textarea":
      return (
        <textarea
          autoFocus
          rows={4}
          value={value}
          placeholder={step.placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            // Enter advances, Shift+Enter inserts a newline
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onAdvance();
            }
          }}
          className={cn(fieldClass, "resize-none leading-relaxed")}
        />
      );

    case "date":
      return (
        <input
          autoFocus
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdvance();
            }
          }}
          className={cn(fieldClass, "[color-scheme:dark]")}
        />
      );

    case "select":
      return (
        <select
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(fieldClass, "[&>option]:bg-neutral-900")}
        >
          <option value="">{step.placeholder ?? "Select an option"}</option>
          {step.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="flex flex-col gap-2.5">
          {step.options.map((option, index) => {
            const selected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                autoFocus={index === 0}
                onClick={() => onChange(option.value)}
                onDoubleClick={onAdvance}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-base transition outline-none",
                  selected
                    ? "border-white/50 bg-white/15 text-white"
                    : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10 focus-visible:border-white/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border transition",
                    selected ? "border-white" : "border-white/40",
                  )}
                >
                  {selected ? (
                    <span className="size-2.5 rounded-full bg-white" />
                  ) : null}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      );
  }
}
