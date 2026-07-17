import * as React from "react";
import { useSettings } from "../contexts/settings-context";
import { SettingDescriptor } from "../../settings";

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
  initialValue,
  onChange,
}: {
  label: string;
  initialValue: boolean;
  onChange: (value: boolean) => void;
}) {
  const [value, setValue] = React.useState(initialValue);

  const _onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setValue(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <label className="flex cursor-pointer items-center justify-between px-4 py-2 font-mono text-[11px] text-white/80 hover:bg-white/5">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        className="h-4 w-4 cursor-pointer accent-sky-400"
        onChange={_onChange}
      />
    </label>
  );
}

export function ControlPanelContent() {
  const { getSettings, updateSetting } = useSettings();

  const getSettingComponent = React.useCallback(
    (setting: SettingDescriptor, namespace: string) => {
      switch (setting.kind) {
        case "number":
          return (
            <SettingSlider
              key={setting.key}
              label={setting.label}
              initialValue={setting.value}
              min={setting.min}
              max={setting.max}
              onChange={(value) => updateSetting(namespace, setting.key, value)}
            />
          );
        case "boolean":
          return (
            <SettingToggle
              key={setting.key}
              label={setting.label}
              initialValue={setting.value}
              onChange={(value) => updateSetting(namespace, setting.key, value)}
            />
          );
        default:
          return null;
      }
    },
    [],
  );

  return (
    <>
      {Object.entries(getSettings()).map(([namespace, settings]) => (
        <React.Fragment key={namespace}>
          <SectionHeader title={namespace} />
          {settings.map((setting) => getSettingComponent(setting, namespace))}
        </React.Fragment>
      ))}
    </>
  );
}
