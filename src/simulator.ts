import { EventBus, IEvents, Unsubscribe } from "./events";
import { FpsMonitor } from "./fps-monitor";
import { Position } from "./math";
import type { Renderer, Scene, SimulationView } from "./render";
import { Configurable } from "./settings";
import { Simulation } from "./simulations";
import type { World } from "./world";

export type Stats = {
  fps: number;
  antCount: number;
};

export enum PlacementMode {
  Food,
  Obstacle,
}

export class Simulator {
  public world: World;

  private eventBus: EventBus;

  private renderer: Renderer;
  private simulation: Simulation;

  private fpsMonitor: FpsMonitor;

  private placementMode: PlacementMode;

  constructor(world: World, simulation: Simulation, renderer: Renderer) {
    this.world = world;
    this.simulation = simulation;
    this.renderer = renderer;

    this.eventBus = new EventBus();
    this.fpsMonitor = new FpsMonitor();

    this.placementMode = PlacementMode.Food;

    this.renderer.setFrameCallback(() => this.update());

    this.renderer.setMouseClickCallback((position) =>
      this.onMouseClick(position),
    );
  }

  public on<K extends keyof IEvents>(
    event: K,
    handler: (data: IEvents[K]) => void,
  ): Unsubscribe {
    return this.eventBus.subscribe(event, handler);
  }

  public emit<K extends keyof IEvents>(event: K, data: IEvents[K]): void {
    this.eventBus.emit(event, data);
  }

  public start(): void {
    if (this.renderer.isRunning()) {
      console.warn("Simulation is already running.");
      return;
    }

    this.renderer.start();
  }

  public pause(): void {
    if (!this.renderer.isRunning()) {
      console.warn("Simulation is not running.");
      return;
    }

    this.renderer.pause();
  }

  public getSettingsProviders(): Map<string, Configurable> {
    return new Map(
      [this.simulation, this.renderer].map((p) => [p.namespace, p]),
    );
  }

  public setPlacementMode(mode: PlacementMode): void {
    this.placementMode = mode;
  }

  public getPlacementMode(): PlacementMode {
    return this.placementMode;
  }

  private onMouseClick(position: Position): void {
    switch (this.placementMode) {
      case PlacementMode.Food:
        this.world.createFoodCluster(position);
        break;
      case PlacementMode.Obstacle:
        this.world.createObstacle(position);
        break;
    }
  }

  private update(): void {
    const dt = this.renderer.getDeltaTime();

    this.simulation.update(dt);

    this.world.update();

    const view = this.simulation.getView();

    this.renderer.render(this.getScene(view));

    const fps = this.fpsMonitor.update(dt);

    if (fps !== null) {
      this.emit("stats.update", {
        fps: fps,
        antCount: view.ants.length,
      });
    }
  }

  private getScene(view: SimulationView): Scene {
    return {
      foodItems: this.world.foodItems,
      foodQuadtree: this.world.foodQuadtree,
      obstacles: this.world.obstacles,
      colonies: this.world.colonies,
      simulation: view,
    };
  }
}
