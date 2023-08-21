import React from "react";
import { ControlPanelToggle } from "./toggle";
import { ControlPanelContent } from "./content";
import { AcoParameter } from "../../aco/sketch";

type IControlPanelProps = {
  updateAcoParameter: (parameter: AcoParameter, value: number) => void;
};

export const ControlPanel = (props: IControlPanelProps) => {
  const { updateAcoParameter } = props;
  const [showControlPanel, setShowControlPanel] = React.useState(false);

  return (
    <div id="control-panel-container">
      <ControlPanelToggle showControlPanel={() => setShowControlPanel(true)} />
      {showControlPanel ? (
        <ControlPanelContent
          updateAcoParameter={updateAcoParameter}
          hideControlPanel={() => setShowControlPanel(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
