import React from "react";
import { SettingItem } from "./setting-item";
import { Checkbox } from "./checkbox";
import { Slider } from "./slider";
import { IUpdateAcoConfig } from "../../aco/sketch.interface";

type IControlPanelContentProps = {
  hideControlPanel: () => void;
  updateAcoConfig: IUpdateAcoConfig;
};

export const ControlPanelContent = (props: IControlPanelContentProps) => {
  const { hideControlPanel, updateAcoConfig } = props;

  return (
    <div className="control-panel-content">
      <a
        className="close-button"
        data-testid="control-panel-close-button"
        onClick={hideControlPanel}
      >
        &times;
      </a>
      {/* TODO: Pass list of SettingItem as a prop */}
      <SettingItem
        title={"maxSpeed"}
        slider={
          <Slider
            configParam={"antMaxSpeed"}
            min={0.1}
            max={5}
            step={0.1}
            defaultValue={2.5}
            updateAcoConfig={updateAcoConfig}
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
            updateAcoConfig={updateAcoConfig}
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
            updateAcoConfig={updateAcoConfig}
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
            updateAcoConfig={updateAcoConfig}
          />
        }
        checkbox={
          <Checkbox
            configParam={"showAntPerceptionRange"}
            updateAcoConfig={updateAcoConfig}
          />
        }
      />
      <SettingItem
        title={"showQuadtree"}
        checkbox={
          <Checkbox
            configParam={"showQuadtree"}
            updateAcoConfig={updateAcoConfig}
          />
        }
      />
    </div>
  );
};
