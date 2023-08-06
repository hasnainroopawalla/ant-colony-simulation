import * as p5 from "p5";
import { config } from "./config";

export class Colony {
  p: p5;
  position: p5.Vector;
  foodCount: number;

  constructor(p: p5) {
    this.p = p;
    this.position = p.createVector(p.windowWidth / 2, p.windowHeight / 2);
    this.foodCount = 0;
  }

  public collide(antPosition: p5.Vector) {
    return (
      this.p.dist(
        antPosition.x,
        antPosition.y,
        this.position.x,
        this.position.y
      ) <
      config.colony.size / 2
    );
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
