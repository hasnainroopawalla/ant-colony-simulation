import * as p5 from "p5";
import { World } from "./world";
import { config } from "./config";
import { Quadtree, Rectangle } from "./quadtree";

let world: World;
const numAnts: number = 1;
let quadtree: Quadtree;

const sketch = (p: p5) => {
  p.setup = () => {
    world = new World();
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(config.sketch.frameRate);

    const [x, y, w, h] = [
      p.windowWidth / 2,
      p.windowHeight / 2,
      p.windowWidth / 2,
      p.windowHeight / 2,
    ];
    quadtree = new Quadtree(new Rectangle(x, y, w, h));
    console.log(quadtree);

    // let points = [];
    // for (let i = 0; i < 11; i++) {
    //   points.push({
    //     x: p.random(0, x + w),
    //     y: p.random(0, y + h),
    //   })
    // }

    // console.log(points);

    // for (let i = 0; i < 11; i++) {
    //   quadtree.insert(points[i]);
    // }

    // p.strokeWeight(5);
    // p.rect(
    //   p.windowWidth / 2,
    //   p.windowHeight / 2,
    //   p.windowWidth / 2,
    //   p.windowHeight / 2
    // );
    // for (let i = 0; i < numAnts; i++) {
    //   world.createAnt();
    // }
  };

  p.draw = () => {
    quadtree.render();
    // world.render();
  };

  p.mouseClicked = () => {
    // world.createFoodCluster(50);
    quadtree.insert({ x: p.mouseX, y: p.mouseY });
  };
};

export const p5i = new p5(sketch, document.body);
