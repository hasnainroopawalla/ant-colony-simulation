import { MathUtils, Vector } from "../math";
import WorldConfig from "./world.config";

export class FoodItem {
  public position: Vector;
  public radius: number;

  constructor(position: Vector) {
    this.position = position;
    this.radius = WorldConfig.foodItemRadius;
  }

  public collide(antPosition: Vector) {
    return MathUtils.isPointInCircle(antPosition, this.position, this.radius);
  }
}
