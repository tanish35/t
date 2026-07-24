import { IconChartHistogram } from "@tabler/icons-react";
import { compact, withThousands } from "@/lib/mock-dashboard";

function polarPoint(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const s = polarPoint(cx, cy, r, from);
  const e = polarPoint(cx, cy, r, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

export function ReadyRateCard({
  rate,
  events,
  recordings,
}: {
  rate: number;
  events: number;
  recordings: number;
}) {
  const pct = Math.round(rate * 100);
  const end = 180 + rate * 180;
  const knob = polarPoint(100, 100, 78, end);

  return (
    <section className="rounded-[26px] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_14px_32px_rgba(16,18,16,0.06)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold tracking-[-0.01em] text-[var(--sea-ink)]">
          Capture health
        </h2>
        <span className="text-[13px] text-[var(--sea-ink-soft)]">
          {withThousands(recordings)} recordings
        </span>
      </div>

      <div className="rounded-[20px] bg-[var(--mint)] p-6">
        <div className="flex items-start justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <IconChartHistogram
              className="h-[18px] w-[18px] text-[#101210]"
              stroke={2}
            />
          </span>
          <div className="text-right">
            <div className="text-[13px] font-medium text-[#101210]/60">
              Events captured
            </div>
            <div className="text-[17px] font-bold text-[#101210]">
              {compact(events)}
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <svg
              viewBox="0 0 200 112"
              className="w-[188px]"
              role="img"
              aria-label={`${pct}% of recordings reached ready`}
            >
              <path
                d={arcPath(100, 100, 78, 180, 360)}
                fill="none"
                stroke="#101210"
                strokeOpacity={0.14}
                strokeWidth={17}
                strokeLinecap="round"
              />
              <path
                d={arcPath(100, 100, 78, 180, end)}
                fill="none"
                stroke="#101210"
                strokeWidth={17}
                strokeLinecap="round"
              />
              <circle
                cx={knob.x}
                cy={knob.y}
                r={6}
                fill="var(--violet)"
                stroke="var(--mint)"
                strokeWidth={2}
              />
            </svg>
            <div className="-mt-1 text-[13px] font-medium text-[#101210]/60">
              Ready rate
            </div>
          </div>

          <div className="pb-1 text-right">
            <div className="text-[38px] leading-none font-bold tracking-[-0.03em] text-[#101210]">
              {pct}%
            </div>
            <div className="mt-1 text-[13px] font-medium text-[#101210]/60">
              reached ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
