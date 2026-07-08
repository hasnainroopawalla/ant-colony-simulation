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

function defaultSettings<T extends Settings>(schema: SettingsSchema<T>): T {
  const out = {} as T;
  for (const key in schema) {
    out[key] = schema[key].default as T[typeof key];
  }
  return out;
}

function toDescriptors<T extends Settings>(
  schema: SettingsSchema<T>,
  values: T,
): SettingDescriptor[] {
  return (Object.keys(schema) as Array<keyof T>).map((key) => ({
    ...schema[key],
    key,
    value: values[key],
  })) as SettingDescriptor[];
}

export class Configurable<TSettings extends Settings = Settings> {
  public readonly namespace: string;

  protected settings: TSettings;

  private readonly settingsSchema: SettingsSchema<TSettings>;

  constructor(namespace: string, settingsSchema: SettingsSchema<TSettings>) {
    this.namespace = namespace;
    this.settingsSchema = settingsSchema;
    this.settings = defaultSettings(settingsSchema);
  }

  public getSettings(): SettingDescriptor[] {
    return toDescriptors(this.settingsSchema, this.settings);
  }

  public updateSettings<K extends keyof TSettings>(
    key: K,
    value: TSettings[K],
  ): void {
    this.settings[key] = value;
  }
}
