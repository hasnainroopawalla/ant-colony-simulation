import { MathUtils, Vector } from "../math";
import * as WorldConstants from "./world.constants";

export class Colony {
  position: Vector;
  radius: number;
  foodCount: number;

  constructor() {
    this.position = new Vector(200, 200);
    this.radius = WorldConstants.COLONY_RADIUS;
    this.foodCount = 0;
  }

  public contains(point: Vector): boolean {
    return MathUtils.isPointInCircle(point, this.position, this.radius);
  }

  public incrementFoodCount() {
    this.foodCount++;
  }
}
