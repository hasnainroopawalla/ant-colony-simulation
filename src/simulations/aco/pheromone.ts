import AcoConfig from "./aco.config";
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
      (this.type === IPheromoneType.Home && !AcoConfig.showHomePheromones) ||
      (this.type === IPheromoneType.Food && !AcoConfig.showFoodPheromones)
    ) {
      return;
    }
    const [colorR, colorG, colorB] =
      this.type === IPheromoneType.Home
        ? AcoConfig.homePheromoneColorRGB
        : AcoConfig.pheromoneFoodColorRGB;

    this.p.push();
    this.p.fill(colorR, colorG, colorB, this.strength);
    this.p.strokeWeight(AcoConfig.pheromoneStrokeWeight);
    this.p.circle(this.position.x, this.position.y, AcoConfig.pheromoneSize);
    this.p.pop();
  }
}
