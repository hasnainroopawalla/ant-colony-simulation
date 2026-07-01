import { Colony } from "./colony";
import { FoodItem } from "./food-item";
import { Obstacle } from "./obstacle";
import { Quadtree } from "../math/quadtree";
import type { Dimensions } from "../math/types";

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

    // this.obstacles = [
    //   { x1: 0, y1: 0, x2: this.p.windowWidth, y2: 0 },
    //   {
    //     x1: 0,
    //     y1: this.p.windowHeight,
    //     x2: this.p.windowWidth,
    //     y2: this.p.windowHeight,
    //   },
    //   { x1: 0, y1: 0, x2: 0, y2: this.p.windowHeight },
    //   {
    //     x1: this.p.windowWidth,
    //     y1: 0,
    //     x2: this.p.windowWidth,
    //     y2: this.p.windowHeight,
    //   },
    // ];

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
}
