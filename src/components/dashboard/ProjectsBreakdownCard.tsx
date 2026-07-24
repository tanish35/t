import { Link } from "@tanstack/react-router";
import { IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  compact,
  withThousands,
  type MonthlyBucket,
  type ProjectSummary,
} from "@/lib/mock-dashboard";
import { Sparkline } from "./Sparkline";

export function ProjectsBreakdownCard({
  projects,
  monthly,
}: {
  projects: Array<ProjectSummary>;
  monthly: Array<MonthlyBucket>;
}) {
  const topCount = Math.max(...projects.map((p) => p.recordingCount));
  const monthTotals = monthly.map((m) => m.ready + m.inFlight);
  const thisMonth = monthTotals[monthTotals.length - 1];

  return (
    <section className="rounded-[26px] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_14px_32px_rgba(16,18,16,0.06)]">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_150px]">
        <div>
          <div className="mb-5 flex items-start justify-between gap-3">
            <h2 className="text-lg leading-tight font-bold tracking-[-0.01em] text-[var(--sea-ink)]">
              Projects &amp;<br />
              recordings
            </h2>
            <Link
              to="/projects"
              className="text-sm font-semibold text-[var(--sea-ink)] underline underline-offset-4"
            >
              See all
            </Link>
          </div>

          <ol className="relative flex flex-col gap-4 pl-5">
            <span
              className="absolute top-1.5 bottom-1.5 left-[3.5px] w-px bg-[var(--line)]"
              aria-hidden
            />
            {projects.map((project, i) => (
              <li key={project.id} className="relative">
                <span
                  className={cn(
                    "absolute top-1 -left-5 h-2 w-2 rounded-full",
                    i === 0
                      ? "bg-[var(--mint-deep)]"
                      : "border border-[var(--line)] bg-[var(--card)]",
                  )}
                  aria-hidden
                />
                <Link
                  to="/projects/$projectId/edit"
                  params={{ projectId: project.id }}
                  className="block no-underline"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[14px] font-semibold text-[var(--sea-ink)]">
                      {project.name}
                    </span>
                    <span className="shrink-0 text-[13px] font-semibold text-[var(--sea-ink)] tabular-nums">
                      {withThousands(project.recordingCount)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--mint-deep)]"
                      style={{
                        width: `${(project.recordingCount / topCount) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1.5 text-[12px] text-[var(--sea-ink-soft)]">
                    {compact(project.eventCount)} events
                    {project.lastRecordingLabel
                      ? ` · ${project.lastRecordingLabel}`
                      : ""}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-[20px] bg-[var(--mint)] p-4">
            <div className="flex items-start justify-between">
              <span className="text-[12.5px] font-medium text-[#101210]/65">
                This month
              </span>
              <IconArrowUpRight
                className="h-4 w-4 text-[#101210]"
                stroke={2.2}
              />
            </div>
            <div className="mt-3 text-[30px] leading-none font-bold tracking-[-0.03em] text-[#101210]">
              {thisMonth}
            </div>
            <div className="mt-1 text-[12px] font-medium text-[#101210]/65">
              recordings
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-[20px] bg-[var(--violet)] p-4">
            <div className="flex items-start justify-between">
              <span className="text-[12.5px] font-medium text-[#101210]/65">
                Trend
              </span>
              <IconArrowUpRight
                className="h-4 w-4 text-[#101210]"
                stroke={2.2}
              />
            </div>
            <div className="mt-3 text-[30px] leading-none font-bold tracking-[-0.03em] text-[#101210]">
              {compact(monthTotals.reduce((a, b) => a + b, 0))}
            </div>
            <div className="mt-1 text-[12px] font-medium text-[#101210]/65">
              6-month total
            </div>
            <Sparkline values={monthTotals} className="mt-auto pt-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
