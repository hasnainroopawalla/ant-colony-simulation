import {
  defaultSettings,
  toDescriptors,
  type Settings,
  type SettingsProvider,
  type SettingsSchema,
  type SettingDescriptor,
} from "../settings";
import type { World } from "../world";
import type { Ant } from "./aco/ant";
import type { Pheromone } from "./aco/pheromone";

export abstract class Simulation<
  TSettings extends Settings = Settings,
> implements SettingsProvider<TSettings> {
  public readonly namespace: string;

  protected world: World;
  protected settings: TSettings;

  private readonly settingsSchema: SettingsSchema<TSettings>;

  constructor(
    world: World,
    namespace: string,
    settingsSchema: SettingsSchema<TSettings>,
  ) {
    this.world = world;
    this.namespace = namespace;
    this.settingsSchema = settingsSchema;
    this.settings = defaultSettings(settingsSchema);
  }

  public abstract update(dt: number): void;

  // TODO: this should be generic, not ACO-specific
  public abstract getView(): { ants: Ant[]; pheromones: Pheromone[] };

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
