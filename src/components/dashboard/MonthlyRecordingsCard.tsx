import { useState } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { withThousands, type MonthlyBucket } from "@/lib/mock-dashboard";
import { SERIES } from "./series";

const CHART_HEIGHT = 168;

export function MonthlyRecordingsCard({
  data,
  total,
}: {
  data: Array<MonthlyBucket>;
  total: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((b) => b.ready + b.inFlight));

  return (
    <section className="relative rounded-[26px] bg-[var(--card-dark)] p-6 text-white shadow-[0_18px_40px_rgba(16,18,16,0.14)]">
      <div className="mb-1 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-[-0.01em]">
            Recordings per month
          </h2>
          <p className="mt-0.5 text-[13px] text-white/55">
            Last {data.length} months
          </p>
        </div>

        <span className="rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] font-medium text-white/80">
          Monthly
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-6">
        <div className="shrink-0">
          <div className="flex items-center gap-1.5 text-[13px] text-white/55">
            Total captured
            <IconArrowUpRight
              className="h-3.5 w-3.5 text-[var(--mint)]"
              stroke={2.5}
            />
          </div>
          <div className="mt-1 text-[44px] leading-none font-bold tracking-[-0.03em]">
            {withThousands(total)}
          </div>
        </div>

        <div className="relative min-w-0 flex-1">
          <div
            className="flex items-end justify-end gap-2 sm:gap-3"
            style={{ height: CHART_HEIGHT }}
          >
            {data.map((bucket, i) => {
              const stackTotal = bucket.ready + bucket.inFlight;
              const stackH = Math.round((stackTotal / max) * CHART_HEIGHT);
              const inFlightH = Math.max(
                4,
                Math.round((bucket.inFlight / stackTotal) * stackH),
              );
              const readyH = Math.max(4, stackH - inFlightH);
              const isDim = hovered !== null && hovered !== i;

              return (
                <div
                  key={`${bucket.month}-${bucket.year}`}
                  className="flex h-full max-w-[54px] min-w-0 flex-1 cursor-default flex-col justify-end"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    className={cn(
                      "flex flex-col justify-end gap-[2px] transition-opacity duration-150",
                      isDim && "opacity-45",
                    )}
                    style={{ height: stackH }}
                  >
                    <div
                      className="rounded-t-[6px]"
                      style={{
                        height: inFlightH,
                        background: SERIES.inFlight.fill,
                      }}
                    />
                    <div
                      style={{ height: readyH, background: SERIES.ready.fill }}
                    />
                  </div>
                  <div className="mt-2.5 truncate text-center text-[11px] font-medium text-white/50">
                    {bucket.month}
                  </div>
                </div>
              );
            })}
          </div>

          {hovered !== null && (
            <ChartTooltip
              bucket={data[hovered]}
              count={data.length}
              index={hovered}
            />
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4">
        {Object.values(SERIES).map((s) => (
          <span
            key={s.label}
            className="flex items-center gap-2 text-[12px] text-white/65"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: s.fill }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </section>
  );
}

function ChartTooltip({
  bucket,
  index,
  count,
}: {
  bucket: MonthlyBucket;
  index: number;
  count: number;
}) {
  return (
    <div
      className="pointer-events-none absolute -top-2 z-10 min-w-[150px] rounded-xl border border-white/12 bg-[#101210] p-3 shadow-[0_10px_28px_rgba(0,0,0,0.4)]"
      style={{
        left: `${((index + 0.5) / count) * 100}%`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="mb-2 text-[12px] font-semibold text-white">
        {bucket.month} {bucket.year}
      </div>
      {[
        { ...SERIES.ready, value: bucket.ready },
        { ...SERIES.inFlight, value: bucket.inFlight },
      ].map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 py-0.5 text-[12px]"
        >
          <span className="flex items-center gap-1.5 text-white/60">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: row.fill }}
            />
            {row.label}
          </span>
          <span className="font-medium text-white tabular-nums">
            {row.value}
          </span>
        </div>
      ))}
      <div className="mt-1.5 flex items-center justify-between gap-4 border-t border-white/10 pt-1.5 text-[12px]">
        <span className="text-white/60">Total</span>
        <span className="font-semibold text-white tabular-nums">
          {bucket.ready + bucket.inFlight}
        </span>
      </div>
    </div>
  );
}
