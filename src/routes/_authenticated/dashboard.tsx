import { createFileRoute, Link } from "@tanstack/react-router";
import { IconPlus } from "@tabler/icons-react";
import { MOCK_DASHBOARD, withThousands } from "@/lib/mock-dashboard";
import { MonthlyRecordingsCard } from "@/components/dashboard/MonthlyRecordingsCard";
import { ReadyRateCard } from "@/components/dashboard/ReadyRateCard";
import { RecentRecordingsCard } from "@/components/dashboard/RecentRecordingsCard";
import { ProjectsBreakdownCard } from "@/components/dashboard/ProjectsBreakdownCard";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { totals, monthly, projects, recent } = MOCK_DASHBOARD;

  return (
    <div className="h-screen flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="island-kicker mb-1.5">ReplayForge</p>
            <h1 className="text-[27px] leading-tight font-bold tracking-[-0.02em] text-[var(--sea-ink)]">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
              {totals.projects} projects · {withThousands(totals.recordings)}{" "}
              recordings captured
            </p>
          </div>

          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--card-dark)] px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:opacity-90"
          >
            <IconPlus className="h-4 w-4" stroke={2.4} />
            New project
          </Link>
        </header>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.08fr_1fr]">
          <div className="flex flex-col gap-5">
            <MonthlyRecordingsCard data={monthly} total={totals.recordings} />
            <ReadyRateCard
              rate={totals.readyRate}
              events={totals.events}
              recordings={totals.recordings}
            />
          </div>

          <div className="flex flex-col gap-5">
            <RecentRecordingsCard recordings={recent} />
            <ProjectsBreakdownCard projects={projects} monthly={monthly} />
          </div>
        </div>
      </div>
    </div>
  );
}
