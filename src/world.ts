import * as p5 from "p5";
import { Ant } from "./ant";
import { FoodItem, IFoodItemState } from "./food-item";

export class World {
  p: p5;
  ants: Ant[];
  foodItems: FoodItem[];

  constructor(p: p5) {
    this.p = p;
    this.ants = [];
    this.foodItems = [];
  }

  public createAnt() {
    this.ants.push(new Ant(this.p, this));
  }

  public createFoodCluster(clusterSize: number = 5) {
    const [spawnX, spawnY] = [this.p.mouseX, this.p.mouseY];
    for (let i = 0; i < clusterSize; i++) {
      for (let j = 0; j < clusterSize; j++) {
        this.foodItems.push(
          new FoodItem(this.p, i * 7 + spawnX, j * 7 + spawnY)
        );
      }
    }
  }

  public getFoodItemInPerceptionRange(
    antPosition: p5.Vector,
    perceptionRange: number
  ): FoodItem | null {
    for (let i = 0; i < this.foodItems.length; i++) {
      const foodItem = this.foodItems[i];
      // TODO: Replace direct enum comparisons with methods
      if (foodItem.state === IFoodItemState.PickedUp) {
        continue;
      }
      const distanceSquared =
        (foodItem.position.x - antPosition.x) *
          (foodItem.position.x - antPosition.x) +
        (foodItem.position.y - antPosition.y) *
          (foodItem.position.y - antPosition.y);
      if (distanceSquared <= perceptionRange * perceptionRange) {
        return foodItem;
      }
    }
  }

  public render() {
    console.log(this.foodItems.length);
    this.p.stroke(0);
    this.p.strokeWeight(2);
    this.p.fill(0);
    this.ants.map((ant) => {
      ant.update();
      ant.render();
    });
    this.foodItems.map((food) => {
      food.render();
    });
  }
}
