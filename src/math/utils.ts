import type { Position, RectangleDims } from "./types";
import { Vector } from "./vector";

function distanceSquared(position1: Vector, position2: Vector): number {
  return (
    Math.pow(position1.x - position2.x, 2) +
    Math.pow(position1.y - position2.y, 2)
  );
}

function distance(
  position1: Vector,
  position2: Vector,
  euclidean?: boolean,
): number {
  const distance = distanceSquared(position1, position2);
  return euclidean ? Math.sqrt(distance) : distance;
}

function isPointInCircle(
  pointPosition: Vector,
  circlePosition: Vector,
  circleDiameter: number,
): boolean {
  return (
    distance(pointPosition, circlePosition) <= Math.pow(circleDiameter / 2, 2)
  );
}

function areCirclesIntersecting(
  circle1Position: Vector,
  circle1Radius: number,
  circle2Position: Vector,
  circle2Radius: number,
): boolean {
  return (
    distance(circle1Position, circle2Position) <=
    Math.pow(circle1Radius + circle2Radius, 2)
  );
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function isLineIntersectingRect(
  p1: Position,
  p2: Position,
  rect: RectangleDims,
): boolean {
  const { x, y, w, h } = rect;
  const topLeft: Position = { x, y };
  const topRight: Position = { x: x + w, y };
  const bottomLeft: Position = { x, y: y + h };
  const bottomRight: Position = { x: x + w, y: y + h };

  return (
    areLinesIntersecting(p1, p2, topLeft, topRight) ||
    areLinesIntersecting(p1, p2, topRight, bottomRight) ||
    areLinesIntersecting(p1, p2, bottomRight, bottomLeft) ||
    areLinesIntersecting(p1, p2, bottomLeft, topLeft)
  );
}

function areLinesIntersecting(
  a1: Position,
  a2: Position,
  b1: Position,
  b2: Position,
): boolean {
  const denominator =
    (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
  const uA =
    ((b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x)) /
    denominator;
  const uB =
    ((a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x)) /
    denominator;
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

function fromAngle(angle: number): Vector {
  return new Vector(Math.cos(angle), Math.sin(angle));
}

export const MathUtils = {
  distance,
  randomFloat,
  isPointInCircle,
  areCirclesIntersecting,
  isLineIntersectingRect,
  fromAngle,
};
