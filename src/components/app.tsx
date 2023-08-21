// TODO: Remove React import
import React from "react";
import { ControlPanel } from "./control-panel/control-panel";
import { Sketch } from "./sketch-renderer";
import { updateAcoParameter } from "../aco/sketch";

export const App = () => {
  return (
    <>
      <ControlPanel updateAcoParameter={updateAcoParameter} />
      <Sketch />
    </>
  );
};
