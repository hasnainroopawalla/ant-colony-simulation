import { config } from "./config";
import { circleCollision } from "./utils";

type IQuadtree = {
  position: { x: number; y: number };
  shouldBeDestroyed: () => boolean;
  update: () => void;
  render: () => void;
} & Record<string, any>;

export class Circle<T extends IQuadtree> {
  p: p5;
  x: number;
  y: number;
  r: number;

  constructor(p: p5, x: number, y: number, r: number) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.r = r;
  }

  contains(point: T) {
    return circleCollision(
      this.p.createVector(point.position.x, point.position.y),
      this.p.createVector(this.x, this.y),
      this.r * 2
    );
  }
}

export class Rectangle<T extends IQuadtree> {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  public contains(point: T) {
    return (
      point.position.x >= this.x - this.w &&
      point.position.x <= this.x + this.w &&
      point.position.y >= this.y - this.h &&
      point.position.y <= this.y + this.h
    );
  }

  public intersectsRectangle(range: Rectangle<T>): boolean {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }

  public intersects(range: Circle<T>): boolean {
    return (
      range.x + range.r >= this.x - this.w &&
      range.x - range.r <= this.x + this.w &&
      range.y + range.r >= this.y - this.h &&
      range.y - range.r <= this.y + this.h
    );
  }
}

export class Quadtree<T extends IQuadtree> {
  p: p5;
  capacity: number;
  boundary: Rectangle<T>;

  points: T[];

  divided: boolean;
  currentDepth: number;
  topLeft?: Quadtree<T>;
  bottomLeft?: Quadtree<T>;
  bottomRight?: Quadtree<T>;
  topRight?: Quadtree<T>;

  constructor(p: p5, boundary: Rectangle<T>, currentDepth: number = 0) {
    this.p = p;
    this.capacity = 4;
    this.currentDepth = currentDepth;
    this.boundary = boundary;
    this.divided = false;
    this.points = [];
  }

  private subdivide() {
    this.topLeft = new Quadtree(
      this.p,
      new Rectangle(
        this.boundary.x - this.boundary.w / 2,
        this.boundary.y - this.boundary.h / 2,
        this.boundary.w / 2,
        this.boundary.h / 2
      ),
      this.currentDepth + 1
    );
    this.bottomLeft = new Quadtree(
      this.p,
      new Rectangle(
        this.boundary.x - this.boundary.w / 2,
        this.boundary.y + this.boundary.h / 2,
        this.boundary.w / 2,
        this.boundary.h / 2
      ),
      this.currentDepth + 1
    );
    this.bottomRight = new Quadtree(
      this.p,
      new Rectangle(
        this.boundary.x + this.boundary.w / 2,
        this.boundary.y + this.boundary.h / 2,
        this.boundary.w / 2,
        this.boundary.h / 2
      ),
      this.currentDepth + 1
    );
    this.topRight = new Quadtree(
      this.p,
      new Rectangle(
        this.boundary.x + this.boundary.w / 2,
        this.boundary.y - this.boundary.h / 2,
        this.boundary.w / 2,
        this.boundary.h / 2
      ),
      this.currentDepth + 1
    );
  }

  private updateAndRenderPoints() {
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      if (point.shouldBeDestroyed()) {
        this.points.splice(i, 1);
      }
      point.update();
      point.render();
    }
  }

  public updateAndRender(showBoundary: boolean = false) {
    if (showBoundary) {
      this.p.push();
      this.p.stroke(config.quadtreeDefaultColor);
      this.p.strokeWeight(config.quadtreeDefaultStrokeWeight);
      this.p.rectMode(this.p.CENTER);
      this.p.noFill();
      this.p.rect(
        this.boundary.x,
        this.boundary.y,
        this.boundary.w * 2,
        this.boundary.h * 2
      );
      this.p.pop();
    }
    if (this.divided) {
      this.topLeft.updateAndRender(showBoundary);
      this.bottomLeft.updateAndRender(showBoundary);
      this.bottomRight.updateAndRender(showBoundary);
      this.topRight.updateAndRender(showBoundary);
    }

    this.updateAndRenderPoints();
  }

  public query(range: Circle<T>, found?: T[]) {
    if (!found) {
      found = [];
    }

    if (!this.boundary.intersects(range)) {
      return;
    }

    // TODO: Move to private render method
    // Highlight the quadtrees in the perception range of the ant
    // if (config.showQuadtree) {
    //   this.p.push();
    //   this.p.stroke(config.quadtreeHighlightedColor);
    //   this.p.strokeWeight(config.quadtreeHighlightedStrokeWeight);
    //   this.p.rectMode(this.p.CENTER);
    //   this.p.noFill();
    //   this.p.rect(
    //     this.boundary.x,
    //     this.boundary.y,
    //     this.boundary.w * 2,
    //     this.boundary.h * 2
    //   );
    //   this.p.pop();
    // }

    this.points.map((point) => {
      if (range.contains(point)) {
        found.push(point);
      }
    });

    if (this.divided) {
      this.topLeft.query(range, found);
      this.bottomLeft.query(range, found);
      this.bottomRight.query(range, found);
      this.topRight.query(range, found);
    }
    return found;
  }

  public insert(point: T): boolean {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided) {
      if (
        this.points.length < this.capacity ||
        this.currentDepth === config.quadtreeMaxDepth
      ) {
        this.points.push(point);
        return true;
      }

      this.subdivide();
      this.divided = true;
    }

    // if (this.points.length < this.capacity) {
    //   this.points.push(point);
    //   return true;
    // }

    // if (!this.divided) {
    //   this.subdivide();
    //   this.divided = true;
    // }

    return (
      this.topLeft.insert(point) ||
      this.bottomLeft.insert(point) ||
      this.bottomRight.insert(point) ||
      this.topRight.insert(point)
    );
  }
}
