import { Renderer, Scene } from "../renderer";
import p5 from "p5";
import { createSketch } from "./sketch";
import RenderConfig from "../render.config";

export class P5Renderer extends Renderer {
  private p: p5;

  constructor(canvas: HTMLDivElement) {
    super();

    const sketch = createSketch(() => this.frameCallback());
    this.p = new p5(sketch, canvas);
  }

  public start(): void {
    this.p.loop();
  }

  public stop(): void {
    this.p.noLoop();
  }

  public isRunning(): boolean {
    return this.p.isLooping();
  }

  public render(scene: Scene): void {
    this.p.background(RenderConfig.worldBackground);

    this.renderObstacles(scene);

    this.renderAnts(scene);
    this.renderColonies(scene);
  }

  private renderAnts(scene: Scene): void {
    scene.simulation.ants.forEach((ant) => {
      this.p.push();
      this.p.strokeWeight(RenderConfig.antStrokeWeight);
      this.p.fill(RenderConfig.antColor);
      this.p.translate(ant.position.x, ant.position.y);
      this.p.rotate(ant.velocity.heading());
      this.p.ellipse(
        0,
        0,
        RenderConfig.antSize * 2,
        RenderConfig.antSize / 1.5,
      );
      this.p.pop();
    });
  }

  private renderColonies(scene: Scene): void {
    scene.colonies.forEach((colony) => {
      this.p.push();
      this.p.strokeWeight(RenderConfig.colonyStrokeWeight);
      this.p.fill(RenderConfig.colonyColor);
      this.p.circle(
        colony.position.x,
        colony.position.y,
        RenderConfig.colonySize,
      );
      this.p.pop();

      // food count
      this.p.push();
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(RenderConfig.colonyTextSize);
      this.p.text(colony.foodCount, colony.position.x, colony.position.y);
      this.p.pop();
    });
  }

  private renderObstacles(scene: Scene): void {
    scene.obstacles.forEach((obstacle) => {
      this.p.push();
      this.p.strokeWeight(RenderConfig.colonyStrokeWeight);
      this.p.stroke(RenderConfig.colonyColor);
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
}
