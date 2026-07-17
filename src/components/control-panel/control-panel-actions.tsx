import * as React from "react";

export function ControlPanelActions() {
  const [isPlaying, setIsPlaying] = React.useState(true);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        data-testid="control-panel-play-pause-button"
        onClick={() => setIsPlaying((v) => !v)}
        aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
        title={isPlaying ? "Pause" : "Play"}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-emerald-500/10 text-emerald-300 transition hover:bg-emerald-500/20 hover:text-emerald-200"
      >
        <i className={`fa ${isPlaying ? "fa-pause" : "fa-play"} text-[10px]`} />
      </button>
      <button
        type="button"
        data-testid="control-panel-reset-button"
        onClick={() => {}}
        aria-label="Reset simulation"
        title="Reset"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-amber-500/10 text-amber-300 transition hover:bg-amber-500/20 hover:text-amber-200"
      >
        <i className="fa fa-refresh text-[10px]" />
      </button>
    </div>
  );
}
