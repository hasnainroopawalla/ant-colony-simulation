import type {
  Settings,
  SettingsProvider,
  SettingDescriptor,
} from "../settings-provider";
import type { World } from "../world";
import type { Ant } from "./aco/ant";
import type { Pheromone } from "./aco/pheromone";

export abstract class Simulation<
  TSettings extends Settings = Settings,
> implements SettingsProvider<TSettings> {
  public readonly namespace: string;

  protected world: World;

  constructor(world: World, namespace: string) {
    this.world = world;
    this.namespace = namespace;
  }

  public abstract update(dt: number): void;

  // TODO: this should be generic, not ACO-specific
  public abstract getView(): { ants: Ant[]; pheromones: Pheromone[] };

  public abstract getSettings(): SettingDescriptor[];

  public abstract updateSettings(
    key: keyof TSettings,
    value: TSettings[keyof TSettings],
  ): void;
}
