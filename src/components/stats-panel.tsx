import * as React from "react";
import { formatElapsed } from "./utils";
import { useStats } from "./use-stats";

type StatRowProps = {
  label: string;
  value: React.ReactNode;
  accentClassName?: string;
};

function StatRow({
  label,
  value,
  accentClassName = "text-white",
}: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-[9px] tracking-wider text-white/60 uppercase">
        {label}
      </span>
      <span className={`font-mono text-[11px] tabular-nums ${accentClassName}`}>
        {value}
      </span>
    </div>
  );
}

export function StatsPanel() {
  const [isOpen, setIsOpen] = React.useState(true);

  const { antCount, foodAmount, elapsedTime } = useStats();

  if (!isOpen) {
    return (
      <button
        type="button"
        data-testid="stats-panel-toggle-button"
        onClick={() => setIsOpen(true)}
        aria-label="Show stats"
        className="fixed top-3 right-3 z-20 cursor-pointer rounded-md border border-white/5 bg-neutral-900/25 p-1.5 text-white/70 shadow-lg backdrop-blur-sm transition hover:text-white"
      >
        <i className="fa fa-bar-chart text-[11px]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      data-testid="stats-panel"
      onClick={() => setIsOpen(false)}
      aria-label="Hide stats"
      title="Click to hide"
      className="fixed top-3 right-3 z-20 cursor-pointer rounded-md border border-white/5 bg-neutral-900/25 text-left shadow-lg backdrop-blur-sm transition hover:bg-neutral-900/40"
    >
      <div className="flex min-w-28 flex-col gap-0.5 px-2 py-1.5">
        <StatRow
          label="Elapsed"
          value={formatElapsed(elapsedTime)}
          accentClassName="text-white/80"
        />
        <div className="my-1 border-t border-white/10" />
        <StatRow
          label="Food"
          value={foodAmount}
          accentClassName="text-lime-400"
        />
        <StatRow
          label="Ants"
          value={
            <span className="inline-flex items-center gap-1.5">
              <span className="text-amber-300">{antCount.home}</span>
              <span className="text-white/25">/</span>
              <span className="text-rose-400">{antCount.food}</span>
            </span>
          }
        />
      </div>
    </button>
  );
}
