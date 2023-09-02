import { Obstacle } from "./obstacle";
import { Vector } from "./vector";

export function distanceSquared(position1: Vector, position2: Vector): number {
  return (
    Math.pow(position1.x - position2.x, 2) +
    Math.pow(position1.y - position2.y, 2)
  );
}

export function distance(
  position1: Vector,
  position2: Vector,
  euclidean?: boolean
): number {
  const distance = distanceSquared(position1, position2);
  return euclidean ? Math.sqrt(distance) : distance;
}

export function pointInCircle(
  pointPosition: Vector,
  circlePosition: Vector,
  circleDiameter: number
): boolean {
  return (
    distance(pointPosition, circlePosition) <= Math.pow(circleDiameter / 2, 2)
  );
}

export function areCirclesIntersecting(
  circle1Position: Vector,
  circle1Radius: number,
  circle2Position: Vector,
  circle2Radius: number
): boolean {
  return (
    distance(circle1Position, circle2Position) <=
    Math.pow(circle1Radius + circle2Radius, 2)
  );
}

// TODO: add unit tests
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// TODO: add unit tests
export function areLinesIntersecting(
  line1: Obstacle,
  line2: Obstacle
): boolean {
  const uA =
    ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) -
      (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) /
    ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
      (line2.x2 - line2.x1) * (line1.y2 - line1.y1));
  const uB =
    ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) -
      (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) /
    ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
      (line2.x2 - line2.x1) * (line1.y2 - line1.y1));
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}
