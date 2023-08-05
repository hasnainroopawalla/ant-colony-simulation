import * as p5 from "p5";
import { World } from "./world";

let world: World;
const numAnts: number = 100;

export const sketch = (p: p5) => {
  p.setup = () => {
    world = new World(p);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);
    for (let i = 0; i < numAnts; i++) {
      world.createAnt();
    }
  };

  p.draw = () => {
    p.background("#78624f");
    world.render();
  };

  p.mouseClicked = () => {
    world.createFoodCluster(5);
  };
};

export const myp5 = new p5(sketch, document.body);
