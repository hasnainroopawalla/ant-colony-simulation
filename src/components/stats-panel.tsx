import * as React from "react";
import { useSimulator } from "./contexts/simulator-context";

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
  <div className="flex items-center justify-between gap-4">
    <span className="font-mono text-[9px] tracking-wider text-white/60 uppercase">
      {label}
    </span>
    <span className={`font-mono text-[11px] tabular-nums ${accentClassName}`}>
      {value}
    </span>
  </div>
);

export const StatsPanel = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  const { fps } = useStats();
  const antCount = 100;
  const pheromoneCount = 1284;

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
          label="FPS"
          value={fps.toFixed(0)}
          accentClassName="text-emerald-400"
        />
        <StatRow label="Ants" value={antCount} />
        <StatRow label="Pheromones" value={pheromoneCount} />
      </div>
    </button>
  );
};

const useStats = () => {
  const sim = useSimulator();

  const [fps, setFps] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = sim.on("stats.update", (data) => {
      setFps(data.fps);
    });

    return () => {
      unsubscribe();
    };
  }, [sim]);

  return { fps };
};
