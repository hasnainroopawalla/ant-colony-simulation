import p5 from "p5";

export const distanceSquared = (
  position1: p5.Vector,
  position2: p5.Vector
): number =>
  Math.pow(position1.x - position2.x, 2) +
  Math.pow(position1.y - position2.y, 2);

export const distance = (
  position1: p5.Vector,
  position2: p5.Vector,
  euclidean?: boolean
): number => {
  const distance = distanceSquared(position1, position2);
  return euclidean ? Math.sqrt(distance) : distance;
};

export const circleCollision = (
  pointPosition: p5.Vector,
  circlePosition: p5.Vector,
  circleDiameter: number
): boolean =>
  distance(pointPosition, circlePosition) <= Math.pow(circleDiameter / 2, 2);
