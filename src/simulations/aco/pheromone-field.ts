import { MathUtils, type Dimensions, type Position } from "../../math";
import * as AcoConstants from "./aco.constants";
import { PheromoneType } from "./pheromone";

export class PheromoneField {
  private rows: number;
  private cols: number;

  private home: Float32Array;
  private food: Float32Array;

  constructor(worldDims: Dimensions) {
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

    // Cap at the max so cell strength saturates instead of growing unbounded.
    grid[index] = Math.min(
      grid[index] + amount,
      AcoConstants.PHEROMONE_MAX_STRENGTH,
    );
  }

  public sample(
    center: Position,
    radius: number,
    pheromoneType: PheromoneType,
  ): number {
    // Pick the home/food grid we are reading from.
    const grid = this.getGrid(pheromoneType);
    const cellSize = AcoConstants.PHEROMONE_FIELD_CELL_SIZE;

    // Turn the circle's horizontal extent into a clamped column range.
    const [minCol, maxCol] = MathUtils.toClampedCellRange(
      center.x - radius,
      center.x + radius,
      cellSize,
      this.cols - 1,
    );

    // Turn the circle's vertical extent into a clamped row range.
    const [minRow, maxRow] = MathUtils.toClampedCellRange(
      center.y - radius,
      center.y + radius,
      cellSize,
      this.rows - 1,
    );

    // Sum strength across every cell the antenna circle overlaps.
    let total = 0;
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        // Discard bounding-box corners the circle doesn't actually touch.
        const overlapsAntenna = MathUtils.isCircleIntersectingRect(
          center,
          radius,
          { x: col * cellSize, y: row * cellSize, w: cellSize, h: cellSize },
        );

        // Accumulate the overlapping cell's stored strength.
        if (overlapsAntenna) {
          total += grid[row * this.cols + col];
        }
      }
    }

    return total;
  }

  public get dimensions(): { rows: number; cols: number; cellSize: number } {
    return {
      rows: this.rows,
      cols: this.cols,
      cellSize: AcoConstants.PHEROMONE_FIELD_CELL_SIZE,
    };
  }

  public getGrids(): { home: Float32Array; food: Float32Array } {
    return { home: this.home, food: this.food };
  }

  public evaporate(dt: number): void {
    const decay = AcoConstants.PHEROMONE_EVAPORATION_RATE * dt;

    for (let i = 0; i < this.home.length; i++) {
      this.home[i] = Math.max(0, this.home[i] - decay);
      this.food[i] = Math.max(0, this.food[i] - decay);
    }
  }

  private getIndex(position: Position): number {
    // Map the world coordinate onto grid column/row indices.
    const col = MathUtils.toCellIndex(
      position.x,
      AcoConstants.PHEROMONE_FIELD_CELL_SIZE,
    );
    const row = MathUtils.toCellIndex(
      position.y,
      AcoConstants.PHEROMONE_FIELD_CELL_SIZE,
    );

    // Flatten the 2D cell coordinate into the 1D grid array index.
    return row * this.cols + col;
  }

  private getGrid(pheromoneType: PheromoneType): Float32Array {
    return pheromoneType === PheromoneType.Food ? this.food : this.home;
  }
}
