import { Configurable } from "../settings";
import type { Ant } from "../simulations/aco/ant";
import type { Pheromone } from "../simulations/aco/pheromone";
import type { Colony } from "../world/colony";
import type { FoodItem } from "../world/food-item";
import { Obstacle } from "../world/obstacle";
import { RendererSettings, rendererSettingsSchema } from "./renderer.settings";

export type FrameCallback = () => void;

// TODO: make this generic
export type Scene = {
  foodItems: FoodItem[];
  obstacles: Obstacle[];
  colonies: Colony[];
  simulation: { ants: Ant[]; pheromones: Pheromone[] };
};

export abstract class Renderer extends Configurable<RendererSettings> {
  protected frameCallback: FrameCallback;

  constructor() {
    super("Renderer", rendererSettingsSchema);

    this.frameCallback = () => {};
  }

  public setFrameCallback(callback: FrameCallback): void {
    this.frameCallback = callback;
  }

  public abstract start(): void;

  public abstract pause(): void;

  public abstract isRunning(): boolean;

  public abstract render(scene: Scene): void;

  public abstract getFps(): number;

  public abstract getDeltaTime(): number;
}
