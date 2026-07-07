import type { Vector } from "../../math";
import * as AcoConstants from "./aco.constants";

export class Antenna {
  public position: Vector;
  public radius: number;

  constructor(
    position: Vector,
    radius: number = AcoConstants.ANT_ANTENNA_RADIUS,
  ) {
    this.position = position;
    this.radius = radius;
  }
}
