import type { World } from "../world";
import { Ant } from "./aco/ant";

export abstract class Simulation {
  protected world: World;

  constructor(world: World) {
    this.world = world;
  }

  public abstract update(): void;

  // TODO: this should be generic, not ACO-specific
  public abstract getView(): { ants: Ant[] };
}
