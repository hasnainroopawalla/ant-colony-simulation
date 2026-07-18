import { Renderer, Scene } from "../renderer";
import p5 from "p5";
import { createSketch } from "./sketch";
import * as RenderConstants from "../render.constants";
import type { Antenna } from "../../simulations";
import { MathUtils, type Position } from "../../math";
import { WorldConstants } from "../../world";

export class P5Renderer extends Renderer {
  private p: p5;
  private pheromoneFieldImage: p5.Image;

  constructor(canvas: HTMLDivElement) {
    super();

    const sketch = createSketch(canvas, {
      frame: () => this.callbacks.frame(),
      mouseClick: (position: Position) => this.onMouseClick(position),
    });

    this.p = new p5(sketch, canvas);

    // Placeholder buffer; resized to the grid on first render.
    this.pheromoneFieldImage = this.p.createImage(1, 1);
  }

  public getFps(): number {
    return this.p.frameRate();
  }

  public getDeltaTime(): number {
    // convert to seconds
    const dt = this.p.deltaTime / 1000;

    // Clamp to avoid huge steps after pause/resume or a backgrounded tab,
    // which would otherwise make ants "teleport".
    return Math.min(dt, 1 / 30); // cap at one 30 FPS frame (~33ms)
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

    if (this.settings.showFoodQuadtree) {
      this.renderQuadtree(scene);
    }

    if (this.settings.showAntPerception) {
      this.renderAntPerception(scene);
    }
  }

  public onMouseClick(position: Position): void {
    this.callbacks.mouseClick(position);
  }

  private renderAnts(scene: Scene): void {
    scene.simulation.ants.forEach((ant) => {
      const antColor = ant.isCarryingFood()
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
      const { x, y } = colony.position;

      // Soft yellow glow halo
      this.p.push();
      this.p.noFill();
      this.p.strokeWeight(RenderConstants.COLONY_GLOW_WEIGHT);
      this.p.stroke(RenderConstants.COLONY_GLOW_COLOR);
      this.p.circle(x, y, RenderConstants.COLONY_RADIUS * 2 + 8);
      this.p.pop();

      // Body with bright yellow rim
      this.p.push();
      this.p.strokeWeight(RenderConstants.COLONY_BORDER_WEIGHT);
      this.p.stroke(RenderConstants.COLONY_BORDER_COLOR);
      this.p.fill(RenderConstants.COLONY_FILL_COLOR);
      this.p.circle(x, y, RenderConstants.COLONY_RADIUS * 2);
      this.p.pop();

      // food count
      this.p.push();
      this.p.noStroke();
      this.p.fill(RenderConstants.COLONY_TEXT_COLOR);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(RenderConstants.COLONY_TEXT_SIZE);
      this.p.textStyle(this.p.BOLD);
      this.p.text(colony.foodCount, x, y);
      this.p.pop();
    });
  }

  private renderFoodItems(scene: Scene): void {
    this.p.push();
    this.p.strokeWeight(RenderConstants.FOOD_ITEM_STROKE_WEIGHT);
    scene.foodItems.forEach((foodItem) => {
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
    });
    this.p.pop();
  }

  private renderObstacles(scene: Scene): void {
    this.p.push();
    this.p.strokeWeight(RenderConstants.OBSTACLE_STROKE_WEIGHT);
    this.p.stroke(RenderConstants.OBSTACLE_COLOR);
    this.p.fill(RenderConstants.OBSTACLE_COLOR);
    scene.obstacles.forEach((obstacle) => {
      this.p.rect(
        obstacle.dims.x,
        obstacle.dims.y,
        obstacle.dims.w,
        obstacle.dims.h,
        5 /* corner radius */,
      );
    });
    this.p.pop();
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

  private renderQuadtree(scene: Scene) {
    this.p.push();
    this.p.stroke(RenderConstants.QUADTREE_HIGHLIGHTED_COLOR);
    this.p.strokeWeight(RenderConstants.QUADTREE_HIGHLIGHTED_STROKE_WEIGHT);
    this.p.rectMode(this.p.CENTER);
    this.p.noFill();

    scene.foodQuadtree.getBoundaries().forEach((boundary) => {
      this.p.rect(boundary.x, boundary.y, boundary.w * 2, boundary.h * 2);
    });

    this.p.pop();
  }

  private renderAntPerception(scene: Scene): void {
    this.p.push();
    this.p.strokeWeight(RenderConstants.ANT_PERCEPTION_STROKE_WEIGHT);
    this.p.fill(
      RenderConstants.ANT_PERCEPTION_COLOR_GRAY,
      RenderConstants.ANT_PERCEPTION_COLOR_ALPHA,
    );
    scene.simulation.ants.forEach((ant) => {
      const perception = ant.getPerception();
      this.p.circle(
        perception.center.x,
        perception.center.y,
        perception.radius * 2,
      );
    });
    this.p.pop();
  }
}
