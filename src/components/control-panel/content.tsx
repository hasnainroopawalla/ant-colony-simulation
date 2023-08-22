import React from "react";
import { SettingItem } from "./setting-item";
import { Checkbox } from "./checkbox";
import { Slider } from "./slider";

type IControlPanelContentProps = {
  hideControlPanel: () => void;
};

export const ControlPanelContent = (props: IControlPanelContentProps) => {
  const { hideControlPanel } = props;

  return (
    <div className="control-panel-content">
      <a className="close-button" onClick={hideControlPanel}>
        &times;
      </a>
      <SettingItem
        title={"maxSpeed"}
        slider={
          <Slider
            configParam={"antMaxSpeed"}
            min={0.1}
            max={5}
            step={0.1}
            defaultValue={2.5}
          />
        }
      />
      <SettingItem
        title={"wanderStrength"}
        slider={
          <Slider
            configParam={"antWanderStrength"}
            min={0.1}
            max={5}
            step={0.1}
            defaultValue={1.0}
          />
        }
      />
      <SettingItem
        title={"steeringLimit"}
        slider={
          <Slider
            configParam={"antSteeringLimit"}
            min={0.1}
            max={1.0}
            step={0.1}
            defaultValue={0.4}
          />
        }
      />
      <SettingItem
        title={"perceptionRange"}
        slider={
          <Slider
            configParam={"antPerceptionRange"}
            min={10}
            max={100}
            step={1}
            defaultValue={50}
          />
        }
        checkbox={<Checkbox configParam={"showAntPerceptionRange"} />}
      />
      <SettingItem
        title={"showQuadtree"}
        checkbox={<Checkbox configParam={"showQuadtree"} />}
      />
    </div>
  );
};
