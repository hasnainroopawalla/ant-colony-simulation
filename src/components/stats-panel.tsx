import * as React from "react";

type StatRowProps = {
  label: string;
  value: React.ReactNode;
  accentClassName?: string;
};

const StatRow = ({
  label,
  value,
  accentClassName = "text-white",
}: StatRowProps) => (
  <div className="flex items-center justify-between gap-6">
    <span className="text-[11px] tracking-wider text-white/60 uppercase">
      {label}
    </span>
    <span className={`font-mono text-sm tabular-nums ${accentClassName}`}>
      {value}
    </span>
  </div>
);

export const StatsPanel = () => {
  // Mock values — real data will be wired later.
  const fps = 60;
  const antCount = 100;
  const pheromoneCount = 1284;

  return (
    <div
      data-testid="stats-panel"
      className="fixed top-4 right-4 z-20 min-w-45 rounded-lg border border-white/5 bg-neutral-900/25 px-3 py-2 text-white shadow-lg backdrop-blur-sm"
    >
      <div className="flex flex-col gap-1">
        <StatRow
          label="FPS"
          value={fps.toFixed(0)}
          accentClassName="text-emerald-400"
        />
        <StatRow label="Ants" value={antCount} />
        <StatRow label="Pheromones" value={pheromoneCount} />
      </div>
    </div>
  );
};
