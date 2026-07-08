import { Quadtree } from "../../math/quadtree";
import { Simulation } from "../simulation";
import { Ant } from "./ant";
import { Pheromone, PheromoneType } from "./pheromone";
import { World } from "../../world";
import { MathUtils, Vector } from "../../math";
import { acoSettingsSchema, type AcoSettings } from "./aco.settings";
import * as AcoConstants from "./aco.constants";
import { Antenna } from "./antenna";

export class AntColonySimulation extends Simulation<AcoSettings> {
  private homePheromoneQuadtree: Quadtree<Pheromone>;
  private foodPheromoneQuadtree: Quadtree<Pheromone>;

  private ants: Ant[];
  private homePheromones: Pheromone[];
  private foodPheromones: Pheromone[];

  constructor(world: World) {
    super(world, acoSettingsSchema);

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

  public depositPheromone(
    position: Vector,
    pheromoneType: PheromoneType,
  ): Pheromone {
    const pheromone = new Pheromone(position, pheromoneType);

    const [pheromoneQuadtree, pheromones] =
      this.getPheromoneCollection(pheromoneType);

    pheromones.push(pheromone);
    pheromoneQuadtree.insert(pheromone);

    return pheromone;
  }

  public samplePheromone(
    antenna: Antenna,
    pheromoneType: PheromoneType,
  ): number {
    const [pheromoneQuadtree] = this.getPheromoneCollection(pheromoneType);

    const pheromones = pheromoneQuadtree.query({
      x: antenna.position.x,
      y: antenna.position.y,
      r: antenna.radius,
    });

    const score = pheromones.reduce((acc, pheromone) => {
      acc += pheromone.strength / AcoConstants.PHEROMONE_INITIAL_STRENGTH;
      return acc;
    }, 0);

    return score;
  }

  public update(dt: number): void {
    this.ants.forEach((ant) => ant.update(dt));

    this.homePheromones.forEach((pheromone) => pheromone.update(dt));
    this.foodPheromones.forEach((pheromone) => pheromone.update(dt));

    // TODO: is this optimal?
    this.homePheromones = this.homePheromones.filter(
      (pheromone) => !pheromone.isExpired(),
    );
    this.foodPheromones = this.foodPheromones.filter(
      (pheromone) => !pheromone.isExpired(),
    );

    this.homePheromoneQuadtree.rebuild(this.homePheromones);
    this.foodPheromoneQuadtree.rebuild(this.foodPheromones);
  }

  private spawnAnts(count: number): Ant[] {
    return Array.from({ length: count }, () => {
      // TODO: better colony assignment
      const colony = this.world.colonies[0];
      // Uniform disk sampling: sqrt(rand) prevents clustering at the center.
      const r = Math.sqrt(MathUtils.randomFloat()) * colony.radius;
      const spawnPos = colony.position.add(
        MathUtils.fromAngle(MathUtils.randomFloat(0, Math.PI * 2)).mult(r),
      );

      return new Ant(colony, this.world, this, spawnPos, this.settings);
    });
  }

  private getPheromoneCollection(
    pheromoneType: PheromoneType,
  ): [Quadtree<Pheromone>, Pheromone[]] {
    return pheromoneType === PheromoneType.Food
      ? [this.foodPheromoneQuadtree, this.foodPheromones]
      : [this.homePheromoneQuadtree, this.homePheromones];
  }
}
