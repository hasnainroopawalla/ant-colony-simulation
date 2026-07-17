import { Configurable } from "../settings";
import type { Ant } from "../simulations";
import { Obstacle, type Colony, type FoodItem } from "../world";
import { RendererSettings, rendererSettingsSchema } from "./renderer.settings";
import type { Position, Quadtree } from "../math";
import type { PheromoneField } from "../simulations/aco";

export type FrameCallback = () => void;

export type MouseClickCallback = (position: Position) => void;

export type AcoSimulationView = {
  ants: Ant[];
  pheromoneField: PheromoneField;
};

// TODO: make this generic
export type Scene = {
  foodItems: FoodItem[];
  foodQuadtree: Quadtree<FoodItem>;
  obstacles: Obstacle[];
  colonies: Colony[];
  simulation: AcoSimulationView;
};

export abstract class Renderer extends Configurable<RendererSettings> {
  protected callbacks: {
    frame: FrameCallback;
    mouseClick: MouseClickCallback;
  };

  constructor() {
    super("Renderer", rendererSettingsSchema);

    this.callbacks = {
      frame: () => {},
      mouseClick: () => {},
    };
  }

  public setFrameCallback(callback: FrameCallback): void {
    this.callbacks.frame = callback;
  }

  public setMouseClickCallback(callback: MouseClickCallback): void {
    this.callbacks.mouseClick = callback;
  }

  public abstract start(): void;

  public abstract pause(): void;

  public abstract isRunning(): boolean;

  public abstract render(scene: Scene): void;

  public abstract getFps(): number;

  public abstract getDeltaTime(): number;
}
