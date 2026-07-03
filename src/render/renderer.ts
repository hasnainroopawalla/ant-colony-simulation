import type { Ant } from "../simulations/aco/ant";
import type { Pheromone } from "../simulations/aco/pheromone";
import type { Colony } from "../world/colony";
import type { FoodItem } from "../world/food-item";
import { Obstacle } from "../world/obstacle";

export type FrameCallback = () => void;

// TODO: make this generic
export type Scene = {
  foodItems: FoodItem[];
  obstacles: Obstacle[];
  colonies: Colony[];
  simulation: { ants: Ant[]; pheromones: Pheromone[] };
};

export abstract class Renderer {
  protected frameCallback: FrameCallback;

  constructor() {
    this.frameCallback = () => {};
  }

  public setFrameCallback(callback: FrameCallback): void {
    this.frameCallback = callback;
  }

  public abstract start(): void;

  public abstract stop(): void;

  public abstract isRunning(): boolean;

  public abstract render(scene: Scene): void;
}
