import React from "react";
import { SettingItem } from "./setting-item";
import { Checkbox } from "./checkbox";
import { Slider } from "./slider";
import { IUpdateAcoConfig, config } from "../../aco";

type IControlPanelContentProps = {
  hideControlPanel: () => void;
  updateAcoConfig: IUpdateAcoConfig;
};

const styles = {
  controlPanelContent: {
    width: "350px",
    maxHeight: "60%",
    position: "absolute",
    margin: "20px 0 0 20px",
    borderRadius: "0.6rem",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    overflow: "auto",
  },
  controlPanelHeader: {
    padding: "20px 10px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: "25px",
    color: "#fff",
  },
  closeButton: {
    cursor: "pointer",
  },
} as const;

export const ControlPanelContent = (props: IControlPanelContentProps) => {
  const { hideControlPanel, updateAcoConfig } = props;

  return (
    <div className="control-panel-content" style={styles.controlPanelContent}>
      <div className="control-panel-header" style={styles.controlPanelHeader}>
        <div>
          <span>Ant Colony Simulation</span>
        </div>
        <div>
          <a
            className="close-button"
            data-testid="control-panel-close-button"
            onClick={hideControlPanel}
            style={styles.closeButton}
          >
            &times;
          </a>
        </div>
      </div>
      <div className="control-panel-items">
        <SettingItem
          title={"maxSpeed"}
          slider={
            <Slider
              configParam={"antMaxSpeed"}
              min={0.1}
              max={5}
              step={0.1}
              defaultValue={config.antMaxSpeed}
              updateAcoConfig={updateAcoConfig}
            />
          }
        />
        <SettingItem
          title={"wanderStrength"}
          slider={
            <Slider
              configParam={"antWanderStrength"}
              min={0}
              max={0.3}
              step={0.01}
              defaultValue={config.antWanderStrength}
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
              defaultValue={config.antSteeringLimit}
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
              defaultValue={config.antPerceptionRange}
              updateAcoConfig={updateAcoConfig}
            />
          }
          checkbox={
            <Checkbox
              configParam={"showAntPerceptionRange"}
              isChecked={config.showAntPerceptionRange}
              updateAcoConfig={updateAcoConfig}
            />
          }
        />
        <SettingItem
          title={"showFoodItemsQuadtree"}
          checkbox={
            <Checkbox
              configParam={"showFoodItemsQuadtree"}
              isChecked={config.showFoodItemsQuadtree}
              updateAcoConfig={updateAcoConfig}
            />
          }
        />
        <SettingItem
          title={"showHomePheromones"}
          checkbox={
            <Checkbox
              configParam={"showHomePheromones"}
              isChecked={config.showHomePheromones}
              updateAcoConfig={updateAcoConfig}
            />
          }
        />
        <SettingItem
          title={"showHomePheromonesQuadtree"}
          checkbox={
            <Checkbox
              configParam={"showHomePheromonesQuadtree"}
              isChecked={config.showHomePheromonesQuadtree}
              updateAcoConfig={updateAcoConfig}
            />
          }
        />
        <SettingItem
          title={"showFoodPheromones"}
          checkbox={
            <Checkbox
              configParam={"showFoodPheromones"}
              isChecked={config.showFoodPheromones}
              updateAcoConfig={updateAcoConfig}
            />
          }
        />
        <SettingItem
          title={"showFoodPheromonesQuadtree"}
          checkbox={
            <Checkbox
              configParam={"showFoodPheromonesQuadtree"}
              isChecked={config.showFoodPheromonesQuadtree}
              updateAcoConfig={updateAcoConfig}
            />
          }
        />
      </div>
    </div>
  );
};
