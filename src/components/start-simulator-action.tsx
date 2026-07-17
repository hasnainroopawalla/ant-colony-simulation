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

    const world = new World({
      w: canvas.clientWidth,
      h: canvas.clientHeight,
    });

    const simulation = new AntColonySimulation(world);

    const simulator = new Simulator(world, simulation, renderer);

    simulator.start();

    onSimulatorStartSuccess(simulator);

    return () => {};
  });

  return null;
}
