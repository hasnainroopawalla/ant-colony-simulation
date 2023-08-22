import React from "react";
import { ControlPanelToggle } from "./toggle";
import { ControlPanelContent } from "./content";

export const ControlPanel = () => {
  const [showControlPanel, setShowControlPanel] = React.useState(false);

  return (
    <div id="control-panel-container">
      <ControlPanelToggle showControlPanel={() => setShowControlPanel(true)} />
      {showControlPanel && (
        <ControlPanelContent
          hideControlPanel={() => setShowControlPanel(false)}
        />
      )}
    </div>
  );
};
