import * as React from "react";
import { useSettings } from "../contexts/settings-context";

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-4 mb-2 px-4 font-mono text-[12px] font-semibold tracking-wider text-white/50 uppercase">
      {title}
    </div>
  );
}

function SettingSlider({
  label,
  initialValue,
  min,
  max,
  onChange,
}: {
  label: string;
  initialValue: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const [value, setValue] = React.useState(initialValue);

  const _onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setValue(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <div className="px-4 py-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[11px] text-white/80">{label}</span>
        <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white/90">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={_onChange}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-sky-400"
      />
    </div>
  );
}

function SettingToggle({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between px-4 py-2 font-mono text-[11px] text-white/80 hover:bg-white/5">
      <span>{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 cursor-pointer accent-sky-400"
      />
    </label>
  );
}

export function ControlPanelContent() {
  const { getSettings, updateSetting } = useSettings();

  return (
    <>
      {Object.entries(getSettings()).map(([namespace, settings]) => (
        <React.Fragment key={namespace}>
          <SectionHeader title={namespace} />
          {settings.map((setting) => {
            if (setting.kind === "number") {
              return (
                <SettingSlider
                  key={setting.key}
                  label={setting.label}
                  initialValue={setting.value}
                  min={setting.min}
                  max={setting.max}
                  onChange={(value) =>
                    updateSetting(namespace, setting.key, value)
                  }
                />
              );
            }
            return null;
          })}
        </React.Fragment>
      ))}
    </>
  );

  // return ({ Object.entries( getSettings())}

  // <div className="py-2">
  //   <SectionHeader title="Ant Behavior" />
  //   <SettingSlider label="Speed" value={2} min={0} max={5} />
  //   <SettingSlider label="Wander Strength" value={20} min={0} max={100} />
  //   <SettingSlider label="Steering Limit" value={10} min={0} max={100} />
  //   <SettingSlider label="Perception Range" value={35} min={10} max={100} />

  //   <SectionHeader title="Pheromones" />
  //   <SettingSlider label="Evaporation Rate" value={30} min={0} max={100} />
  //   <SettingSlider label="Initial Strength" value={500} min={0} max={1000} />
  //   <SettingSlider label="Distance Between" value={200} min={0} max={500} />

  //   <SectionHeader title="Debug Overlays" />
  //   <SettingToggle label="Show perception range" />
  //   <SettingToggle label="Show home pheromones" defaultChecked />
  //   <SettingToggle label="Show food pheromones" defaultChecked />
  //   <SettingToggle label="Show quadtree" />
  // </div>
}
