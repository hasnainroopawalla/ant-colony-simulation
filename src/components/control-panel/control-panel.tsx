import React from "react";
import { ControlPanelToggle } from "./toggle";
import { ControlPanelContent } from "./content";
import { IUpdateAcoConfig } from "../../aco";

type IControlPanelProps = {
  setCanvasInteraction: (_: boolean) => void;
  updateAcoConfig: IUpdateAcoConfig;
};

export const ControlPanel = (props: IControlPanelProps) => {
  const { setCanvasInteraction, updateAcoConfig } = props;
  const [showControlPanel, setShowControlPanel] = React.useState(false);

  const hideControlPanelCallback = () => {
    setShowControlPanel(false);
    setCanvasInteraction(true);
  };

  return (
    <div
      id="control-panel-container"
      data-testid="control-panel-container"
      onMouseOver={() => setCanvasInteraction(false)}
      onMouseOut={() => setCanvasInteraction(true)}
    >
      {showControlPanel ? (
        <ControlPanelContent
          hideControlPanel={hideControlPanelCallback}
          updateAcoConfig={updateAcoConfig}
        />
      ) : (
        <ControlPanelToggle
          showControlPanel={() => setShowControlPanel(true)}
        />
      )}
    </div>
  );
};
