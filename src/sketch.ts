import * as p5 from "p5";
import { World } from "./world";
import { config } from "./config";

let world: World;
const numAnts: number = 1;

export const sketch = (p: p5) => {
  p.setup = () => {
    world = new World(p);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(config.sketch.frameRate);
    for (let i = 0; i < numAnts; i++) {
      world.createAnt();
    }
  };

  p.draw = () => {
    world.render();
  };

  p.mouseClicked = () => {
    world.createFoodCluster(5);
  };
};

export const myp5 = new p5(sketch, document.body);
