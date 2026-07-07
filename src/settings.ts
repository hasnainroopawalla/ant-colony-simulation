export type SettingValue = number | boolean;

export type Settings = Record<string, SettingValue>;

type SettingSchema =
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

export type SettingsSchema<TSettings extends Settings> = {
  readonly [K in keyof TSettings]: SettingSchema;
};

export type SettingDescriptor = { key: string } & (
  | (Extract<SettingSchema, { kind: "number" }> & {
      value: number;
    })
  | (Extract<SettingSchema, { kind: "boolean" }> & {
      value: boolean;
    })
);

export type SettingsProvider<TSettings extends Settings = Settings> = {
  readonly namespace: string;
  getSettings: () => SettingDescriptor[];
  updateSettings<K extends keyof TSettings>(key: K, value: TSettings[K]): void;
};

export function defaultSettings<T extends Settings>(
  schema: SettingsSchema<T>,
): T {
  const out = {} as T;
  for (const key in schema) {
    out[key] = schema[key].default as T[typeof key];
  }
  return out;
}

export function toDescriptors<T extends Settings>(
  schema: SettingsSchema<T>,
  values: T,
): SettingDescriptor[] {
  return (Object.keys(schema) as Array<keyof T>).map((key) => ({
    ...schema[key],
    key,
    value: values[key],
  })) as SettingDescriptor[];
}
