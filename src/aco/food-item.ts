import p5 from "p5";
import { config } from "./config";
import { circleCollision } from "./utils";

export enum IFoodItemState {
  Spawned,
  Reserved,
  PickedUp,
  Delivered,
}

export class FoodItem {
  p: p5;
  position: p5.Vector;
  state: IFoodItemState;

  constructor(p: p5, x: number, y: number) {
    this.p = p;
    this.position = this.p.createVector(x, y);
    this.spawned();
  }

  public spawned() {
    this.state = IFoodItemState.Spawned;
  }
  public reserved() {
    this.state = IFoodItemState.Reserved;
  }
  public pickedUp() {
    this.state = IFoodItemState.PickedUp;
  }
  public delivered() {
    this.state = IFoodItemState.Delivered;
  }

  public isSpawned() {
    return this.state === IFoodItemState.Spawned;
  }
  public isReserved() {
    return this.state === IFoodItemState.Reserved;
  }
  public isPickedUp() {
    return this.state === IFoodItemState.PickedUp;
  }
  public isDelivered() {
    return this.state === IFoodItemState.Delivered;
  }

  public shouldBeDestroyed() {
    return this.isDelivered();
  }

  public collide(antPosition: p5.Vector) {
    return circleCollision(antPosition, this.position, config.foodItemSize);
  }

  public render() {
    if (this.isPickedUp() || this.isDelivered()) {
      return;
    }
    this.p.push();
    this.p.strokeWeight(config.foodItemStrokeWeight);
    this.p.fill(config.foodItemColor);
    this.p.circle(this.position.x, this.position.y, config.foodItemSize);
    this.p.pop();
  }
}
