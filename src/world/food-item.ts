import { pointInCircle } from "../math/utils";
import { Vector } from "../math/vector";
import EngineConfig from "./engine.config";

export enum IFoodItemState {
  Spawned,
  Reserved,
  PickedUp,
  Delivered,
}

export class FoodItem {
  public position: Vector;

  private p: p5;
  private state: IFoodItemState;

  constructor(p: p5, position: Vector) {
    this.p = p;
    this.position = position;
    this.spawned(); // TODO: improve
  }

  public spawned(): void {
    this.state = IFoodItemState.Spawned;
  }
  public reserved(): void {
    this.state = IFoodItemState.Reserved;
  }
  public pickedUp(): void {
    this.state = IFoodItemState.PickedUp;
  }
  public delivered(): void {
    this.state = IFoodItemState.Delivered;
  }

  // TODO: improve these methods
  public isSpawned(): boolean {
    return this.state === IFoodItemState.Spawned;
  }
  public isReserved(): boolean {
    return this.state === IFoodItemState.Reserved;
  }
  public isPickedUp(): boolean {
    return this.state === IFoodItemState.PickedUp;
  }
  public isDelivered(): boolean {
    return this.state === IFoodItemState.Delivered;
  }

  public shouldBeDestroyed() {
    return this.isDelivered();
  }

  public collide(antPosition: Vector) {
    return pointInCircle(antPosition, this.position, EngineConfig.foodItemSize);
  }

  public update() {}

  public render() {
    if (this.isPickedUp() || this.isDelivered()) {
      return;
    }
    this.p.push();
    this.p.strokeWeight(EngineConfig.foodItemStrokeWeight);
    this.p.fill(EngineConfig.foodItemColor);
    this.p.circle(this.position.x, this.position.y, EngineConfig.foodItemSize);
    this.p.pop();
  }
}
