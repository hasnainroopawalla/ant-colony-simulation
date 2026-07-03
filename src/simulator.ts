import { EventBus, IEvents, Unsubscribe } from "./events";
import type { Renderer, Scene } from "./render";
import { Simulation } from "./simulations";
import { World } from "./world";

export class Simulator {
  public world: World;

  private eventBus: EventBus;

  private renderer: Renderer;
  private simulation: Simulation;

  private lastFrameTime: number | null = null;
  private static readonly MAX_DT = 0.1;

  constructor(world: World, simulation: Simulation, renderer: Renderer) {
    this.world = world;
    this.simulation = simulation;
    this.renderer = renderer;

    this.eventBus = new EventBus();

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
    this.lastFrameTime = null;
  }

  private update(): void {
    const now = performance.now();
    const dt =
      this.lastFrameTime === null
        ? 1 / 60
        : Math.min(
            (now - this.lastFrameTime) / 1000,
            Simulator.MAX_DT,
          );
    this.lastFrameTime = now;

    this.simulation.update(dt);

    this.renderer.render(this.getScene());

    this.emit("stats.update", {
      antCount: this.simulation.getView().ants.length,
      fps: this.renderer.getFps(),
      pheromoneCount: this.simulation.getView().pheromones.length,
    });
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
