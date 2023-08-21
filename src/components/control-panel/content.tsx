import React from "react";
import { Slider } from "./slider";
import { AcoParameter } from "../../aco/sketch";

type IControlPanelContentProps = {
  hideControlPanel: () => void;
  updateAcoParameter: (parameter: AcoParameter, value: number) => void;
};

export const ControlPanelContent = (props: IControlPanelContentProps) => {
  const { hideControlPanel, updateAcoParameter } = props;
  return (
    <div className="control-panel-content">
      <a className="close-button" onClick={hideControlPanel}>
        &times;
      </a>
      <Slider
        acoParameter={AcoParameter.maxSpeed}
        min={0.1}
        max={5}
        step={0.1}
        defaultValue={2.5}
        updateAcoParameter={updateAcoParameter}
      />
      <Slider
        acoParameter={AcoParameter.wanderStrength}
        min={0.1}
        max={5}
        step={0.1}
        defaultValue={1.0}
        updateAcoParameter={updateAcoParameter}
      />
      <Slider
        acoParameter={AcoParameter.steeringLimit}
        min={0.1}
        max={1.0}
        step={0.1}
        defaultValue={0.4}
        updateAcoParameter={updateAcoParameter}
      />
    </div>
  );
};
