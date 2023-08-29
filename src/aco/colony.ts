import { config } from "./config";
import { pointInCircle } from "./utils";
import { Vector } from "./vector";

export class Colony {
  p: p5;
  position: Vector;
  foodCount: number;

  constructor(p: p5) {
    this.p = p;
    this.position = new Vector(this.p.windowWidth / 2, this.p.windowHeight / 2);
    this.foodCount = 0;
  }

  public collide(antPosition: Vector) {
    return pointInCircle(antPosition, this.position, config.colonySize);
  }

  public incrementFoodCount() {
    this.foodCount++;
  }

  private renderFoodCount() {
    this.p.push();
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(config.colonyTextSize);
    this.p.text(this.foodCount, this.position.x, this.position.y);
    this.p.pop();
  }

  public render() {
    this.p.push();
    this.p.strokeWeight(config.colonyStrokeWeight);
    this.p.fill(config.colonyColor);
    this.p.circle(this.position.x, this.position.y, config.colonySize);
    this.p.pop();
    this.renderFoodCount();
  }
}
