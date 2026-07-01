import WorldConfig from "../world/world.config";
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

  public set(x: number, y: number, r: number): void {
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

export const quadtreeCircle = new Circle(0, 0, 0);

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
  capacity: number;
  boundary: Rectangle<T>;

  points: T[];

  divided: boolean;
  currentDepth: number;
  topLeft?: Quadtree<T>;
  bottomLeft?: Quadtree<T>;
  bottomRight?: Quadtree<T>;
  topRight?: Quadtree<T>;

  constructor(dims: RectangleDims, currentDepth: number = 0) {
    this.capacity = 4; // TODO: hardcoded?
    this.currentDepth = currentDepth;
    this.boundary = new Rectangle(dims);
    this.divided = false;
    this.points = [];
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

  // private highlightQuadtree(): void {
  //   this.p.push();
  //   this.p.stroke(EngineConfig.quadtreeHighlightedColor);
  //   this.p.strokeWeight(EngineConfig.quadtreeHighlightedStrokeWeight);
  //   this.p.rectMode(this.p.CENTER);
  //   this.p.noFill();
  //   this.p.rect(
  //     this.boundary.dims.x,
  //     this.boundary.dims.y,
  //     this.boundary.dims.w * 2,
  //     this.boundary.dims.h * 2,
  //   );
  //   this.p.pop();
  // }

  public update(showBoundary: boolean = false): void {
    // if (showBoundary) {
    //   this.p.push();
    //   this.p.stroke(EngineConfig.quadtreeDefaultColor);
    //   this.p.strokeWeight(EngineConfig.quadtreeDefaultStrokeWeight);
    //   this.p.rectMode(this.p.CENTER);
    //   this.p.noFill();
    //   this.p.rect(
    //     this.boundary.x,
    //     this.boundary.y,
    //     this.boundary.w * 2,
    //     this.boundary.h * 2,
    //   );
    //   this.p.pop();
    // }

    if (this.divided) {
      this.topLeft?.update(showBoundary);
      this.bottomLeft?.update(showBoundary);
      this.bottomRight?.update(showBoundary);
      this.topRight?.update(showBoundary);
    }
  }

  public query(range: Circle<T>, results?: T[]): T[] {
    if (!results) {
      results = [];
    }

    if (!this.boundary.intersects(range)) {
      return [];
    }

    // Highlight the quadtrees in the perception range of the ant
    // EngineConfig.showHighlightedQuadtree && this.highlightQuadtree();

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      if (range.contains(point)) {
        results.push(point);
      }
    }

    if (this.divided) {
      this.topLeft?.query(range, results);
      this.bottomLeft?.query(range, results);
      this.bottomRight?.query(range, results);
      this.topRight?.query(range, results);
    }

    return results;
  }

  public insert(point: T): boolean {
    if (!this.boundary.contains(point.position)) {
      return false;
    }

    if (!this.divided) {
      if (
        this.points.length < this.capacity ||
        this.currentDepth === WorldConfig.quadtreeMaxDepth
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
}
