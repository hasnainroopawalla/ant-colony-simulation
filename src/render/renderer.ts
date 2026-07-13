import { Configurable } from "../settings";
import type { Ant, Pheromone } from "../simulations";
import { Obstacle } from "../world";
import type { Colony, FoodItem } from "../world";
import { RendererSettings, rendererSettingsSchema } from "./renderer.settings";
import type { Position } from "../math";

export type FrameCallback = () => void;

export type MouseClickCallback = (position: Position) => void;

// TODO: make this generic
export type Scene = {
  foodItems: FoodItem[];
  obstacles: Obstacle[];
  colonies: Colony[];
  simulation: { ants: Ant[]; pheromones: Pheromone[] };
};

export abstract class Renderer extends Configurable<RendererSettings> {
  protected frameCallback: FrameCallback;

  // TODO: consider using eventbus for this
  protected mouseClickCallback: MouseClickCallback;

  constructor() {
    super("Renderer", rendererSettingsSchema);

    this.frameCallback = () => {};
    this.mouseClickCallback = () => {};
  }

  public setFrameCallback(callback: FrameCallback): void {
    this.frameCallback = callback;
  }

  public setMouseClickCallback(callback: MouseClickCallback): void {
    this.mouseClickCallback = callback;
  }

  public abstract start(): void;

  public abstract pause(): void;

  public abstract isRunning(): boolean;

  public abstract render(scene: Scene): void;

  public abstract getFps(): number;

  public abstract getDeltaTime(): number;
}
