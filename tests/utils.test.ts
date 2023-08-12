import * as p5m from "p5";
import { distance, circleCollision } from "../src/utils";

let circlePosition: p5m.Vector;
let circleDiameter: number;

describe("distance", () => {
  test("should return the Euclidean distance between 2 points in a 2D space", () => {
    expect(distance(new p5m.Vector(2, 3), new p5m.Vector(2, 7))).toBe(4);
  });
  test("should return 0 if both points are the same", () => {
    expect(distance(new p5m.Vector(2, 3), new p5m.Vector(2, 3))).toBe(0);
  });
  test("should return the Euclidean distance between 2 points in a 2D space float", () => {
    expect(distance(new p5m.Vector(3, 5), new p5m.Vector(-2, 4))).toBeCloseTo(
      5.099
    );
  });
});

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
