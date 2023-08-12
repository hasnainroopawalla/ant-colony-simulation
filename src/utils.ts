export const distance = (position1: p5.Vector, position2: p5.Vector): number =>
  // Euclidean distance equivalent to p5.dist(x1, y1, x2, y2)
  Math.sqrt(
    Math.pow(position1.x - position2.x, 2) +
      Math.pow(position1.y - position2.y, 2)
  );

export const circleCollision = (
  candidatePosition: p5.Vector,
  circlePosition: p5.Vector,
  circleDiameter: number
): boolean => distance(candidatePosition, circlePosition) <= circleDiameter / 2;
