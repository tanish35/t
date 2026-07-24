import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { StepField } from "./fields";
import type { Step, StepValues } from "./types";

type StepFormProps = {
  steps: Step[];
  onSubmit: (values: StepValues) => void | Promise<void>;
  backgroundSrc?: string;
  submitLabel?: string;
  doneMessage?: string;
};

const slide = {
  enter: (direction: number) => ({
    x: direction * 72,
    opacity: 0,
    filter: "blur(8px)",
  }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (direction: number) => ({
    x: direction * -72,
    opacity: 0,
    filter: "blur(8px)",
  }),
};

export function StepForm({
  steps,
  onSubmit,
  backgroundSrc = "/login.gif",
  submitLabel = "Submit",
  doneMessage = "All set.",
}: StepFormProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<StepValues>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const step = steps[index];
  const value = values[step.name] ?? "";
  const isLast = index === steps.length - 1;

  function setValue(next: string) {
    setError(null);
    setValues((prev) => ({ ...prev, [step.name]: next }));
  }

  async function advance() {
    const trimmed = value.trim();

    if (step.required !== false && !trimmed) {
      setError("This one's required.");
      return;
    }
    const validationError = step.validate?.(trimmed) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isLast) {
      setDirection(1);
      setIndex(index + 1);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...values, [step.name]: trimmed });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  function back() {
    if (index === 0) return;
    setError(null);
    setDirection(-1);
    setIndex(index - 1);
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <img
        src={backgroundSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative flex h-full items-center justify-center px-5 py-12">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.06] shadow-[0_24px_70px_-24px_rgba(0,0,0,0.85)] backdrop-blur-3xl"
        >
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/[0.03]" />

          <div className="relative p-8 sm:p-10">
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-6 text-center"
              >
                <p className="text-2xl font-semibold text-white">
                  {doneMessage}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-8 flex items-center gap-3">
                  <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      className="h-full rounded-full bg-white/80"
                      initial={false}
                      animate={{
                        width: `${((index + 1) / steps.length) * 100}%`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 28,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium tracking-wide text-white/45 tabular-nums">
                    {index + 1} / {steps.length}
                  </span>
                </div>

                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={step.name}
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                      {step.question}
                    </h2>
                    {step.hint ? (
                      <p className="mt-2 text-sm text-white/50">{step.hint}</p>
                    ) : null}

                    <div className="mt-6">
                      <StepField
                        step={step}
                        value={value}
                        onChange={setValue}
                        onAdvance={advance}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 h-5">
                  {error ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-rose-300"
                    >
                      {error}
                    </motion.p>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={back}
                    disabled={index === 0}
                    className="text-sm font-medium text-white/55 transition hover:text-white disabled:pointer-events-none disabled:opacity-0"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={advance}
                    disabled={submitting}
                    className="rounded-full border border-white/20 bg-white/90 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLast ? (submitting ? "Saving..." : submitLabel) : "Next"}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
