import { Quadtree } from "../../math/quadtree";
import { Simulation } from "../simulation";
import { Ant } from "./ant";
import { Pheromone } from "./pheromone";
import { World } from "../../world";

export class AntColonySimulation extends Simulation {
  private homePheromoneQuadtree: Quadtree<Pheromone>;
  private foodPheromoneQuadtree: Quadtree<Pheromone>;
  private ants: Ant[];

  constructor(world: World) {
    super(world);

    this.homePheromoneQuadtree = new Quadtree({
      x: world.dims.w / 2,
      y: world.dims.h / 2,
      w: world.dims.w / 2,
      h: world.dims.h / 2,
    });

    this.foodPheromoneQuadtree = new Quadtree({
      x: world.dims.w / 2,
      y: world.dims.h / 2,
      w: world.dims.w / 2,
      h: world.dims.h / 2,
    });

    this.ants = this.spawnAnts(100);
  }

  public getView(): { ants: Ant[] } {
    return { ants: this.ants };
  }

  // public depositPheromone(pheromone: Pheromone): void {
  //   const pheromoneQuadtree =
  //     pheromone.type === IPheromoneType.Food
  //       ? this.foodPheromoneQuadtree
  //       : this.homePheromoneQuadtree;

  //   pheromoneQuadtree.insert(pheromone);
  // }

  // public getFoodItemInAntPerceptionRange(
  //   antPosition: Vector,
  //   antPerceptionRange: number,
  // ): FoodItem | null {
  //   quadtreeCircle.set(antPosition.x, antPosition.y, antPerceptionRange);
  //   const found = this.foodItemsQuadtree.query(quadtreeCircle);
  //   for (let i = 0; i < found.length; i++) {
  //     const foodItem = found[i];
  //     if (foodItem.isSpawned()) {
  //       foodItem.reserved();
  //       return foodItem;
  //     }
  //   }
  // }

  // public computeAntAntennasPheromoneValues(
  //   antennas: Vector[],
  //   antAntennaRadius: number,
  //   pheromoneType: IPheromoneType,
  // ): number[] {
  //   const antennaScores: number[] = [];
  //   const pheromoneQuadtree =
  //     pheromoneType === IPheromoneType.Food
  //       ? this.foodPheromoneQuadtree
  //       : this.homePheromoneQuadtree;

  //   for (let i = 0; i < antennas.length; i++) {
  //     const antenna = antennas[i];
  //     let antennaScore = 0;
  //     quadtreeCircle.set(antenna.x, antenna.y, antAntennaRadius);
  //     const pheromones = pheromoneQuadtree.query(quadtreeCircle);
  //     for (let j = 0; j < pheromones.length; j++) {
  //       antennaScore +=
  //         pheromones[j].strength / AcoConfig.pheromoneInitialStrength;
  //     }
  //     antennaScores.push(antennaScore);
  //   }
  //   return antennaScores;
  // }

  // public isObstacleInAntPerceptionRange(
  //   antPosition: Vector,
  //   antPerception: Vector,
  // ): boolean {
  //   for (let i = 0; i < this.obstacles.length; i++) {
  //     const obstacle = this.obstacles[i];
  //     if (
  //       areLinesIntersecting(
  //         {
  //           x1: antPosition.x,
  //           y1: antPosition.y,
  //           x2: antPerception.x,
  //           y2: antPerception.y,
  //         },
  //         {
  //           x1: obstacle.x1,
  //           y1: obstacle.y1,
  //           x2: obstacle.x2,
  //           y2: obstacle.y2,
  //         },
  //       )
  //     ) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  public update(): void {
    this.ants.forEach((ant) => ant.update());
  }

  private spawnAnts(count: number): Ant[] {
    return Array.from(
      { length: count },
      // TODO: better colony assignment
      () => new Ant(this.world.colonies[0], this.world),
    );
  }
}
