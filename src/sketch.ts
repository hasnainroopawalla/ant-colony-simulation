import * as p5 from "p5";
import { World } from "./aco/world";
import { Quadtree, Rectangle } from "./aco/quadtree";
import "./styles/style.css";

let world: World;
const numAnts: number = 100;
let quadtree: Quadtree;
let slider1: p5.Element;

type ISettings = {
  maxSpeed: number;
};

const getSettings = (): ISettings => ({
  maxSpeed: Number(p5i.select("#maxSpeed").value()),
});

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

    slider1 = p.select("#maxSpeed");
  };

  p.draw = () => {
    world.render();
    console.log(getSettings());
  };

  // p.mouseClicked = () => {
  //   world.createFoodCluster(5);
  // };
};

export const p5i = new p5(sketch, document.body);
