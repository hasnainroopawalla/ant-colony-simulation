import { AcoSimulationView } from "../render/renderer";
import { Configurable, type Settings, type SettingsSchema } from "../settings";
import type { World } from "../world";
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
  public abstract getView(): AcoSimulationView;
}
