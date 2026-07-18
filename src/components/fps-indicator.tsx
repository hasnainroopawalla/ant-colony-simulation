import { useStats } from "./use-stats";

export function FpsIndicator() {
  const { fps } = useStats();

  return (
    <div
      data-testid="fps-indicator"
      className="fixed right-3 bottom-3 z-20 flex items-center gap-1.5 rounded-md border border-white/5 bg-neutral-900/25 px-2 py-1 shadow-lg backdrop-blur-sm"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
      <span className="font-mono text-[9px] tabular-nums text-white/40">
        {fps.toFixed(0)} fps
      </span>
    </div>
  );
}
