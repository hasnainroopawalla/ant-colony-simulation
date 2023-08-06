import * as p5 from "p5";
import { config } from "./config";

export class Colony {
  p: p5;
  position: p5.Vector;

  constructor(p: p5) {
    this.p = p;
    this.position = p.createVector(p.windowWidth / 2, p.windowHeight / 2);
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

  public render() {
    this.p.push();
    this.p.strokeWeight(1);
    this.p.fill(220);
    this.p.circle(this.position.x, this.position.y, config.colony.size);
    this.p.pop();
  }
}
