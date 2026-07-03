import { EventBus, IEvents, Unsubscribe } from "./events";
import { FpsMonitor } from "./fps-monitor";
import type { Renderer, Scene } from "./render";
import { Simulation } from "./simulations";
import { World } from "./world";

export type Stats = {
  fps: number;
  antCount: number;
  pheromoneCount: number;
};

export class Simulator {
  public world: World;

  private eventBus: EventBus;

  private renderer: Renderer;
  private simulation: Simulation;

  private fpsMonitor: FpsMonitor;

  constructor(world: World, simulation: Simulation, renderer: Renderer) {
    this.world = world;
    this.simulation = simulation;
    this.renderer = renderer;

    this.eventBus = new EventBus();
    this.fpsMonitor = new FpsMonitor();

    this.renderer.setFrameCallback(() => this.update());
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

  public stop(): void {
    if (!this.renderer.isRunning()) {
      console.warn("Simulation is not running.");
      return;
    }

    this.renderer.stop();
  }

  private update(): void {
    const dt = this.renderer.getDeltaTime();

    this.simulation.update(dt);

    this.renderer.render(this.getScene());

    const view = this.simulation.getView();

    const fps = this.fpsMonitor.update(dt);

    if (fps !== null) {
      this.emit("stats.update", {
        fps: fps,
        antCount: view.ants.length,
        pheromoneCount: view.pheromones.length,
      });
    }
  }

  private getScene(): Scene {
    return {
      foodItems: this.world.foodItems,
      obstacles: this.world.obstacles,
      colonies: this.world.colonies,
      simulation: this.simulation.getView(),
    };
  }
}
