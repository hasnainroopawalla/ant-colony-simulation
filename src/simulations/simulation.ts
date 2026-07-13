import { Configurable, type Settings, type SettingsSchema } from "../settings";
import type { World } from "../world";
import type { Ant, Pheromone } from "./aco";

export type SimulationView = {
  ants: Ant[];
  pheromones: Pheromone[];
};

export abstract class Simulation<
  TSettings extends Settings = Settings,
> extends Configurable<TSettings> {
  protected world: World;

  constructor(world: World, settingsSchema: SettingsSchema<TSettings>) {
    super("Simulation", settingsSchema);

    this.world = world;
  }

  public abstract update(dt: number): void;

  // TODO: this should be generic, not ACO-specific
  public abstract getView(): SimulationView;
}
