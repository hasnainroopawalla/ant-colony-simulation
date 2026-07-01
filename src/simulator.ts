import type { Renderer } from "./render";
import type { Scene } from "./render/renderer";
import { Simulation } from "./simulations";
import { World } from "./world";

export class Simulator {
  public world: World;

  private renderer: Renderer;
  private simulation: Simulation;

  constructor(world: World, simulation: Simulation, renderer: Renderer) {
    this.world = world;
    this.simulation = simulation;
    this.renderer = renderer;

    this.renderer.setFrameCallback(() => this.update());
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
    this.simulation.update();

    this.renderer.render(this.getScene());
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
