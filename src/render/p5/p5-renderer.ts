import { Renderer, Scene } from "../renderer";
import p5 from "p5";
import { createSketch } from "./sketch";
import * as RenderConstants from "../render.constants";
import { Antenna, AntStateKind } from "../../simulations";
import { MathUtils, type Position } from "../../math";
import { WorldConstants } from "../../world";

export class P5Renderer extends Renderer {
  private p: p5;
  private pheromoneFieldImage: p5.Image;

  constructor(canvas: HTMLDivElement) {
    super();

    const sketch = createSketch(canvas, {
      frame: () => this.frameCallback(),
      onMouseClick: (position: Position) => this.onMouseClick(position),
    });

    this.p = new p5(sketch, canvas);

    // Placeholder buffer; resized to the grid on first render.
    this.pheromoneFieldImage = this.p.createImage(1, 1);
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

    if (this.settings.showPheromones) {
      this.renderPheromoneField(scene);
    }

    this.renderObstacles(scene);

    this.renderAnts(scene);
    this.renderColonies(scene);
    this.renderFoodItems(scene);
  }

  public onMouseClick(position: Position): void {
    this.mouseClickCallback(position);
  }

  private renderAnts(scene: Scene): void {
    scene.simulation.ants.forEach((ant) => {
      const antColor =
        ant.state.kind === AntStateKind.ReturningHomeWithFood
          ? RenderConstants.FOOD_ANT_COLOR
          : RenderConstants.HOME_ANT_COLOR;

      this.p.push();
      this.p.stroke(antColor);
      this.p.fill(antColor);
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
      this.p.circle(
        colony.position.x,
        colony.position.y,
        RenderConstants.COLONY_RADIUS * 2,
      );
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
      this.p.fill(
        RenderConstants.FOOD_ITEM_COLOR[0],
        RenderConstants.FOOD_ITEM_COLOR[1],
        RenderConstants.FOOD_ITEM_COLOR[2],
        MathUtils.mapRange(
          foodItem.quantity,
          0,
          WorldConstants.MAX_FOOD_QUANTITY,
          0,
          255,
        ), // alpha based on quantity
      );
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
      this.p.stroke(RenderConstants.OBSTACLE_COLOR);
      this.p.fill(RenderConstants.OBSTACLE_COLOR);
      this.p.rect(
        obstacle.dims.x,
        obstacle.dims.y,
        obstacle.dims.w,
        obstacle.dims.h,
        5 /* corner radius */,
      );
      this.p.pop();
    });
  }

  private renderAntennas(left: Antenna, front: Antenna, right: Antenna): void {
    this.p.circle(left.position.x, left.position.y, left.radius * 2);
    this.p.circle(front.position.x, front.position.y, front.radius * 2);
    this.p.circle(right.position.x, right.position.y, right.radius * 2);
  }

  private renderPheromoneField(scene: Scene): void {
    const field = scene.simulation.pheromoneField;
    const { rows, cols } = field.dimensions;
    const { food } = field.getGrids();

    const image = this.getPheromoneFieldImage(cols, rows);

    image.loadPixels();
    for (let cell = 0; cell < food.length; cell++) {
      this.writePheromoneCell(image.pixels, cell, food[cell]);
    }
    image.updatePixels();

    // Blit the low-res buffer once, scaled up to the canvas.
    this.p.push();
    this.p.image(image, 0, 0, this.p.width, this.p.height);
    this.p.pop();
  }

  /** Resizes the cached buffer to match the grid when dimensions change. */
  private getPheromoneFieldImage(cols: number, rows: number): p5.Image {
    if (
      this.pheromoneFieldImage.width !== cols ||
      this.pheromoneFieldImage.height !== rows
    ) {
      this.pheromoneFieldImage = this.p.createImage(cols, rows);
    }
    return this.pheromoneFieldImage;
  }

  /** Colors one cell by its food pheromone strength; empty cells stay transparent. */
  private writePheromoneCell(
    pixels: number[],
    cell: number,
    strength: number,
  ): void {
    const offset = cell * 4;

    if (strength <= 0) {
      pixels[offset + 3] = 0; // transparent where empty
      return;
    }

    const [r, g, b] = RenderConstants.FOOD_PHEROMONE_COLOR_RGB;

    pixels[offset] = r;
    pixels[offset + 1] = g;
    pixels[offset + 2] = b;
    // Maps a normalized pheromone strength [0,1] to overlay opacity (0-255)
    pixels[offset + 3] =
      Math.min(1, strength) * RenderConstants.PHEROMONE_FIELD_MAX_ALPHA;
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
