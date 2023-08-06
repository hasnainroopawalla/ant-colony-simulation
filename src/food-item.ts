import { config } from "./config";

export enum IFoodItemState {
  Spawned,
  PickedUp,
  Delivered,
}

export class FoodItem {
  p: p5;
  position: p5.Vector;
  state: IFoodItemState;

  constructor(p: p5, x: number, y: number) {
    this.p = p;
    this.position = p.createVector(x, y);
    this.state = IFoodItemState.Spawned;
  }

  public collide(antPosition: p5.Vector) {
    return (
      this.p.dist(
        antPosition.x,
        antPosition.y,
        this.position.x,
        this.position.y
      ) <
      config.foodItem.size / 2
    );
  }

  public render() {
    if (this.state === IFoodItemState.Delivered) {
      return;
    }
    this.p.push();
    this.p.strokeWeight(config.foodItem.strokeWeight);
    this.p.fill(config.foodItem.color);
    this.p.circle(this.position.x, this.position.y, config.foodItem.size);
    this.p.pop();
  }
}
