import { Vector } from "./vector";

describe("Vector", () => {
  describe("constructor", () => {
    test("should default to the origin", () => {
      const v = new Vector();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    test("should store the provided components", () => {
      const v = new Vector(3, -4);
      expect(v.x).toBe(3);
      expect(v.y).toBe(-4);
    });
  });

  describe("add", () => {
    test("should return the component-wise sum", () => {
      const result = new Vector(1, 2).add(new Vector(3, 4));
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });

    test("should not mutate the original vector", () => {
      const original = new Vector(1, 2);
      original.add(new Vector(3, 4));
      expect(original.x).toBe(1);
      expect(original.y).toBe(2);
    });
  });

  describe("sub", () => {
    test("should return the component-wise difference", () => {
      const result = new Vector(5, 7).sub(new Vector(2, 3));
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
    });
  });

  describe("mult", () => {
    test("should scale both components", () => {
      const result = new Vector(2, -3).mult(4);
      expect(result.x).toBe(8);
      expect(result.y).toBe(-12);
    });

    test("should collapse to the origin when scaled by zero", () => {
      const result = new Vector(2, -3).mult(0);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(0);
    });
  });

  describe("rotate", () => {
    test("should rotate 90 degrees counter-clockwise", () => {
      const result = new Vector(1, 0).rotate(Math.PI / 2);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(1);
    });

    test("should rotate 180 degrees", () => {
      const result = new Vector(1, 0).rotate(Math.PI);
      expect(result.x).toBeCloseTo(-1);
      expect(result.y).toBeCloseTo(0);
    });

    test("should preserve magnitude", () => {
      const result = new Vector(3, 4).rotate(0.9);
      expect(result.getMagnitude()).toBeCloseTo(5);
    });
  });

  describe("direction / heading", () => {
    test("should return 0 for a vector pointing right", () => {
      expect(new Vector(1, 0).direction()).toBeCloseTo(0);
      expect(new Vector(1, 0).heading()).toBeCloseTo(0);
    });

    test("should return PI/2 for a vector pointing up", () => {
      expect(new Vector(0, 1).direction()).toBeCloseTo(Math.PI / 2);
      expect(new Vector(0, 1).heading()).toBeCloseTo(Math.PI / 2);
    });
  });

  describe("getMagnitude", () => {
    test("should return the Euclidean length", () => {
      expect(new Vector(3, 4).getMagnitude()).toBe(5);
    });

    test("should return 0 for the zero vector", () => {
      expect(new Vector(0, 0).getMagnitude()).toBe(0);
    });
  });

  describe("setMagnitude", () => {
    test("should scale the vector to the given length while keeping direction", () => {
      const result = new Vector(3, 4).setMagnitude(10);
      expect(result.getMagnitude()).toBeCloseTo(10);
      expect(result.direction()).toBeCloseTo(new Vector(3, 4).direction());
    });
  });

  describe("limit", () => {
    test("should clamp a vector longer than the max", () => {
      const result = new Vector(3, 4).limit(2.5);
      expect(result.getMagnitude()).toBeCloseTo(2.5);
    });

    test("should leave a vector shorter than the max unchanged", () => {
      const result = new Vector(3, 4).limit(10);
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
    });
  });

  describe("normalize", () => {
    test("should return a unit vector in the same direction", () => {
      const result = new Vector(3, 4).normalize();
      expect(result.getMagnitude()).toBeCloseTo(1);
      expect(result.direction()).toBeCloseTo(new Vector(3, 4).direction());
    });
  });

  describe("set", () => {
    test("should assign both components to the same value in place", () => {
      const v = new Vector(1, 2);
      v.set(5);
      expect(v.x).toBe(5);
      expect(v.y).toBe(5);
    });
  });
});
