import p5 from "p5";
import { World } from "./world";
import { Quadtree, Rectangle } from "./quadtree";
import { config } from "./config";
import { IConfig } from "./sketch.interface";
import { FoodItem } from "./food-item";
import { Pheromone } from "./pheromone";

let world: World;
let foodItemQuadtree: Quadtree<FoodItem>;
let pheromoneQuadtree: Quadtree<Pheromone>;
let canvasInteractionEnabled = true;
const numAnts: number = 100;

export const updateAcoConfig = <T extends keyof IConfig>(
  param: T,
  newValue: IConfig[T]
) => {
  config[param] = newValue;
};

export const setCanvasInteraction = (interactionEnabled: boolean) =>
  (canvasInteractionEnabled = interactionEnabled);

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    foodItemQuadtree = new Quadtree(
      p,
      new Rectangle(
        p.windowWidth / 2,
        p.windowHeight / 2,
        p.windowWidth / 2,
        p.windowHeight / 2
      )
    );
    world = new World(p, foodItemQuadtree, pheromoneQuadtree);

    for (let i = 0; i < numAnts; i++) {
      world.createAnt();
    }
  };

  p.draw = () => {
    world.render();
  };

  p.mouseClicked = () => {
    if (!canvasInteractionEnabled) {
      return;
    }
    world.createFoodCluster(5);
  };
};
