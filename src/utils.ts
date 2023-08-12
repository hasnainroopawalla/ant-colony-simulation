import { p5i } from "./sketch";

export const circleCollision = (
  candidatePosition: p5.Vector,
  circlePosition: p5.Vector,
  circleSize: number
): boolean => {
  return (
    p5i.dist(
      candidatePosition.x,
      candidatePosition.y,
      circlePosition.x,
      circlePosition.y
    ) <
    circleSize / 2
  );
};
