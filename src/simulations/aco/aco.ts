import { Simulation } from "../simulation";
import { Ant } from "./ant";
import { World } from "../../world";
import { MathUtils, Vector } from "../../math";
import { acoSettingsSchema, type AcoSettings } from "./aco.settings";
import { PheromoneField, PheromoneType } from "./pheromone-field";
import * as AcoConstants from "./aco.constants";
import { Antenna } from "./antenna";
import { SimulationView } from "../../render";
import { Stats } from "../../events";

export class AntColonySimulation extends Simulation<AcoSettings> {
  private pheromoneField: PheromoneField;

  private ants: Ant[];

  constructor(world: World) {
    super(world, acoSettingsSchema);

    this.pheromoneField = new PheromoneField(world.dims);
    this.ants = this.spawnAnts(500);
  }

  public getView(): SimulationView {
    return {
      ants: this.ants,
      antCount: this.getAntCount(),
      pheromoneField: this.pheromoneField,
    };
  }

  public depositPheromone(
    position: Vector,
    pheromoneType: PheromoneType,
  ): void {
    this.pheromoneField.deposit(
      position,
      pheromoneType,
      AcoConstants.PHEROMONE_DEPOSIT_AMOUNT,
    );
  }

  public samplePheromone(
    antenna: Antenna,
    pheromoneType: PheromoneType,
  ): number {
    return this.pheromoneField.sample(
      antenna.position,
      antenna.radius,
      pheromoneType,
    );
  }

  public update(dt: number): void {
    this.ants.forEach((ant) => ant.update(dt));
    this.pheromoneField.evaporate(dt);
  }

  private spawnAnts(count: number): Ant[] {
    return Array.from({ length: count }, () => {
      // TODO: better colony assignment
      const colony = this.world.colonies[0];
      // Uniform disk sampling: sqrt(rand) prevents clustering at the center.
      const r =
        Math.sqrt(MathUtils.randomFloat()) * AcoConstants.ANT_SPAWN_RADIUS;
      const spawnPos = colony.position.add(
        MathUtils.fromAngle(MathUtils.randomFloat(0, Math.PI * 2)).mult(r),
      );

      return new Ant(colony, this.world, this, spawnPos, this.settings);
    });
  }

  private getAntCount(): Stats["antCount"] {
    return this.ants.reduce(
      (acc, ant) => {
        if (ant.isCarryingFood()) {
          acc.food += 1;
        } else {
          acc.home += 1;
        }
        return acc;
      },
      { home: 0, food: 0 },
    );
  }
}
