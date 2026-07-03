import * as React from "react";
import { P5SimulatorCanvas } from "./p5-simulator-canvas";
import { Simulator } from "../simulator";
import { StartSimulatorAction } from "./start-simulator-action";
import { useStateRef } from "./utils";
import { ControlPanel } from "./control-panel";
import { StatsPanel } from "./stats-panel";

function App() {
  const [simulator, setSimulator] = React.useState<Simulator | null>(null);

  const [canvas, setCanvas, canvasRef] = useStateRef<HTMLDivElement | null>(
    null,
  );

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        <ControlPanel />
        <P5SimulatorCanvas onCanvasReady={setCanvas} canvasRef={canvasRef} />
        <StatsPanel />
      </div>

      {canvas && !simulator && (
        <StartSimulatorAction
          canvas={canvas}
          onSimulatorStartSuccess={setSimulator}
        />
      )}
    </>
  );
}

export function ContextualApp() {
  return <App />;
}
