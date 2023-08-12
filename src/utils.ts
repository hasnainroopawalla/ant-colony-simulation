export const circleCollision = (
  candidatePosition: p5.Vector,
  circlePosition: p5.Vector,
  circleDiameter: number // diameter
): boolean =>
  // Euclidean distance equivalent to p5.dist(x1, y1, x2, y2)
  Math.sqrt(
    Math.pow(candidatePosition.x - circlePosition.x, 2) +
      Math.pow(candidatePosition.y - circlePosition.y, 2)
  ) <=
  circleDiameter / 2;
