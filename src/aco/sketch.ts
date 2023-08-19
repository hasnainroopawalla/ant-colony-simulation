import * as p5 from "p5";
import { World } from "./world";
import { Quadtree, Rectangle } from "./quadtree";
import { config } from "./config";

let world: World;
const numAnts: number = 100;
let quadtree: Quadtree;
let canvasInteractionEnabled = true;

const bindListeners = (p: p5) => {
  const maxSpeed = p
    .select("#maxSpeed")
    // @ts-ignore
    .input(() => {
      config.ant.maxSpeed = Number(maxSpeed.value());
    });

  const wanderStrength = p
    .select("#wanderStrength")
    // @ts-ignore
    .input(() => {
      config.ant.wanderStrength = Number(wanderStrength.value());
    });

  const steeringLimit = p
    .select("#steeringLimit")
    // @ts-ignore
    .input(() => {
      config.ant.steeringLimit = Number(steeringLimit.value());
    });

  const perceptionRange = p
    .select("#perceptionRange")
    // @ts-ignore
    .input(() => {
      config.ant.perception.range = Number(perceptionRange.value());
    });

  const showPerceptionRange = p
    .select("#showPerceptionRange")
    // @ts-ignore
    .changed(() => {
      config.ant.perception.show = showPerceptionRange.checked();
    });
};

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

    bindListeners(p);
  };

  p.draw = () => {
    world.render();
  };

  p.select("#control-panel-container")
    .mouseOver(() => {
      canvasInteractionEnabled = false;
    })
    .mouseOut(() => {
      canvasInteractionEnabled = true;
    });

  p.mouseClicked = () => {
    if (!canvasInteractionEnabled) {
      return;
    }
    world.createFoodCluster(5);
  };
};

export const p5i = new p5(sketch, document.body);
