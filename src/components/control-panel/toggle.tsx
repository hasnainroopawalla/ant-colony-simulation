import * as React from "react";

type IControlPanelToggleProps = {
  showControlPanel: () => void;
};

export const ControlPanelToggle = (props: IControlPanelToggleProps) => {
  const { showControlPanel } = props;

  return (
    <div className="control-panel-toggle-button-container flex justify-start">
      <a
        className="control-panel-toggle-button icon absolute mt-5 ml-5 cursor-pointer text-white"
        data-testid="control-panel-toggle-button"
        onClick={showControlPanel}
      >
        <i className="fa fa-cog fa-lg" />
      </a>
    </div>
  );
};
