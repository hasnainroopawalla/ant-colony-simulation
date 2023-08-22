// TODO: Move all exports index.ts
import { World } from "./world";
import { Quadtree, Rectangle } from "./quadtree";
import { config, IConfig } from "./config";

let world: World;
let quadtree: Quadtree;
let canvasInteractionEnabled = true;
const numAnts: number = 100;

export const updateConfig = <T extends keyof IConfig>(
  param: T,
  newValue: IConfig[T]
) => {
  config[param] = newValue;
};

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    quadtree = new Quadtree(
      p,
      new Rectangle(
        p.windowWidth / 2,
        p.windowHeight / 2,
        p.windowWidth / 2,
        p.windowHeight / 2
      )
    );
    world = new World(p, quadtree);

    for (let i = 0; i < numAnts; i++) {
      world.createAnt();
    }
  };

  p.draw = () => {
    world.render();
  };

  // p.select("#control-panel-container")
  //   .mouseOver(() => {
  //     canvasInteractionEnabled = false;
  //   })
  //   .mouseOut(() => {
  //     canvasInteractionEnabled = true;
  //   });

  p.mouseClicked = () => {
    if (!canvasInteractionEnabled) {
      return;
    }
    world.createFoodCluster(5);
  };
};
