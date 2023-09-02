import { World } from "./world";
import { config } from "./config";
import { IConfig } from "./sketch.interface";

let world: World;
let canvasInteractionEnabled = true;
const numAnts: number = 200;
const foodClusterSize: number = 7;

export const updateAcoConfig = <T extends keyof IConfig>(
  param: T,
  newValue: IConfig[T]
) => (config[param] = newValue);

export const setCanvasInteraction = (interactionEnabled: boolean) =>
  (canvasInteractionEnabled = interactionEnabled);

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(config.frameRate);
    world = new World(p);
    for (let i = 0; i < numAnts; i++) {
      world.createAnt();
    }
    world.createFoodCluster(250, 250, foodClusterSize);
    world.createFoodCluster(1000, 150, foodClusterSize);
    world.createFoodCluster(1020, 550, foodClusterSize);
  };

  p.draw = () => {
    world.render();
  };

  p.mousePressed = () => {
    if (!canvasInteractionEnabled) {
      return;
    }
    world.createFoodCluster(p.mouseX, p.mouseY, foodClusterSize);
  };
};
