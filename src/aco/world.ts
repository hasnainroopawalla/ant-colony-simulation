import p5 from "p5";
import { Ant } from "./ant";
import { FoodItem } from "./food-item";
import { Colony } from "./colony";
import { config } from "./config";
import { Pheromone } from "./pheromone";
import { Circle, Quadtree } from "./quadtree";

export class World {
  p: p5;
  quadtree: Quadtree;
  ants: Ant[];
  colonies: Colony[];
  pheromones: Pheromone[];

  constructor(p: p5, quadtree: Quadtree) {
    this.p = p;
    this.quadtree = quadtree;
    this.ants = [];
    this.colonies = [new Colony(this.p)];
    this.pheromones = [];
  }

  public createAnt() {
    this.ants.push(new Ant(this.p, this.colonies[0], this));
  }

  public createFoodCluster(clusterSize: number = 5) {
    const [spawnX, spawnY] = [this.p.mouseX, this.p.mouseY];
    for (let i = 0; i < clusterSize; i++) {
      for (let j = 0; j < clusterSize; j++) {
        const foodItem = new FoodItem(
          this.p,
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
  public getFoodItemInPerceptionRange(antPosition: p5.Vector): FoodItem | null {
    // TODO: avoid creating a new Circle at each call
    const found = this.quadtree.query(
      new Circle(
        this.p,
        antPosition.x,
        antPosition.y,
        config.ant.perception.range
      )
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
    this.p.background(config.world.background);
    this.quadtree.render();
    this.renderAnts();
    this.renderColonies();
    this.renderPheromones();
  }
}
