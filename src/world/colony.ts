import { Vector, type Position } from "../math";

export class Colony {
  public position: Vector;
  public foodCount: number;

  constructor(spawnPosition: Position) {
    this.position = new Vector(spawnPosition.x, spawnPosition.y);
    this.foodCount = 0;
  }

  public incrementFoodCount(): void {
    this.foodCount++;
  }
}
