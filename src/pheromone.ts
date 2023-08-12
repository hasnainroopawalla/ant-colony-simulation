import { config } from "./config";
import { p5i } from "./sketch";

export enum IPheromoneType {
  Wander,
  Food,
}

export class Pheromone {
  position: p5.Vector;
  type: IPheromoneType;
  strength: number;

  constructor(position: p5.Vector, type: IPheromoneType) {
    this.position = position;
    this.type = type;
    this.strength = 1;
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

    p5i.push();
    p5i.fill(colorR, colorG, colorB, this.strength * 200);
    p5i.strokeWeight(config.pheromone.strokeWeight);
    p5i.circle(this.position.x, this.position.y, config.pheromone.size);
    p5i.pop();
  }
}
