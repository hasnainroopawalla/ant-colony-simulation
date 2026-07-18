import { Configurable } from "../settings";
import type { Ant } from "../simulations";
import { Obstacle, type Colony, type FoodItem } from "../world";
import { RendererSettings, rendererSettingsSchema } from "./renderer.settings";
import type { Position, Quadtree } from "../math";
import type { PheromoneField } from "../simulations/aco";

export type RendererCallbacks = {
  frame: () => void;
  mouseClick: (position: Position) => void;
};

export type SimulationView = {
  ants: Ant[];
  antCount: {
    home: number;
    food: number;
  };
  pheromoneField: PheromoneField;
};

// TODO: make this generic
export type Scene = {
  foodItems: FoodItem[];
  foodQuadtree: Quadtree<FoodItem>;
  obstacles: Obstacle[];
  colonies: Colony[];
  simulation: SimulationView;
};

export abstract class Renderer extends Configurable<RendererSettings> {
  protected callbacks: RendererCallbacks;

  constructor() {
    super("Renderer", rendererSettingsSchema);

    this.callbacks = {
      frame: () => {},
      mouseClick: () => {},
    };
  }

  public setCallbacks(callbacks: RendererCallbacks): void {
    this.callbacks = callbacks;
  }

  public abstract start(): void;

  public abstract pause(): void;

  public abstract isRunning(): boolean;

  public abstract render(scene: Scene): void;

  public abstract getFps(): number;

  public abstract getDeltaTime(): number;
}
