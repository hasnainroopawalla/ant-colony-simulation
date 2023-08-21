import { config } from "./config";
import { circleCollision } from "./utils";

export class Colony {
  p: p5;
  position: p5.Vector;
  foodCount: number;

  constructor(p: p5) {
    this.p = p;
    this.position = this.p.createVector(
      this.p.windowWidth / 2,
      this.p.windowHeight / 2
    );
    this.foodCount = 0;
  }

  public collide(antPosition: p5.Vector) {
    return circleCollision(antPosition, this.position, config.colony.size);
  }

  public incrementFoodCount() {
    this.foodCount++;
  }

  private renderFoodCount() {
    this.p.push();
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(config.colony.textSize);
    this.p.text(this.foodCount, this.position.x, this.position.y);
    this.p.pop();
  }

  public render() {
    this.p.push();
    this.p.strokeWeight(config.colony.strokeWeight);
    this.p.fill(config.colony.color);
    this.p.circle(this.position.x, this.position.y, config.colony.size);
    this.p.pop();
    this.renderFoodCount();
  }
}
