export function Sparkline({
  values,
  className,
}: {
  values: Array<number>;
  className?: string;
}) {
  const W = 118;
  const H = 34;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * W,
    y: H - ((v - min) / span) * H,
  }));
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const last = points[points.length - 1];

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H + 8}`}
        className="w-full overflow-visible"
        aria-hidden
      >
        <path
          d={d}
          fill="none"
          stroke="#101210"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={last.x}
          cy={last.y}
          r={4}
          fill="#101210"
          stroke="var(--violet)"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}
