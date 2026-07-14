import type { Dimensions, Position } from "../../math";
import * as AcoConstants from "./aco.constants";
import { PheromoneType } from "./pheromone";

export class PheromoneField {
  private rows: number;
  private cols: number;

  private home: Float32Array;
  private food: Float32Array;

  constructor(worldDims: Dimensions) {
    // TODO: check dims
    this.rows = Math.ceil(worldDims.h / AcoConstants.PHEROMONE_FIELD_CELL_SIZE);
    this.cols = Math.ceil(worldDims.w / AcoConstants.PHEROMONE_FIELD_CELL_SIZE);

    const gridSize = this.rows * this.cols;

    this.home = new Float32Array(gridSize);
    this.food = new Float32Array(gridSize);
  }

  public deposit(
    position: Position,
    pheromoneType: PheromoneType,
    amount: number,
  ): void {
    const grid = this.getGrid(pheromoneType);
    const index = this.getIndex(position);

    // TODO: add ceiling?
    grid[index] += amount;
  }

  public sample(position: Position, pheromoneType: PheromoneType): number {
    const grid = this.getGrid(pheromoneType);
    const index = this.getIndex(position);
    return grid[index];
  }

  public evaporate(): void {}

  private getIndex(position: Position): number {
    const col = Math.floor(position.x / AcoConstants.PHEROMONE_FIELD_CELL_SIZE);
    const row = Math.floor(position.y / AcoConstants.PHEROMONE_FIELD_CELL_SIZE);

    return row * this.cols + col;
  }

  private getGrid(pheromoneType: PheromoneType): Float32Array {
    return pheromoneType === PheromoneType.Food ? this.food : this.home;
  }
}
