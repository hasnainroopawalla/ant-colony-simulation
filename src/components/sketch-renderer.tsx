import * as React from "react";
import { Simulator } from "../simulator";
import { P5Renderer } from "../render";
import { AntColonySimulation } from "../simulations";
import { World } from "../world";

function P5Sketch() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const renderer = new P5Renderer(containerRef.current);

    const dims = {
      w: containerRef.current.clientWidth,
      h: containerRef.current.clientHeight,
    };

    const world = new World(dims);
    const simulation = new AntColonySimulation(world);

    const sim = new Simulator(world, simulation, renderer);
    sim.start();

    return () => {
      sim.stop();
      // TODO
      // p5Instance.remove();
    };
  }, []);

  return <div className="sketch-container" ref={containerRef} />;
}

export { P5Sketch as Sketch };
