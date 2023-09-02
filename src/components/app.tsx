import React from "react";
import { ControlPanel } from "./control-panel";
import { Sketch } from "./sketch-renderer";
import { setCanvasInteraction, updateAcoConfig } from "../aco";

export const App = () => {
  return (
    <>
      <ControlPanel
        setCanvasInteraction={setCanvasInteraction}
        updateAcoConfig={updateAcoConfig}
      />
      <Sketch />
      {/* Add footer for GitHub source */}
    </>
  );
};
