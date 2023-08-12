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

  public render() {
    p5i.push();
    p5i.strokeWeight(config.pheromone.strokeWeight);
    p5i.fill(255, 0, 0, this.strength * 100);
    p5i.circle(this.position.x, this.position.y, config.pheromone.size);
    p5i.pop();
  }
}
