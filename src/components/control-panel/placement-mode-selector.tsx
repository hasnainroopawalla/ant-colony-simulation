import * as React from "react";
import { useSimulator } from "../contexts/simulator-context";
import { PlacementMode } from "../../simulator";

const MODES: { mode: PlacementMode; label: string; icon: string }[] = [
  { mode: PlacementMode.Food, label: "Food", icon: "fa-cutlery" },
  { mode: PlacementMode.Obstacle, label: "Obstacle", icon: "fa-square" },
];

export function PlacementModeSelector() {
  const simulator = useSimulator();

  const [activeMode, setActiveMode] = React.useState<PlacementMode>(
    simulator.getPlacementMode(),
  );

  const onSelect = React.useCallback(
    (mode: PlacementMode) => {
      simulator.setPlacementMode(mode);
      setActiveMode(mode);
    },
    [simulator],
  );

  return (
    <div className="border-b border-white/5 px-4 py-3">
      <div className="mb-2 font-mono text-[12px] font-semibold tracking-wider text-white/50 uppercase">
        Click to Place
      </div>
      <div className="flex gap-1.5">
        {MODES.map(({ mode, label, icon }) => {
          const isActive = mode === activeMode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onSelect(mode)}
              aria-pressed={isActive}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[11px] transition ${
                isActive
                  ? "bg-sky-500/20 text-sky-200"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              <i className={`fa ${icon} text-[10px]`} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
