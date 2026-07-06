import { Quadtree } from "../../math/quadtree";
import { Simulation } from "../simulation";
import { Ant } from "./ant";
import { Pheromone, PheromoneType } from "./pheromone";
import { World } from "../../world";
import { MathUtils, Vector } from "../../math";
import { acoSettingsSchema, type AcoSettings } from "./aco.settings";

export class AntColonySimulation extends Simulation<AcoSettings> {
  private homePheromoneQuadtree: Quadtree<Pheromone>;
  private foodPheromoneQuadtree: Quadtree<Pheromone>;

  private ants: Ant[];
  private homePheromones: Pheromone[];
  private foodPheromones: Pheromone[];

  constructor(world: World) {
    super(world, "Ant Colony Simulation", acoSettingsSchema);

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
    this.homePheromones = [];
    this.foodPheromones = [];
  }

  public getView(): { ants: Ant[]; pheromones: Pheromone[] } {
    return {
      ants: this.ants,
      pheromones: [...this.homePheromones, ...this.foodPheromones],
    };
  }

  public handlePheromoneDeposit(position: Vector): Pheromone {
    // if (!this.shouldPheromoneBeDeposited()) {
    //   return;
    // }
    const pheromone = new Pheromone(position, PheromoneType.Home);

    this.homePheromones.push(pheromone);
    this.homePheromoneQuadtree.insert(pheromone);

    return pheromone;
  }

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
  //         pheromones[j].strength / PHEROMONE_INITIAL_STRENGTH;
  //     }
  //     antennaScores.push(antennaScore);
  //   }
  //   return antennaScores;
  // }

  public update(dt: number): void {
    this.ants.forEach((ant) => ant.update(dt));
  }

  private spawnAnts(count: number): Ant[] {
    return Array.from({ length: count }, () => {
      // TODO: better colony assignment
      const colony = this.world.colonies[0];
      // Uniform disk sampling: sqrt(rand) prevents clustering at the center.
      const r = Math.sqrt(MathUtils.randomFloat()) * colony.radius;
      const spawnPos = colony.position
        .copy()
        .add(
          MathUtils.fromAngle(MathUtils.randomFloat(0, Math.PI * 2)).mult(r),
        );

      return new Ant(colony, this.world, this, spawnPos, this.settings);
    });
  }
}
