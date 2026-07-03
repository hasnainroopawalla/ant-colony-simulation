import { ControlPanelContent } from "./content";

type IControlPanelProps = {
  setCanvasInteraction?: (_: boolean) => void;
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAcoConfig?: (...args: any[]) => void;
};

export const ControlPanel = (props: IControlPanelProps) => {
  const { setCanvasInteraction, updateAcoConfig } = props;

  const handleMouseOver = () => setCanvasInteraction?.(false);
  const handleMouseOut = () => setCanvasInteraction?.(true);

  return (
    <aside
      id="control-panel-container"
      data-testid="control-panel-container"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="relative flex h-screen w-75 shrink-0 flex-col border-r border-black/50 bg-neutral-800 text-white"
    >
      <div className="flex items-center border-b border-white/5 bg-white/2 px-4 py-3">
        <span className="text-sm font-semibold tracking-wide">
          Ant Colony Simulation
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ControlPanelContent updateAcoConfig={updateAcoConfig} />
      </div>
    </aside>
  );
};
