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

  public render() {
    this.p.push();
    this.p.strokeWeight(0);
    this.p.fill("#39FF14");
    this.p.circle(this.position.x, this.position.y, 5);
    this.p.pop();
  }
}
