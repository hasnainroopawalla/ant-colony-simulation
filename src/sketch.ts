import * as p5 from "p5";
import { World } from "./world";
import { Quadtree, Rectangle } from "./quadtree";

let world: World;
const numAnts: number = 100;
let quadtree: Quadtree;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    quadtree = new Quadtree(
      new Rectangle(
        p.windowWidth / 2,
        p.windowHeight / 2,
        p.windowWidth / 2,
        p.windowHeight / 2
      )
    );
    world = new World(quadtree);

    for (let i = 0; i < numAnts; i++) {
      world.createAnt();
    }
  };

  p.draw = () => {
    world.render();
  };

  // p.mouseClicked = () => {
  //   world.createFoodCluster(5);
  // };
};

export const p5i = new p5(sketch, document.body);
