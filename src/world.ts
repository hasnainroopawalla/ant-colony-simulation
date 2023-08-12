import * as p5m from "p5";
import { p5i } from "./sketch";
import { Ant } from "./ant";
import { FoodItem } from "./food-item";
import { Colony } from "./colony";
import { config } from "./config";
import { IPheromoneType, Pheromone } from "./pheromone";
import { distance } from "./utils";

export class World {
  ants: Ant[];
  foodItems: FoodItem[];
  colonies: Colony[];
  pheromones: Pheromone[];

  constructor() {
    this.ants = [];
    this.foodItems = [];
    this.colonies = [new Colony()];
    this.pheromones = [];
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

  private shouldPheromoneBeDeposited(position: p5.Vector) {
    if (this.pheromones.length === 0) {
      return true;
    }
    return (
      distance(position, this.pheromones.at(-1).position) >
      config.pheromone.distanceBetween
    );
  }

  public depositPheromone(position: p5.Vector, type: IPheromoneType) {
    this.shouldPheromoneBeDeposited(position) &&
      this.pheromones.push(new Pheromone(position, type));
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

  private renderPheromones() {
    for (let i = 0; i < this.pheromones.length; i++) {
      const pheromone = this.pheromones[i];
      pheromone.evaporate();
      if (pheromone.strength <= 0) {
        this.pheromones.splice(i, 1);
      }
      pheromone.render();
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
    config.pheromone.show && this.renderPheromones();
  }
}
