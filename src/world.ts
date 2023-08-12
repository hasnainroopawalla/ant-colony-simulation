import * as p5 from "p5";
import { Ant } from "./ant";
import { FoodItem } from "./food-item";
import { Colony } from "./colony";
import { config } from "./config";

export class World {
  p: p5;
  ants: Ant[];
  foodItems: FoodItem[];
  colonies: Colony[];

  constructor(p: p5) {
    this.p = p;
    this.ants = [];
    this.foodItems = [];
    this.colonies = [new Colony(p)];
  }

  public createAnt() {
    this.ants.push(new Ant(this.p, this.colonies[0], this));
  }

  public createFoodCluster(clusterSize: number = 5) {
    const [spawnX, spawnY] = [this.p.mouseX, this.p.mouseY];
    for (let i = 0; i < clusterSize; i++) {
      for (let j = 0; j < clusterSize; j++) {
        this.foodItems.push(
          new FoodItem(
            this.p,
            i * config.foodCluster.spacing + spawnX,
            j * config.foodCluster.spacing + spawnY
          )
        );
      }
    }
  }

  // TODO: this method should limit the perception to only in FRONT of the ant
  public getFoodItemInPerceptionRange(
    antPosition: p5.Vector,
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
    this.p.background(config.world.background);
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
