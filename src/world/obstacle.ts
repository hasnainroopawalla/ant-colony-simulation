import type { RectangleDims } from "../math";

export class Obstacle {
  public dims: RectangleDims;

  constructor(dims: RectangleDims) {
    this.dims = dims;
  }
}
