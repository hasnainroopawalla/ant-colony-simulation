import { config } from "./config";
import { p5i } from "../sketch";
import { circleCollision } from "./utils";

export enum IFoodItemState {
  Spawned,
  Reserved,
  PickedUp,
  Delivered,
}

export class FoodItem {
  position: p5.Vector;
  state: IFoodItemState;

  constructor(x: number, y: number) {
    this.position = p5i.createVector(x, y);
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
    return circleCollision(antPosition, this.position, config.foodItem.size);
  }

  public render() {
    if (this.isPickedUp() || this.isDelivered()) {
      return;
    }
    p5i.push();
    p5i.strokeWeight(config.foodItem.strokeWeight);
    p5i.fill(config.foodItem.color);
    p5i.circle(this.position.x, this.position.y, config.foodItem.size);
    p5i.pop();
  }
}
