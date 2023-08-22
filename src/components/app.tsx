// TODO: Remove React import
import React from "react";
import { ControlPanel } from "./control-panel/control-panel";
import { Sketch } from "./sketch-renderer";

export const App = () => {
  return (
    <>
      <ControlPanel />
      <Sketch />
    </>
  );
};
