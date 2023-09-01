import React from "react";

const styles = {
  toggleButtonContainer: {
    display: "flex",
    justifyContent: "left",
  },
  toggleButton: {
    color: "#fff",
    position: "absolute",
    margin: "20px 0 0 20px",
    /* TODO: transitions */
    cursor: "pointer",
  },
} as const;

type IControlPanelToggleProps = {
  showControlPanel: () => void;
};

export const ControlPanelToggle = (props: IControlPanelToggleProps) => {
  const { showControlPanel } = props;

  return (
    <div
      className="control-panel-toggle-button-container"
      style={styles.toggleButtonContainer}
    >
      <a
        className="control-panel-toggle-button icon"
        data-testid="control-panel-toggle-button"
        onClick={showControlPanel}
        style={styles.toggleButton}
      >
        <i className="fa fa-cog fa-lg" />
      </a>
    </div>
  );
};
