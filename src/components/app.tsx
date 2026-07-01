import { ControlPanel } from "./control-panel";
import { Sketch } from "./sketch-renderer";
import { setCanvasInteraction, updateAcoConfig } from "../render/p5/sketch";

export const App = () => {
  return (
    <>
      <ControlPanel
        setCanvasInteraction={setCanvasInteraction}
        updateAcoConfig={updateAcoConfig}
      />
      <Sketch />
    </>
  );
};
