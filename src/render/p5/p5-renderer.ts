import { Renderer, Scene } from "../renderer";
import p5 from "p5";
import { createSketch } from "./sketch";
import * as RenderConstants from "../render.constants";
// TODO fix import
import { Antenna } from "../../simulations/aco/antenna";
import { PheromoneType } from "../../simulations/aco/pheromone";

export class P5Renderer extends Renderer {
  private p: p5;

  constructor(canvas: HTMLDivElement) {
    super();

    const sketch = createSketch(canvas, () => this.frameCallback());
    this.p = new p5(sketch, canvas);
  }

  public getFps(): number {
    return this.p.frameRate();
  }

  public getDeltaTime(): number {
    return this.p.deltaTime / 1000; // convert to seconds
  }

  public start(): void {
    this.p.loop();
  }

  public pause(): void {
    this.p.noLoop();
  }

  public isRunning(): boolean {
    return this.p.isLooping();
  }

  public render(scene: Scene): void {
    this.p.background(RenderConstants.WORLD_BACKGROUND);

    this.renderObstacles(scene);

    this.renderAnts(scene);
    this.renderColonies(scene);
    this.renderFoodItems(scene);

    if (this.settings.showPheromones) {
      this.renderPheromones(scene);
    }
  }

  private renderAnts(scene: Scene): void {
    scene.simulation.ants.forEach((ant) => {
      this.p.push();
      this.p.stroke(RenderConstants.ANT_COLOR);
      this.p.fill(RenderConstants.ANT_COLOR);
      this.p.translate(ant.position.x, ant.position.y);
      this.p.rotate(ant.velocity.heading());
      this.p.ellipse(
        0,
        0,
        RenderConstants.ANT_SIZE * 2,
        RenderConstants.ANT_SIZE / 1.5,
      );
      this.p.pop();

      if (this.settings.showAntAntennas) {
        this.renderAntennas(
          ant.antennas.left,
          ant.antennas.front,
          ant.antennas.right,
        );
      }
    });
  }

  private renderColonies(scene: Scene): void {
    scene.colonies.forEach((colony) => {
      this.p.push();
      this.p.strokeWeight(RenderConstants.COLONY_STROKE_WEIGHT);
      this.p.fill(RenderConstants.COLONY_COLOR);
      this.p.circle(colony.position.x, colony.position.y, colony.radius * 2);
      this.p.pop();

      // food count
      this.p.push();
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(RenderConstants.COLONY_TEXT_SIZE);
      this.p.text(colony.foodCount, colony.position.x, colony.position.y);
      this.p.pop();
    });
  }

  private renderFoodItems(scene: Scene): void {
    scene.foodItems.forEach((foodItem) => {
      this.p.push();
      this.p.strokeWeight(RenderConstants.FOOD_ITEM_STROKE_WEIGHT);
      this.p.fill(RenderConstants.FOOD_ITEM_COLOR);
      this.p.circle(
        foodItem.position.x,
        foodItem.position.y,
        foodItem.radius * 2,
      );
      this.p.pop();
    });
  }

  private renderObstacles(scene: Scene): void {
    scene.obstacles.forEach((obstacle) => {
      this.p.push();
      this.p.strokeWeight(RenderConstants.COLONY_STROKE_WEIGHT);
      this.p.stroke(RenderConstants.COLONY_COLOR);
      this.p.noFill();
      this.p.rect(
        obstacle.dims.x,
        obstacle.dims.y,
        obstacle.dims.w,
        obstacle.dims.h,
      );
      this.p.pop();
    });
  }

  private renderPheromones(scene: Scene): void {
    scene.simulation.pheromones.forEach((pheromone) => {
      const [colorR, colorG, colorB] =
        pheromone.type === PheromoneType.Home
          ? RenderConstants.HOME_PHEROMONE_COLOR_RGB
          : RenderConstants.FOOD_PHEROMONE_COLOR_RGB;

      this.p.push();
      this.p.fill(colorR, colorG, colorB, pheromone.strength);
      this.p.strokeWeight(RenderConstants.PHEROMONE_STROKE_WEIGHT);
      this.p.circle(
        pheromone.position.x,
        pheromone.position.y,
        RenderConstants.PHEROMONE_SIZE,
      );
      this.p.pop();
    });
  }

  public renderAntennas(left: Antenna, front: Antenna, right: Antenna): void {
    this.p.circle(left.position.x, left.position.y, left.radius * 2);
    this.p.circle(front.position.x, front.position.y, front.radius * 2);
    this.p.circle(right.position.x, right.position.y, right.radius * 2);
  }

  //   private renderPerception(ant: Antenna): void {
  //     this.p.push();
  //     this.p.strokeWeight(AcoConfig.antPerceptionStrokeWeight);
  //     this.p.fill(
  //       AcoConfig.antPerceptionColorGray,
  //       AcoConfig.antPerceptionColorAlpha,
  //     );
  //     const perception = this.getPerception();
  //     this.p.circle(perception.x, perception.y, this.settings.antPerceptionRange * 2);
  //     this.p.pop();
  // }
}
