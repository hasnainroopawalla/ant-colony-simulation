import * as React from "react";

type IControlPanelContentProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAcoConfig?: (...args: any[]) => void;
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mt-4 mb-2 px-4 text-[10px] font-semibold tracking-wider text-white/50 uppercase">
    {title}
  </div>
);

const MockSlider = ({
  label,
  value,
  min = 0,
  max = 100,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
}) => (
  <div className="px-4 py-2">
    <div className="mb-1 flex items-center justify-between">
      <span className="text-[11px] text-white/80">{label}</span>
      <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white/90">
        {value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      defaultValue={value}
      className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-sky-400"
    />
  </div>
);

const MockToggle = ({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) => (
  <label className="flex cursor-pointer items-center justify-between px-4 py-2 text-[11px] text-white/80 hover:bg-white/5">
    <span>{label}</span>
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      className="h-4 w-4 cursor-pointer accent-sky-400"
    />
  </label>
);

export const ControlPanelContent = (_props: IControlPanelContentProps) => {
  return (
    <div className="py-2">
      <SectionHeader title="Ant Behavior" />
      <MockSlider label="Max Speed" value={2} min={0} max={5} />
      <MockSlider label="Wander Strength" value={20} min={0} max={100} />
      <MockSlider label="Steering Limit" value={10} min={0} max={100} />
      <MockSlider label="Perception Range" value={35} min={10} max={100} />

      <SectionHeader title="Pheromones" />
      <MockSlider label="Evaporation Rate" value={30} min={0} max={100} />
      <MockSlider label="Initial Strength" value={500} min={0} max={1000} />
      <MockSlider label="Distance Between" value={200} min={0} max={500} />

      <SectionHeader title="Debug Overlays" />
      <MockToggle label="Show perception range" />
      <MockToggle label="Show home pheromones" defaultChecked />
      <MockToggle label="Show food pheromones" defaultChecked />
      <MockToggle label="Show quadtree" />
    </div>
  );
};
