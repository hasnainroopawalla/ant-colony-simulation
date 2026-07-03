import { useEffectOnce } from "./utils";
import { AntColonySimulation } from "../simulations";
import { Simulator } from "../simulator";
import { World } from "../world";
import { P5Renderer } from "../render";

type StartSimulatorActionProps = {
  canvas: HTMLDivElement;
  onSimulatorStartSuccess: (simulator: Simulator) => void;
};

export function StartSimulatorAction({
  canvas,
  onSimulatorStartSuccess,
}: StartSimulatorActionProps) {
  useEffectOnce(() => {
    const renderer = new P5Renderer(canvas);

    const dims = {
      w: canvas.clientWidth,
      h: canvas.clientHeight,
    };

    const world = new World(dims);
    const simulation = new AntColonySimulation(world);

    const simulator = new Simulator(world, simulation, renderer);

    // TODO: make this a promise
    simulator.start();

    onSimulatorStartSuccess(simulator);

    return () => {};
  });

  return null;
}
