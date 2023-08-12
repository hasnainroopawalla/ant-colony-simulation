import * as p5m from "p5";
import { circleCollision } from "../src/utils";

let circlePosition: p5m.Vector;
let circleDiameter: number;

describe("circleCollision", () => {
  beforeEach(() => {
    circlePosition = new p5m.Vector(10, 10);
    circleDiameter = 10;
  });
  test("should return true if candidate is inside the circle", () => {
    expect(
      circleCollision(new p5m.Vector(13, 10), circlePosition, circleDiameter)
    ).toBe(true);
  });
  test("should return true if candidate has collided with the circle boundary", () => {
    expect(
      circleCollision(new p5m.Vector(15, 10), circlePosition, circleDiameter)
    ).toBe(true);
  });
  test("should return false if candidate is outside the circle", () => {
    expect(
      circleCollision(new p5m.Vector(20, 20), circlePosition, circleDiameter)
    ).toBe(false);
  });
});
