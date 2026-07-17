import { ControlPanelContent } from "./content";
import { ControlPanelActions } from "./control-panel-actions";
import { PlacementModeSelector } from "./placement-mode-selector";

export function ControlPanel() {
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
        <ControlPanelActions />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PlacementModeSelector />
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
