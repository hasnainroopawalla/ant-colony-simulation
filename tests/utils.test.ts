import { distance, pointInCircle, Vector } from "../src/aco";
import { randomFloat } from "../src/aco/utils";

let circlePosition: Vector;
let circleDiameter: number;

describe("Squared distance", () => {
  test("should return the squared distance between 2 points in a 2D space", () => {
    expect(distance(new Vector(2, 3), new Vector(2, 7))).toBe(16);
  });
  test("should return 0 if both points are the same", () => {
    expect(distance(new Vector(2, 3), new Vector(2, 3))).toBe(0);
  });
  test("should return the squared distance between 2 points in a 2D space float", () => {
    expect(distance(new Vector(3, 5), new Vector(-2, 4))).toBe(26);
  });
});

describe("euclideanDistance", () => {
  test("should return the Euclidean distance between 2 points in a 2D space", () => {
    expect(distance(new Vector(2, 3), new Vector(2, 7), true)).toBe(4);
  });
  test("should return 0 if both points are the same", () => {
    expect(distance(new Vector(2, 3), new Vector(2, 3), true)).toBe(0);
  });
  test("should return the Euclidean distance between 2 points in a 2D space float", () => {
    expect(distance(new Vector(3, 5), new Vector(-2, 4), true)).toBeCloseTo(
      5.099
    );
  });
});

describe("pointInCircle", () => {
  beforeEach(() => {
    circlePosition = new Vector(10, 10);
    circleDiameter = 10;
  });
  test("should return true if candidate is inside the circle", () => {
    expect(
      pointInCircle(new Vector(13, 10), circlePosition, circleDiameter)
    ).toBe(true);
  });
  test("should return true if candidate has collided with the circle boundary", () => {
    expect(
      pointInCircle(new Vector(15, 10), circlePosition, circleDiameter)
    ).toBe(true);
  });
  test("should return false if candidate is outside the circle", () => {
    expect(
      pointInCircle(new Vector(20, 20), circlePosition, circleDiameter)
    ).toBe(false);
  });
});

describe("randomFloat", () => {
  test("should return value in range negative-positive", () => {
    const result = randomFloat(-0.5, 0.5);
    expect(result).toBeGreaterThan(-0.5);
    expect(result).toBeLessThan(0.5);
  });
  test("should return value in range positive-positive", () => {
    const result = randomFloat(12, 30);
    expect(result).toBeGreaterThan(12);
    expect(result).toBeLessThan(30);
  });
  test("should return value in range negative-negative", () => {
    const result = randomFloat(-10, -5);
    expect(result).toBeGreaterThan(-10);
    expect(result).toBeLessThan(-5);
  });
});
