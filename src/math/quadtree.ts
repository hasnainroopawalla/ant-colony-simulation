import * as WorldConstants from "../world/world.constants";
import * as MathConstants from "./math.constants";
import type { Position, RectangleDims } from "./types";
import { MathUtils } from "./utils";
import { Vector } from "./vector";

type QuadtreeItem = {
  position: Position;
};

class Circle<T extends QuadtreeItem> {
  x: number;
  y: number;
  r: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  public contains(item: T): boolean {
    return MathUtils.isPointInCircle(
      new Vector(item.position.x, item.position.y),
      new Vector(this.x, this.y),
      this.r,
    );
  }
}

export class Rectangle<T extends QuadtreeItem> {
  public dims: RectangleDims;

  constructor(dims: RectangleDims) {
    this.dims = dims;
  }

  public contains(point: Position) {
    return (
      point.x >= this.dims.x - this.dims.w &&
      point.x <= this.dims.x + this.dims.w &&
      point.y >= this.dims.y - this.dims.h &&
      point.y <= this.dims.y + this.dims.h
    );
  }

  public intersectsRectangle(range: Rectangle<T>): boolean {
    return !(
      range.dims.x - range.dims.w > this.dims.x + this.dims.w ||
      range.dims.x + range.dims.w < this.dims.x - this.dims.w ||
      range.dims.y - range.dims.h > this.dims.y + this.dims.h ||
      range.dims.y + range.dims.h < this.dims.y - this.dims.h
    );
  }

  public intersects(range: Circle<T>): boolean {
    return (
      range.x + range.r >= this.dims.x - this.dims.w &&
      range.x - range.r <= this.dims.x + this.dims.w &&
      range.y + range.r >= this.dims.y - this.dims.h &&
      range.y - range.r <= this.dims.y + this.dims.h
    );
  }
}

export class Quadtree<T extends QuadtreeItem> {
  private capacity: number;
  private boundary: Rectangle<T>;

  private points: T[];

  private divided: boolean;
  private currentDepth: number;
  private topLeft?: Quadtree<T>;
  private bottomLeft?: Quadtree<T>;
  private bottomRight?: Quadtree<T>;
  private topRight?: Quadtree<T>;

  constructor(dims: RectangleDims, currentDepth: number = 0) {
    this.capacity = MathConstants.QUADTREE_MAX_ITEMS;
    this.currentDepth = currentDepth;
    this.boundary = new Rectangle(dims);
    this.divided = false;
    this.points = [];
  }

  public query(range: { x: number; y: number; r: number }, results?: T[]): T[] {
    const rangeCircle = new Circle(range.x, range.y, range.r);
    return this._query(rangeCircle, results);
  }

  public insert(point: T): boolean {
    if (!this.boundary.contains(point.position)) {
      return false;
    }

    if (!this.divided) {
      if (
        this.points.length < this.capacity ||
        this.currentDepth === WorldConstants.QUADTREE_MAX_DEPTH
      ) {
        this.points.push(point);
        return true;
      }

      this.subdivide();
      this.divided = true;
    }

    return !!(
      this.topLeft?.insert(point) ||
      this.bottomLeft?.insert(point) ||
      this.bottomRight?.insert(point) ||
      this.topRight?.insert(point)
    );
  }

  public rebuild(newPoints: T[]): void {
    this.points = [];

    this.divided = false;
    this.topLeft = undefined;
    this.bottomLeft = undefined;
    this.bottomRight = undefined;
    this.topRight = undefined;

    newPoints.forEach((point) => this.insert(point));
  }

  public getBoundaries(results: RectangleDims[] = []): RectangleDims[] {
    results.push(this.boundary.dims);

    if (this.divided) {
      this.topLeft?.getBoundaries(results);
      this.bottomLeft?.getBoundaries(results);
      this.bottomRight?.getBoundaries(results);
      this.topRight?.getBoundaries(results);
    }

    return results;
  }

  private subdivide() {
    this.topLeft = new Quadtree(
      {
        x: this.boundary.dims.x - this.boundary.dims.w / 2,
        y: this.boundary.dims.y - this.boundary.dims.h / 2,
        w: this.boundary.dims.w / 2,
        h: this.boundary.dims.h / 2,
      },
      this.currentDepth + 1,
    );
    this.bottomLeft = new Quadtree(
      {
        x: this.boundary.dims.x - this.boundary.dims.w / 2,
        y: this.boundary.dims.y + this.boundary.dims.h / 2,
        w: this.boundary.dims.w / 2,
        h: this.boundary.dims.h / 2,
      },
      this.currentDepth + 1,
    );
    this.bottomRight = new Quadtree(
      {
        x: this.boundary.dims.x + this.boundary.dims.w / 2,
        y: this.boundary.dims.y + this.boundary.dims.h / 2,
        w: this.boundary.dims.w / 2,
        h: this.boundary.dims.h / 2,
      },
      this.currentDepth + 1,
    );
    this.topRight = new Quadtree(
      {
        x: this.boundary.dims.x + this.boundary.dims.w / 2,
        y: this.boundary.dims.y - this.boundary.dims.h / 2,
        w: this.boundary.dims.w / 2,
        h: this.boundary.dims.h / 2,
      },
      this.currentDepth + 1,
    );
  }

  private _query(rangeCircle: Circle<T>, results?: T[]): T[] {
    if (!results) {
      results = [];
    }

    if (!this.boundary.intersects(rangeCircle)) {
      return [];
    }

    // Highlight the quadtrees in the perception range of the ant
    // EngineConfig.showHighlightedQuadtree && this.highlightQuadtree();

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      if (rangeCircle.contains(point)) {
        results.push(point);
      }
    }

    if (this.divided) {
      this.topLeft?.query(rangeCircle, results);
      this.bottomLeft?.query(rangeCircle, results);
      this.bottomRight?.query(rangeCircle, results);
      this.topRight?.query(rangeCircle, results);
    }

    return results;
  }
}
