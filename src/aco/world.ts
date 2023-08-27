import { Ant } from "./ant";
import { FoodItem } from "./food-item";
import { Colony } from "./colony";
import { config } from "./config";
import { IPheromoneType, Pheromone } from "./pheromone";
import { Circle, Quadtree, Rectangle } from "./quadtree";
import { circleCollision } from "./utils";

export class World {
  p: p5;
  foodItemsQuadtree: Quadtree<FoodItem>;
  homePheromoneQuadtree: Quadtree<Pheromone>;
  foodPheromoneQuadtree: Quadtree<Pheromone>;
  ants: Ant[];
  colonies: Colony[];

  constructor(p: p5) {
    this.p = p;
    this.foodItemsQuadtree = new Quadtree(
      this.p,
      new Rectangle(
        p.windowWidth / 2,
        p.windowHeight / 2,
        p.windowWidth / 2,
        p.windowHeight / 2
      )
    );
    this.homePheromoneQuadtree = new Quadtree(
      this.p,
      new Rectangle(
        p.windowWidth / 2,
        p.windowHeight / 2,
        p.windowWidth / 2,
        p.windowHeight / 2
      )
    );
    this.foodPheromoneQuadtree = new Quadtree(
      this.p,
      new Rectangle(
        p.windowWidth / 2,
        p.windowHeight / 2,
        p.windowWidth / 2,
        p.windowHeight / 2
      )
    );
    this.ants = [];
    this.colonies = [new Colony(this.p)];
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
          i * config.foodClusterSpacing + spawnX,
          j * config.foodClusterSpacing + spawnY
        );
        this.foodItemsQuadtree.insert(foodItem);
      }
    }
  }

  public depositPheromone(pheromone: Pheromone) {
    const pheromoneQuadtree =
      pheromone.type === IPheromoneType.Food
        ? this.foodPheromoneQuadtree
        : this.homePheromoneQuadtree;
    pheromoneQuadtree.insert(pheromone);
  }

  // TODO: this method should limit the perception to only in FRONT of the ant
  public getFoodItemInPerceptionRange(antPosition: p5.Vector): FoodItem | null {
    // TODO: avoid creating a new Circle at each call
    const found = this.foodItemsQuadtree.query(
      new Circle(
        this.p,
        antPosition.x,
        antPosition.y,
        config.antPerceptionRange
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

  public colonyInPerceptionRange(
    antPosition: p5.Vector,
    colonyPosition: p5.Vector
  ): boolean {
    return circleCollision(
      this.p.createVector(antPosition.x, antPosition.y),
      this.p.createVector(colonyPosition.x, colonyPosition.y),
      config.antPerceptionRange * 2
    );
  }

  // TODO: rename and optimize method
  public antennaPheromoneValues(
    antennas: p5.Vector[],
    pheromoneType: IPheromoneType
  ): number[] {
    let antennaScores: number[] = [];
    const pheromoneQuadtree =
      pheromoneType === IPheromoneType.Food
        ? this.foodPheromoneQuadtree
        : this.homePheromoneQuadtree;

    for (let i = 0; i < antennas.length; i++) {
      const antenna = antennas[i];
      let antennaScore = 0;
      const pheromones = pheromoneQuadtree.query(
        // TODO: Fix antenna perceptionRange
        new Circle(this.p, antenna.x, antenna.y, 30)
      );
      pheromones.map((pheromone) => {
        antennaScore += pheromone.strength;
      });
      antennaScores.push(antennaScore);
    }

    return antennaScores;
  }

  private updateAndRenderAnts() {
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

  private updateAndRenderQuadtrees() {
    this.foodItemsQuadtree.updateAndRender(config.showFoodItemsQuadtree);
    this.homePheromoneQuadtree.updateAndRender(
      config.showHomePheromonesQuadtree
    );
    this.foodPheromoneQuadtree.updateAndRender(
      config.showFoodPheromonesQuadtree
    );
  }

  public render() {
    this.p.background(config.worldBackground);
    console.log(this.foodItemsQuadtree);
    this.updateAndRenderQuadtrees();
    this.updateAndRenderAnts();
    this.renderColonies();
  }
}
