export type SettingValue = number | boolean;

export type Settings = Record<string, SettingValue>;

export type SettingSchema =
  | {
      kind: "number";
      label: string;
      default: number;
      min: number;
      max: number;
      step: number;
    }
  | {
      kind: "boolean";
      label: string;
      default: boolean;
    };

export type SettingDescriptor =
  | (Extract<SettingSchema, { kind: "number" }> & { value: number })
  | (Extract<SettingSchema, { kind: "boolean" }> & { value: boolean });

export type SettingsProvider<TSettings extends Settings = Settings> = {
  readonly namespace: string;
  getSettings: () => SettingDescriptor[];
  updateSettings: (
    key: keyof TSettings,
    value: TSettings[keyof TSettings],
  ) => void;
};
