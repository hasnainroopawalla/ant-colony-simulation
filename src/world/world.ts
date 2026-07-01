import { Colony } from "./colony";
import { FoodItem } from "./food-item";
import { Obstacle } from "./obstacle";
import { Quadtree } from "../math/quadtree";
import type { Dimensions } from "../math/types";
import { MathUtils, Vector } from "../math";

export class World {
  public colonies: Colony[];
  public foodItems: FoodItem[];
  public obstacles: Obstacle[];

  public dims: Dimensions;
  private foodQuadtree: Quadtree<FoodItem>;

  constructor(dims: Dimensions) {
    this.dims = dims;

    this.colonies = [new Colony()];
    this.foodItems = [];
    this.obstacles = [];

    // initialize the world boundaries as obstacles
    this.obstacles = [
      new Obstacle({ x: 0, y: 0, w: this.dims.w, h: 0 }),
      new Obstacle({ x: 0, y: 0, w: 0, h: this.dims.h }),
      new Obstacle({ x: this.dims.w, y: 0, w: 0, h: this.dims.h }),
      new Obstacle({ x: 0, y: this.dims.h, w: this.dims.w, h: 0 }),

      new Obstacle({ x: 300, y: 400, w: 80, h: 200 }),
    ];

    this.foodQuadtree = new Quadtree({
      x: this.dims.w / 2,
      y: this.dims.h / 2,
      w: this.dims.w / 2,
      h: this.dims.h / 2,
    });
  }

  // public createFoodCluster(
  //   spawnX: number,
  //   spawnY: number,
  //   clusterSize: number = 5,
  // ) {
  //   for (let i = 0; i < clusterSize; i++) {
  //     for (let j = 0; j < clusterSize; j++) {
  //       // TODO: Make it less boxy
  //       const position = new Vector(
  //         spawnX + i * EngineConfig.foodClusterSpacing + Math.random() * 10 - 5,
  //         spawnY + j * EngineConfig.foodClusterSpacing + Math.random() * 10 - 5,
  //       );

  //       const foodItem = new FoodItem(this.p, position);
  //       this.foodItems.push(foodItem);
  //       this.foodQuadtree.insert(foodItem);
  //     }
  //   }
  // }

  public isObstacleInAntPerceptionRange(
    antPosition: Vector,
    antPerception: Vector,
  ): boolean {
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      if (
        MathUtils.isLineIntersectingRect(
          antPosition,
          antPerception,
          obstacle.dims,
        )
      ) {
        return true;
      }
    }
    return false;
  }
}
