import { Vector } from "../math";
import type { Position } from "../math/types";
import * as WorldConstants from "./world.constants";

export class FoodItem {
  public position: Vector;
  public radius: number;

  public quantity: number;

  constructor(position: Position, quantity: number) {
    this.position = new Vector(position.x, position.y);
    this.radius = WorldConstants.FOOD_ITEM_RADIUS;

    this.quantity = quantity;
  }

  public consume(): void {
    this.quantity = Math.max((this.quantity -= 1), 0);
  }

  public isDepleted(): boolean {
    return this.quantity <= 0;
  }
}
