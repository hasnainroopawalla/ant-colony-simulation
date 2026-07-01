import AcoConfig from "./aco.config";
import RenderConfig from "../../render/render.config";
import { Vector } from "../../math";

export enum IPheromoneType {
  Home,
  Food,
}

export class Pheromone {
  p: p5;
  position: Vector;
  type: IPheromoneType;
  strength: number;

  constructor(p: p5, position: Vector, type: IPheromoneType) {
    this.p = p;
    this.position = position;
    this.type = type;
    this.strength = AcoConfig.pheromoneInitialStrength;
  }

  private evaporate() {
    this.strength -= AcoConfig.pheromoneEvaporationRate;
  }

  public shouldBeDestroyed() {
    return this.strength <= 0;
  }

  public update() {
    this.evaporate();
  }

  public render() {
    if (
      this.shouldBeDestroyed() ||
      (this.type === IPheromoneType.Home && !RenderConfig.showHomePheromones) ||
      (this.type === IPheromoneType.Food && !RenderConfig.showFoodPheromones)
    ) {
      return;
    }
    const [colorR, colorG, colorB] =
      this.type === IPheromoneType.Home
        ? RenderConfig.homePheromoneColorRGB
        : RenderConfig.foodPheromoneColorRGB;

    this.p.push();
    this.p.fill(colorR, colorG, colorB, this.strength);
    this.p.strokeWeight(RenderConfig.pheromoneStrokeWeight);
    this.p.circle(this.position.x, this.position.y, RenderConfig.pheromoneSize);
    this.p.pop();
  }
}
