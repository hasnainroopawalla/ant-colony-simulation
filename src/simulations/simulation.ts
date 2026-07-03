import type { World } from "../world";
import type { Ant } from "./aco/ant";
import type { Pheromone } from "./aco/pheromone";

export abstract class Simulation {
  protected world: World;

  constructor(world: World) {
    this.world = world;
  }

  public abstract update(): void;

  // TODO: this should be generic, not ACO-specific
  public abstract getView(): { ants: Ant[]; pheromones: Pheromone[] };
}
