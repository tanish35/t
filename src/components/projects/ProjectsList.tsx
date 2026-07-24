import { Link } from "@tanstack/react-router";
import { IconArrowUpRight, IconPlus } from "@tabler/icons-react";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import { compact, withThousands } from "@/lib/mock-dashboard";

export function ProjectsList() {
  return (
    <div className="h-screen flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="island-kicker mb-1.5">ReplayForge</p>
            <h1 className="text-[27px] leading-tight font-bold tracking-[-0.02em] text-[var(--sea-ink)]">Projects</h1>
            <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{MOCK_PROJECTS.length} projects · {withThousands(MOCK_PROJECTS.reduce((total, project) => total + project.recordingCount, 0))} recordings captured</p>
          </div>
          <Link to="/projects/new" className="inline-flex items-center gap-2 rounded-full bg-[var(--card-dark)] px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:opacity-90">
            <IconPlus className="h-4 w-4" stroke={2.4} />
            New project
          </Link>
        </header>

        <section className="overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--card)] shadow-[0_14px_32px_rgba(16,18,16,0.06)]">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[var(--line)] px-5 py-4 text-[11px] font-bold tracking-[0.12em] text-[var(--sea-ink-soft)] uppercase sm:grid-cols-[minmax(0,1fr)_110px_110px_120px_32px] sm:px-6">
            <span>Project</span><span className="hidden sm:block">Recordings</span><span className="hidden sm:block">Events</span><span className="hidden sm:block">Last activity</span><span />
          </div>
          <div className="divide-y divide-[var(--line)]">
            {MOCK_PROJECTS.map((project) => (
              <Link key={project.id} to="/projects/$projectId/edit" params={{ projectId: project.id }} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 no-underline hover:bg-[var(--link-bg-hover)] sm:grid-cols-[minmax(0,1fr)_110px_110px_120px_32px] sm:px-6">
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-[var(--sea-ink)]">{project.name}</span>
                  <span className="mt-1 block truncate text-[13px] text-[var(--sea-ink-soft)]">{project.description || "No description"}</span>
                </span>
                <span className="hidden text-sm font-semibold tabular-nums text-[var(--sea-ink)] sm:block">{withThousands(project.recordingCount)}</span>
                <span className="hidden text-sm text-[var(--sea-ink-soft)] sm:block">{compact(project.eventCount)}</span>
                <span className="hidden text-sm text-[var(--sea-ink-soft)] sm:block">{project.lastRecordingLabel || "No activity"}</span>
                <IconArrowUpRight className="h-4 w-4 text-[var(--sea-ink-soft)] transition group-hover:text-[var(--lagoon-deep)]" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
