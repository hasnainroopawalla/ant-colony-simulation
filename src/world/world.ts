import { Colony } from "./colony";
import { FoodItem } from "./food-item";
import { Obstacle } from "./obstacle";
import { MathUtils, Vector, Quadtree } from "../math";
import type { Circle, Dimensions, Position } from "../math";
import * as WorldConstants from "./world.constants";

export class World {
  public colonies: Colony[];
  public foodItems: FoodItem[];
  public obstacles: Obstacle[];

  public dims: Dimensions;

  private foodQuadtree: Quadtree<FoodItem>;

  constructor(dims: Dimensions) {
    this.dims = dims;

    this.colonies = [
      new Colony({
        x: 200,
        y: 200,
      }),
    ];

    this.foodItems = [];

    // TODO are these dims correct?
    this.foodQuadtree = new Quadtree({
      x: this.dims.w / 2,
      y: this.dims.h / 2,
      w: this.dims.w / 2,
      h: this.dims.h / 2,
    });

    // initialize the world boundaries as obstacles
    this.obstacles = [
      new Obstacle({ x: 0, y: 0, w: this.dims.w, h: 0 }),
      new Obstacle({ x: 0, y: 0, w: 0, h: this.dims.h }),
      new Obstacle({ x: this.dims.w, y: 0, w: 0, h: this.dims.h }),
      new Obstacle({ x: 0, y: this.dims.h, w: this.dims.w, h: 0 }),

      new Obstacle({ x: 300, y: 400, w: 80, h: 200 }),

      new Obstacle({ x: 400, y: 300, w: 80, h: 40 }),
      new Obstacle({ x: 430, y: 400, w: 60, h: 40 }),
    ];

    this.createFoodCluster({ x: 500, y: 700 }, 10);
  }

  public createFoodCluster(position: Position, clusterSize: number = 10) {
    for (let i = 0; i < clusterSize; i++) {
      for (let j = 0; j < clusterSize; j++) {
        const foodItemPosition = new Vector(
          position.x +
            i * WorldConstants.FOOD_CLUSTER_SPACING +
            MathUtils.randomFloat() * 10 -
            WorldConstants.FOOD_CLUSTER_SPACING,
          position.y +
            j * WorldConstants.FOOD_CLUSTER_SPACING +
            MathUtils.randomFloat() * 10 -
            WorldConstants.FOOD_CLUSTER_SPACING,
        );

        const foodItem = new FoodItem(
          foodItemPosition,
          MathUtils.randomInt(1, WorldConstants.MAX_FOOD_QUANTITY),
        );

        this.foodItems.push(foodItem);
        this.foodQuadtree.insert(foodItem);
      }
    }
  }

  public isPathBlocked(antPosition: Vector, antPerception: Vector): boolean {
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

  public queryFood(circle: Circle): FoodItem | null {
    const found = this.foodQuadtree.query({
      x: circle.center.x,
      y: circle.center.y,
      r: circle.radius,
    });

    return found.length > 0 ? found[0] : null;
  }

  public update(): void {
    this.foodItems = this.foodItems.filter(
      (foodItem) => !foodItem.isDepleted(),
    );

    this.foodQuadtree.rebuild(this.foodItems);
  }
}
