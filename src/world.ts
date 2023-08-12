import * as p5m from "p5";
import { p5i } from "./sketch";
import { Ant } from "./ant";
import { FoodItem } from "./food-item";
import { Colony } from "./colony";
import { config } from "./config";

export class World {
  ants: Ant[];
  foodItems: FoodItem[];
  colonies: Colony[];

  constructor() {
    this.ants = [];
    this.foodItems = [];
    this.colonies = [new Colony()];
  }

  public createAnt() {
    this.ants.push(new Ant(this.colonies[0], this));
  }

  public createFoodCluster(clusterSize: number = 5) {
    const [spawnX, spawnY] = [p5i.mouseX, p5i.mouseY];
    for (let i = 0; i < clusterSize; i++) {
      for (let j = 0; j < clusterSize; j++) {
        this.foodItems.push(
          new FoodItem(
            i * config.foodCluster.spacing + spawnX,
            j * config.foodCluster.spacing + spawnY
          )
        );
      }
    }
  }

  // TODO: this method should limit the perception to only in FRONT of the ant
  public getFoodItemInPerceptionRange(
    antPosition: p5m.Vector,
    perceptionRange: number
  ): FoodItem | null {
    for (let i = 0; i < this.foodItems.length; i++) {
      const foodItem = this.foodItems[i];
      if (!foodItem.isSpawned()) {
        continue;
      }
      const distanceSquared =
        Math.pow(foodItem.position.x - antPosition.x, 2) +
        Math.pow(foodItem.position.y - antPosition.y, 2);

      if (distanceSquared <= Math.pow(perceptionRange, 2)) {
        foodItem.reserved();
        return foodItem;
      }
    }
  }

  public render() {
    p5i.background(config.world.background);
    this.colonies.map((colony) => {
      colony.render();
    });
    this.ants.map((ant) => {
      ant.update();
      ant.render();
    });
    this.foodItems.map((food) => {
      food.render();
    });
  }
}
