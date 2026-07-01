import { MathUtils } from "../math";
import { Vector } from "../math/vector";
import WorldConfig from "./world.config";

export class Colony {
  position: Vector;
  foodCount: number;

  constructor() {
    // TODO: fix position
    this.position = new Vector(200, 200);
    // this.position = new Vector(this.p.windowWidth / 2, this.p.windowHeight / 2);
    this.foodCount = 0;
  }

  public contains(point: Vector): boolean {
    return MathUtils.isPointInCircle(
      point,
      this.position,
      WorldConfig.colonySize,
    );
  }

  public incrementFoodCount() {
    this.foodCount++;
  }
}
