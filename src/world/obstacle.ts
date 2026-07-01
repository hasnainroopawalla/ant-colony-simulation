import type { RectangleDims } from "../math/types";

export class Obstacle {
  public dims: RectangleDims;

  constructor(dims: RectangleDims) {
    this.dims = dims;
  }
}
