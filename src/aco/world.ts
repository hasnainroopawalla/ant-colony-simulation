import { Ant } from "./ant";
import { FoodItem } from "./food-item";
import { Colony } from "./colony";
import { config } from "./config";
import { IPheromoneType, Pheromone } from "./pheromone";
import { quadtreeCircle, Quadtree, Rectangle } from "./quadtree";
import { Vector } from "./vector";
import { areLinesIntersecting } from "./utils";
import { Obstacle } from "./obstacle";

export class World {
  p: p5;
  loop: boolean = true;
  foodItemsQuadtree: Quadtree<FoodItem>;
  homePheromoneQuadtree: Quadtree<Pheromone>;
  foodPheromoneQuadtree: Quadtree<Pheromone>;
  ants: Ant[];
  colonies: Colony[];
  obstacles: Obstacle[];

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
    this.obstacles = [
      { x1: 0, y1: 0, x2: this.p.windowWidth, y2: 0 },
      {
        x1: 0,
        y1: this.p.windowHeight,
        x2: this.p.windowWidth,
        y2: this.p.windowHeight,
      },
      { x1: 0, y1: 0, x2: 0, y2: this.p.windowHeight },
      {
        x1: this.p.windowWidth,
        y1: 0,
        x2: this.p.windowWidth,
        y2: this.p.windowHeight,
      },
    ];
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
  public getFoodItemInAntPerceptionRange(
    antPosition: Vector,
    antPerceptionRange: number
  ): FoodItem | null {
    quadtreeCircle.set(antPosition.x, antPosition.y, antPerceptionRange);
    const found = this.foodItemsQuadtree.query(quadtreeCircle);
    for (let i = 0; i < found.length; i++) {
      const foodItem = found[i];
      if (foodItem.isSpawned()) {
        foodItem.reserved();
        return foodItem;
      }
    }
  }

  // TODO: optimize this method
  public computeAntAntennasPheromoneValues(
    antennas: Vector[],
    antAntennaRadius: number,
    pheromoneType: IPheromoneType
  ): number[] {
    const antennaScores: number[] = [];
    const pheromoneQuadtree =
      pheromoneType === IPheromoneType.Food
        ? this.foodPheromoneQuadtree
        : this.homePheromoneQuadtree;

    for (let i = 0; i < antennas.length; i++) {
      const antenna = antennas[i];
      let antennaScore = 0;
      quadtreeCircle.set(antenna.x, antenna.y, antAntennaRadius);
      const pheromones = pheromoneQuadtree.query(quadtreeCircle);
      for (let j = 0; j < pheromones.length; j++) {
        const pheromone = pheromones[j];
        antennaScore += pheromone.strength;
      }
      antennaScores.push(antennaScore);
    }
    return antennaScores;
  }

  public isObstacleInAntPerceptionRange(
    antPosition: Vector,
    antPerception: Vector
  ): boolean {
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      if (
        areLinesIntersecting(
          {
            x1: antPosition.x,
            y1: antPosition.y,
            x2: antPerception.x,
            y2: antPerception.y,
          },
          { x1: obstacle.x1, y1: obstacle.y1, x2: obstacle.x2, y2: obstacle.y2 }
        )
      ) {
        return true;
      }
    }
    return false;
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
    this.loop &&
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
    this.updateAndRenderQuadtrees();
    this.updateAndRenderAnts();
    this.renderColonies();
  }
}
