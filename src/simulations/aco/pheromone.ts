import AcoConfig from "./aco.config";
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
    this.strength = AcoConfig.pheromoneInitialStrength;
  }

  private evaporate(): void {
    this.strength -= AcoConfig.pheromoneEvaporationRate;
  }

  public shouldBeDestroyed(): boolean {
    return this.strength <= 0;
  }

  public update(): void {
    this.evaporate();
  }
}
