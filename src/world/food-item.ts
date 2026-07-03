import { MathUtils, Vector } from "../math";
import * as WorldConstants from "./world.constants";

export class FoodItem {
  public position: Vector;
  public radius: number;

  constructor(position: Vector) {
    this.position = position;
    this.radius = WorldConstants.FOOD_ITEM_RADIUS;
  }

  public collide(antPosition: Vector) {
    return MathUtils.isPointInCircle(antPosition, this.position, this.radius);
  }
}
