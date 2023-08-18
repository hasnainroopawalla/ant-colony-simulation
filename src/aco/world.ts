import * as p5m from "p5";
import { p5i } from "./sketch";
import { Ant } from "./ant";
import { FoodItem } from "./food-item";
import { Colony } from "./colony";
import { config } from "./config";
import { Pheromone } from "./pheromone";
import { Circle, Quadtree } from "./quadtree";

export class World {
  quadtree: Quadtree;
  ants: Ant[];
  colonies: Colony[];
  pheromones: Pheromone[];

  constructor(quadtree: Quadtree) {
    this.quadtree = quadtree;
    this.ants = [];
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
        const foodItem = new FoodItem(
          i * config.foodCluster.spacing + spawnX,
          j * config.foodCluster.spacing + spawnY
        );
        this.quadtree.insert(foodItem);
      }
    }
  }

  public depositPheromone(pheromone: Pheromone) {
    this.pheromones.push(pheromone);
  }

  // TODO: this method should limit the perception to only in FRONT of the ant
  public getFoodItemInPerceptionRange(
    antPosition: p5m.Vector
  ): FoodItem | null {
    // TODO: avoid creating a new Circle at each call
    const found = this.quadtree.query(
      new Circle(antPosition.x, antPosition.y, config.ant.perception.range)
    );
    for (let i = 0; i < found.length; i++) {
      const foodItem = found[i];
      if (foodItem.isSpawned()) {
        foodItem.reserved();
        return foodItem;
      }
    }
  }

  private renderAnts() {
    for (let i = 0; i < this.ants.length; i++) {
      const ant = this.ants[i];
      ant.update();
      ant.render();
    }
  }

  private renderColonies() {
    for (let i = 0; i < this.colonies.length; i++) {
      const colonies = this.colonies[i];
      colonies.render();
    }
  }

  private renderPheromones() {
    for (let i = 0; i < this.pheromones.length; i++) {
      const pheromone = this.pheromones[i];
      if (pheromone.shouldBeDestroyed()) {
        this.pheromones.splice(i, 1);
      }
      pheromone.render();
      pheromone.evaporate();
    }
  }

  public render() {
    p5i.background(config.world.background);
    this.quadtree.render();
    this.renderAnts();
    this.renderColonies();
    this.renderPheromones();
  }
}
