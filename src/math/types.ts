import type { Vector } from "./vector";

export type Position = {
  x: number;
  y: number;
};

export type Dimensions = {
  w: number;
  h: number;
};

export type RectangleDims = Position & Dimensions;

export type Circle = {
  center: Vector;
  radius: number;
};
