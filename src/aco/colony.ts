import { config } from "./config";
import { p5i } from "../sketch";
import { circleCollision } from "./utils";

export class Colony {
  position: p5.Vector;
  foodCount: number;

  constructor() {
    this.position = p5i.createVector(p5i.windowWidth / 2, p5i.windowHeight / 2);
    this.foodCount = 0;
  }

  public collide(antPosition: p5.Vector) {
    return circleCollision(antPosition, this.position, config.colony.size);
  }

  public incrementFoodCount() {
    this.foodCount++;
  }

  private renderFoodCount() {
    p5i.push();
    p5i.textAlign(p5i.CENTER, p5i.CENTER);
    p5i.textSize(config.colony.textSize);
    p5i.text(this.foodCount, this.position.x, this.position.y);
    p5i.pop();
  }

  public render() {
    p5i.push();
    p5i.strokeWeight(config.colony.strokeWeight);
    p5i.fill(config.colony.color);
    p5i.circle(this.position.x, this.position.y, config.colony.size);
    p5i.pop();
    this.renderFoodCount();
  }
}
