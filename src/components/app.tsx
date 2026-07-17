import * as React from "react";
import { P5SimulatorCanvas } from "./p5-simulator-canvas";
import { Simulator } from "../simulator";
import { StartSimulatorAction } from "./start-simulator-action";
import { useStateRef } from "./utils";
import { ControlPanel } from "./control-panel";
import { StatsPanel } from "./stats-panel";
import { SimulatorProvider } from "./contexts/simulator-context";
import { SettingsProvider } from "./contexts/settings-context";

export function App() {
  const [simulator, setSimulator] = React.useState<Simulator | null>(null);

  const [canvas, setCanvas, canvasRef] = useStateRef<HTMLDivElement | null>(
    null,
  );

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        {simulator ? (
          <SimulatorProvider simulator={simulator}>
            <SettingsProvider>
              <ControlPanel />
              <StatsPanel />
            </SettingsProvider>
          </SimulatorProvider>
        ) : (
          <aside className="h-screen w-75 shrink-0 bg-[#121212]" />
        )}
        <P5SimulatorCanvas onCanvasReady={setCanvas} canvasRef={canvasRef} />
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
