import * as React from "react";
import { P5SimulatorCanvas } from "./p5-simulator-canvas";
import { Simulator } from "../simulator";
import { StartSimulatorAction } from "./start-simulator-action";
import { useStateRef } from "./utils";
import { SimulatorProvider } from "./contexts/simulator-context";
import { SettingsProvider } from "./contexts/settings-context";

// export const App = () => {
//   return (
//     <>
//       <ControlPanel
//         setCanvasInteraction={setCanvasInteraction}
//         updateAcoConfig={updateAcoConfig}
//       />
//       <Sketch />
//     </>
//   );
// };

function App() {
  const [simulator, setSimulator] = React.useState<Simulator | null>(null);

  const [canvas, setCanvas, canvasRef] = useStateRef<HTMLDivElement | null>(
    null,
  );

  return (
    <>
      <P5SimulatorCanvas onCanvasReady={setCanvas} canvasRef={canvasRef} />

      {canvas && !simulator && (
        <StartSimulatorAction
          canvas={canvas}
          onSimulatorStartSuccess={setSimulator}
        />
      )}

      {simulator && (
        <SimulatorProvider simulator={simulator}>
          <SettingsProvider>
            {/* <ControlPanel /> */}
            {/* <SimulatorOverlayView /> */}
            {/* <Dialog /> */}
            {/* <Popover /> */}
          </SettingsProvider>
        </SimulatorProvider>
      )}
    </>
  );
}

export function ContextualApp() {
  return <App />;
}
