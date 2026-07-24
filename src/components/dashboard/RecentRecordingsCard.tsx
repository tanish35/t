import { IconDotsVertical, IconWaveSine } from "@tabler/icons-react";
import type { RecentRecording } from "@/lib/mock-dashboard";
import { STATUS_META } from "./series";

export function RecentRecordingsCard({
  recordings,
}: {
  recordings: Array<RecentRecording>;
}) {
  return (
    <section className="rounded-[26px] border border-[var(--line)] bg-[var(--secondary)] p-5 shadow-[0_14px_32px_rgba(16,18,16,0.06)]">
      <div className="mb-4 flex items-center gap-3 px-1">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--card-dark)]">
          <IconWaveSine className="h-5 w-5 text-[var(--mint)]" stroke={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold tracking-[-0.01em] text-[var(--sea-ink)]">
            Recent recordings
          </h2>
          <p className="text-[13px] text-[var(--sea-ink-soft)]">
            Across all projects
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {recordings.map((rec) => {
          const status = STATUS_META[rec.status];
          return (
            <div
              key={rec.id}
              className="group flex items-center gap-3 rounded-2xl bg-[var(--card)] px-3.5 py-3 transition hover:bg-[var(--link-bg-hover)]"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: status.color }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-semibold text-[var(--sea-ink)]">
                  {rec.name}
                </div>
                <div className="truncate text-[12px] text-[var(--sea-ink-soft)]">
                  {rec.projectName} · {rec.createdLabel}
                  {rec.durationLabel ? ` · ${rec.durationLabel}` : ""}
                </div>
              </div>
              <span className="shrink-0 text-[11.5px] font-semibold text-[var(--sea-ink-soft)]">
                {status.label}
              </span>
              <button
                type="button"
                aria-label={`Actions for ${rec.name}`}
                className="shrink-0 rounded-lg p-1 text-[var(--ink-muted)] opacity-0 transition group-hover:opacity-100 hover:bg-[var(--muted)]"
              >
                <IconDotsVertical className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
