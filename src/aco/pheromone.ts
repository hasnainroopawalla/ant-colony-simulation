import { config } from "./config";
import p5 from "p5";

export enum IPheromoneType {
  Home,
  Food,
}

export class Pheromone {
  p: p5;
  position: p5.Vector;
  type: IPheromoneType;
  strength: number;

  constructor(p: p5, position: p5.Vector, type: IPheromoneType) {
    this.p = p;
    this.position = position;
    this.type = type;
    this.strength = 500;
  }

  private evaporate() {
    this.strength -= config.pheromoneEvaporationRate;
  }

  public shouldBeDestroyed() {
    return this.strength <= 0;
  }

  public update() {
    this.evaporate();
  }

  public render() {
    if (
      (this.type === IPheromoneType.Home && !config.showHomePheromones) ||
      (this.type === IPheromoneType.Food && !config.showFoodPheromones)
    ) {
      return;
    }

    const [colorR, colorG, colorB] =
      this.type === IPheromoneType.Home
        ? config.homePheromoneColorRGB
        : config.pheromoneFoodColorRGB;

    this.p.push();
    this.p.fill(colorR, colorG, colorB, this.strength);
    this.p.strokeWeight(config.pheromoneStrokeWeight);
    this.p.circle(this.position.x, this.position.y, config.pheromoneSize);
    this.p.pop();
  }
}
