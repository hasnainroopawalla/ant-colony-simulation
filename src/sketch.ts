import * as p5 from "p5";
import { World } from "./world";
import { config } from "./config";
import { Quadtree, Circle, Rectangle } from "./quadtree";

let world: World;
const numAnts: number = 1;
let quadtree: Quadtree;
let range: Circle;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(config.sketch.frameRate);

    const [x, y, w, h] = [
      p.windowWidth / 2,
      p.windowHeight / 2,
      p.windowWidth / 2,
      p.windowHeight / 2,
    ];
    quadtree = new Quadtree(new Rectangle(x, y, w, h));
    world = new World(quadtree);

    // range = new Circle(50, 50, 40);

    // for (let i = 0; i < 500; i++) {
    //   quadtree.insert({
    //     x: p.random(0, x + w),
    //     y: p.random(0, y + h),
    //   });
    // }
    for (let i = 0; i < numAnts; i++) {
      world.createAnt();
    }
  };

  p.draw = () => {
    // p.background(255);
    // p.noFill();
    // p.strokeWeight(2);
    // p.stroke("green");
    // p.circle(range.x, range.y, range.r * 2);
    world.render();
    quadtree.render();

    // quadtree.query(range).map((point) => {
    //   p.fill("red");
    //   p5i.strokeWeight(7);
    //   p.point(point.x, point.y);
    // });
  };

  p.mouseClicked = () => {
    world.createFoodCluster(5);
    // range = new Circle(p.mouseX, p.mouseY, 40);
    // quadtree.insert({ x: p.mouseX, y: p.mouseY });
  };
};

export const p5i = new p5(sketch, document.body);
