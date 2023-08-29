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

export function areCirclesOverlapping(
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
