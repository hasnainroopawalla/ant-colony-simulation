import React from "react";

type IControlPanelToggleProps = {
  showControlPanel: () => void;
};

export const ControlPanelToggle = (props: IControlPanelToggleProps) => {
  const { showControlPanel } = props;

  return (
    <div className="control-panel-toggle-button-container">
      <a
        className="control-panel-toggle-button icon"
        onClick={showControlPanel}
      >
        <i className="fa fa-cog fa-lg" />
      </a>
    </div>
  );
};
