import * as React from "react";
import { ControlPanelContent } from "./content";

export function ControlPanel() {
  const [isPlaying, setIsPlaying] = React.useState(true);

  return (
    <aside
      id="control-panel-container"
      data-testid="control-panel-container"
      className="relative flex h-screen w-75 shrink-0 flex-col border-r border-black/50 bg-[#121212] text-white"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/2 px-4 py-2.5">
        <span className="font-mono text-sm font-semibold tracking-wide">
          Ant Colony Simulation
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            data-testid="control-panel-play-pause-button"
            onClick={() => setIsPlaying((v) => !v)}
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
            title={isPlaying ? "Pause" : "Play"}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-emerald-500/10 text-emerald-300 transition hover:bg-emerald-500/20 hover:text-emerald-200"
          >
            <i
              className={`fa ${isPlaying ? "fa-pause" : "fa-play"} text-[10px]`}
            />
          </button>
          <button
            type="button"
            data-testid="control-panel-reset-button"
            onClick={() => {
              /* mock */
            }}
            aria-label="Reset simulation"
            title="Reset"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-amber-500/10 text-amber-300 transition hover:bg-amber-500/20 hover:text-amber-200"
          >
            <i className="fa fa-refresh text-[10px]" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ControlPanelContent />
      </div>

      <div className="flex items-center justify-between border-t border-white/5 bg-white/2 px-4 py-2 font-mono text-[10px] text-white/40">
        <span>by Hasnain Roopawalla</span>
        <a
          href="https://github.com/hasnainroopawalla/ant-colony-simulation"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          title="View source on GitHub"
          className="cursor-pointer transition hover:text-white/80"
        >
          <i className="fa fa-github text-sm" />
        </a>
      </div>
    </aside>
  );
}
