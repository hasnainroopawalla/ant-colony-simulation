import { World } from "./world";
import { config } from "./config";
import { IConfig } from "./sketch.interface";

let world: World;
let canvasInteractionEnabled = true;
const numAnts: number = 100;
const foodClusterSize: number = 5;

export const updateAcoConfig = <T extends keyof IConfig>(
  param: T,
  newValue: IConfig[T]
) => (config[param] = newValue);

export const setCanvasInteraction = (interactionEnabled: boolean) =>
  (canvasInteractionEnabled = interactionEnabled);

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    world = new World(p);
    for (let i = 0; i < numAnts; i++) {
      world.createAnt();
    }
  };

  p.draw = () => {
    world.render();
  };

  p.keyPressed = () => {
    world.loop = false;
  };

  p.mousePressed = () => {
    if (!canvasInteractionEnabled) {
      return;
    }
    world.createFoodCluster(foodClusterSize);
  };
};
