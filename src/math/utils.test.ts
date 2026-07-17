import { MathUtils } from "./utils";
import { Vector } from "./vector";

const {
  distance,
  isPointInCircle,
  isCircleIntersectingRect,
  randomFloat,
  randomInt,
  arePointsClose,
  isLineIntersectingRect,
  fromAngle,
  clampNumber,
  toCellIndex,
  toClampedCellRange,
  mapRange,
} = MathUtils;

let circlePosition: Vector;
let circleRadius: number;

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
      5.099,
    );
  });
});

describe("isPointInCircle", () => {
  beforeEach(() => {
    circlePosition = new Vector(10, 10);
    circleRadius = 5;
  });
  test("should return true if candidate is inside the circle", () => {
    expect(
      isPointInCircle(new Vector(13, 10), circlePosition, circleRadius),
    ).toBe(true);
  });
  test("should return true if candidate has collided with the circle boundary", () => {
    expect(
      isPointInCircle(new Vector(15, 10), circlePosition, circleRadius),
    ).toBe(true);
  });
  test("should return false if candidate is outside the circle", () => {
    expect(
      isPointInCircle(new Vector(20, 20), circlePosition, circleRadius),
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

describe("randomInt", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should return an integer within the inclusive range", () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(1, 5);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(5);
    }
  });

  test("should return min when Math.random is 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(randomInt(3, 8)).toBe(3);
  });

  test("should return max when Math.random approaches 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    expect(randomInt(3, 8)).toBe(8);
  });

  test("should use defaults (0..1) when called without arguments", () => {
    for (let i = 0; i < 50; i++) {
      const result = randomInt();
      expect([0, 1]).toContain(result);
    }
  });
});

describe("arePointsClose", () => {
  test("should return true when points are within the threshold", () => {
    expect(arePointsClose(new Vector(0, 0), new Vector(3, 4), 5)).toBe(true);
  });

  test("should return true when the distance equals the threshold", () => {
    expect(arePointsClose(new Vector(0, 0), new Vector(3, 4), 5)).toBe(true);
  });

  test("should return false when points are farther than the threshold", () => {
    expect(arePointsClose(new Vector(0, 0), new Vector(3, 4), 4)).toBe(false);
  });

  test("should return true for identical points", () => {
    expect(arePointsClose(new Vector(2, 2), new Vector(2, 2), 0)).toBe(true);
  });
});

describe("isLineIntersectingRect", () => {
  const rect = { x: 10, y: 10, w: 20, h: 20 };

  test("should return true when the segment crosses through the rectangle", () => {
    expect(
      isLineIntersectingRect({ x: 0, y: 20 }, { x: 40, y: 20 }, rect),
    ).toBe(true);
  });

  test("should return true when the segment crosses a single edge", () => {
    expect(
      isLineIntersectingRect({ x: 0, y: 20 }, { x: 15, y: 20 }, rect),
    ).toBe(true);
  });

  test("should return false when the segment is entirely outside", () => {
    expect(isLineIntersectingRect({ x: 0, y: 0 }, { x: 5, y: 0 }, rect)).toBe(
      false,
    );
  });

  test("should return false when the segment is fully contained (no edge crossed)", () => {
    expect(
      isLineIntersectingRect({ x: 15, y: 15 }, { x: 25, y: 25 }, rect),
    ).toBe(false);
  });
});

describe("fromAngle", () => {
  test("should return a unit vector pointing right at angle 0", () => {
    const v = fromAngle(0);
    expect(v.x).toBeCloseTo(1);
    expect(v.y).toBeCloseTo(0);
  });

  test("should return a unit vector pointing up at angle PI/2", () => {
    const v = fromAngle(Math.PI / 2);
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(1);
  });

  test("should return a unit vector pointing left at angle PI", () => {
    const v = fromAngle(Math.PI);
    expect(v.x).toBeCloseTo(-1);
    expect(v.y).toBeCloseTo(0);
  });

  test("should always return a unit-length vector", () => {
    const v = fromAngle(Math.PI / 3);
    expect(Math.hypot(v.x, v.y)).toBeCloseTo(1);
  });
});

describe("clampNumber", () => {
  test("should return the value when within bounds", () => {
    expect(clampNumber(5, 0, 10)).toBe(5);
  });

  test("should clamp to the lower bound", () => {
    expect(clampNumber(-3, 0, 10)).toBe(0);
  });

  test("should clamp to the upper bound", () => {
    expect(clampNumber(15, 0, 10)).toBe(10);
  });

  test("should handle reversed bounds", () => {
    expect(clampNumber(15, 10, 0)).toBe(10);
    expect(clampNumber(-3, 10, 0)).toBe(0);
  });

  test("should return the bound when the value equals it", () => {
    expect(clampNumber(10, 0, 10)).toBe(10);
    expect(clampNumber(0, 0, 10)).toBe(0);
  });
});

describe("mapRange", () => {
  test("should map a value from one range to another", () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
  });

  test("should map the input minimum to the output minimum", () => {
    expect(mapRange(0, 0, 10, 20, 40)).toBe(20);
  });

  test("should map the input maximum to the output maximum", () => {
    expect(mapRange(10, 0, 10, 20, 40)).toBe(40);
  });

  test("should support inverted output ranges", () => {
    expect(mapRange(5, 0, 10, 100, 0)).toBe(50);
  });

  test("should extrapolate values outside the input range", () => {
    expect(mapRange(15, 0, 10, 0, 100)).toBe(150);
  });
});

describe("isCircleIntersectingRect", () => {
  const rect = { x: 10, y: 10, w: 20, h: 20 }; // spans (10,10)..(30,30)

  test("should return true when the circle center is inside the rectangle", () => {
    expect(isCircleIntersectingRect({ x: 20, y: 20 }, 1, rect)).toBe(true);
  });

  test("should return true when the circle overlaps an edge from outside", () => {
    // closest point (10, 20) is 5 away; radius 6 reaches it
    expect(isCircleIntersectingRect({ x: 5, y: 20 }, 6, rect)).toBe(true);
  });

  test("should return false when the circle stops short of an edge", () => {
    // closest point (10, 20) is 5 away; radius 4 does not reach it
    expect(isCircleIntersectingRect({ x: 5, y: 20 }, 4, rect)).toBe(false);
  });

  test("should return true when the circle just touches a corner (boundary)", () => {
    // closest point (10, 10) is exactly 5 away (3-4-5 triangle)
    expect(isCircleIntersectingRect({ x: 7, y: 6 }, 5, rect)).toBe(true);
  });

  test("should return false when the circle is entirely outside", () => {
    expect(isCircleIntersectingRect({ x: 0, y: 0 }, 2, rect)).toBe(false);
  });
});

describe("toCellIndex", () => {
  test("should return 0 for a coordinate at the grid origin", () => {
    expect(toCellIndex(0, 8)).toBe(0);
  });

  test("should floor a coordinate within the first cell", () => {
    expect(toCellIndex(7, 8)).toBe(0);
  });

  test("should advance to the next cell at the boundary", () => {
    expect(toCellIndex(8, 8)).toBe(1);
  });

  test("should map coordinates into the correct cell", () => {
    expect(toCellIndex(20, 8)).toBe(2);
  });

  test("should return a negative index for coordinates left of the origin", () => {
    expect(toCellIndex(-1, 8)).toBe(-1);
  });
});

describe("toClampedCellRange", () => {
  test("should convert a span into an inclusive cell-index range", () => {
    expect(toClampedCellRange(7, 20, 8, 5)).toEqual([0, 2]);
  });

  test("should clamp the lower bound to 0", () => {
    expect(toClampedCellRange(-10, 5, 8, 5)).toEqual([0, 0]);
  });

  test("should clamp the upper bound to the last index", () => {
    expect(toClampedCellRange(30, 100, 8, 5)).toEqual([3, 5]);
  });

  test("should collapse to the last index when the span is beyond the grid", () => {
    expect(toClampedCellRange(100, 200, 8, 5)).toEqual([5, 5]);
  });
});
