import * as AcoConstants from "./aco.constants";
import type { Vector } from "../../math";

export enum PheromoneType {
  Home,
  Food,
}

export class Pheromone {
  public position: Vector;
  public type: PheromoneType;
  public strength: number;

  constructor(position: Vector, type: PheromoneType) {
    this.position = position;
    this.type = type;
    this.strength = AcoConstants.PHEROMONE_INITIAL_STRENGTH;
  }

  private evaporate(dt: number): void {
    this.strength -= AcoConstants.PHEROMONE_EVAPORATION_RATE * dt;
  }

  public shouldBeDestroyed(): boolean {
    return this.strength <= 0;
  }

  public update(dt: number): void {
    this.evaporate(dt);
  }
}
