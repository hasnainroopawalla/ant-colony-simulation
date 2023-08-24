import { config } from "./config";
import p5 from "p5";

export enum IPheromoneType {
  Wander,
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
    this.strength = 255;
  }

  public evaporate() {
    this.strength -= config.pheromoneEvaporationRate;
  }

  public shouldBeDestroyed() {
    return this.strength <= 0;
  }

  public render() {
    if (
      (this.type === IPheromoneType.Wander && !config.showPheromoneWander) ||
      (this.type === IPheromoneType.Food && !config.showPheromoneFood)
    ) {
      return;
    }

    const [colorR, colorG, colorB] =
      this.type === IPheromoneType.Wander
        ? config.pheromoneWanderColorRGB
        : config.pheromoneFoodColorRGB;

    this.p.push();
    this.p.fill(colorR, colorG, colorB, this.strength);
    this.p.strokeWeight(config.pheromoneStrokeWeight);
    this.p.circle(this.position.x, this.position.y, config.pheromoneSize);
    this.p.pop();
  }
}
