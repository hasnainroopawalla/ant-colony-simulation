import { config } from "./config";

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
    this.strength -= config.pheromone.evaporationRate;
  }

  public shouldBeDestroyed() {
    return this.strength <= 0;
  }

  public render() {
    if (
      (this.type === IPheromoneType.Wander && !config.pheromone.wander.show) ||
      (this.type === IPheromoneType.Food && !config.pheromone.food.show)
    ) {
      return;
    }

    const [colorR, colorG, colorB] =
      this.type === IPheromoneType.Wander
        ? config.pheromone.wander.colorRGB
        : config.pheromone.food.colorRGB;

    this.p.push();
    this.p.fill(colorR, colorG, colorB, this.strength);
    this.p.strokeWeight(config.pheromone.strokeWeight);
    this.p.circle(this.position.x, this.position.y, config.pheromone.size);
    this.p.pop();
  }
}
