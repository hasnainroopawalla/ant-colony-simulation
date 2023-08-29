import * as React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { ControlPanel } from "../src/components/control-panel/control-panel";
import { ControlPanelToggle } from "../src/components/control-panel/toggle";
import { ControlPanelContent } from "../src/components/control-panel/content";
import { SettingItem } from "../src/components/control-panel/setting-item";
import { Slider } from "../src/components/control-panel/slider";
import { Checkbox } from "../src/components/control-panel/checkbox";

const CONTROL_PANEL_CONTAINER = "control-panel-container";
const CONTROL_PANEL_CLOSE_BUTTON = "control-panel-close-button";
const CONTROL_PANEL_TOGGLE_BUTTON = "control-panel-toggle-button";

const updateAcoConfig = jest.fn();

describe("ControlPanel", () => {
  const setCanvasInteraction = jest.fn();

  beforeEach(() => {
    render(
      <ControlPanel
        setCanvasInteraction={setCanvasInteraction}
        updateAcoConfig={updateAcoConfig}
      />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders ControlPanelToggle by default", async () => {
    expect(screen.getByTestId("control-panel-toggle-button")).toBeVisible();
  });

  test("disable canvas interaction when mouse over", async () => {
    fireEvent.mouseOver(screen.getByTestId(CONTROL_PANEL_CONTAINER));
    expect(setCanvasInteraction).toHaveBeenCalledWith(false);
  });

  test("enable canvas interaction when mouse out", async () => {
    fireEvent.mouseOut(screen.getByTestId(CONTROL_PANEL_CONTAINER));
    expect(setCanvasInteraction).toHaveBeenCalledWith(true);
  });
});

describe("ControlPanelToggle", () => {
  const showControlPanel = jest.fn();

  beforeEach(() => {
    render(<ControlPanelToggle showControlPanel={showControlPanel} />);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders the toggle button", async () => {
    expect(screen.getByTestId(CONTROL_PANEL_TOGGLE_BUTTON)).toBeVisible();
  });

  test("show control panel on click", async () => {
    fireEvent.click(screen.getByTestId(CONTROL_PANEL_TOGGLE_BUTTON));
    expect(showControlPanel).toHaveBeenCalledTimes(1);
  });
});

describe("ControlPanelContent", () => {
  const hideControlPanel = jest.fn();

  beforeEach(() => {
    render(
      <ControlPanelContent
        hideControlPanel={hideControlPanel}
        updateAcoConfig={updateAcoConfig}
      />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("control panel close button is visible", async () => {
    expect(screen.getByTestId(CONTROL_PANEL_CLOSE_BUTTON)).toBeVisible();
  });

  test("hide control panel content on close button click", async () => {
    fireEvent.click(screen.getByTestId(CONTROL_PANEL_CLOSE_BUTTON));
    expect(hideControlPanel).toHaveBeenCalledTimes(1);
  });
});

describe("SettingItem", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("title is visible", async () => {
    render(<SettingItem title="customTitle" />);
    expect(screen.getByText("customTitle")).toBeInTheDocument();
  });

  test("only slider is rendered if it exists", async () => {
    render(
      <SettingItem
        title="customTitle"
        slider={<div data-testid="customSlider" />}
      />
    );
    expect(screen.getByText("customTitle")).toBeInTheDocument();
    expect(screen.getByTestId("customSlider")).toBeVisible();
  });

  test("only checkbox is rendered if it exists", async () => {
    render(
      <SettingItem
        title="customTitle"
        checkbox={<div data-testid="customCheckbox" />}
      />
    );
    expect(screen.getByText("customTitle")).toBeInTheDocument();
    expect(screen.getByTestId("customCheckbox")).toBeVisible();
  });

  test("checkbox and slider are both rendered if they exists", async () => {
    render(
      <SettingItem
        title="customTitle"
        checkbox={<div data-testid="customCheckbox" />}
        slider={<div data-testid="customSlider" />}
      />
    );
    expect(screen.getByText("customTitle")).toBeInTheDocument();
    expect(screen.getByTestId("customCheckbox")).toBeVisible();
    expect(screen.getByTestId("customSlider")).toBeVisible();
  });
});

describe("Slider", () => {
  const SLIDER = "antMaxSpeedSlider";

  beforeEach(() => {
    render(
      <Slider
        configParam="antMaxSpeed"
        min={1.0}
        max={10}
        step={1.0}
        defaultValue={4.0}
        updateAcoConfig={updateAcoConfig}
      />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders the input slider", async () => {
    expect(screen.getByTestId(SLIDER)).toBeInTheDocument();
  });

  test("renders the slider value", async () => {
    expect(screen.getByText("4.0")).toBeInTheDocument();
  });

  test("updates the ACO config when slider value changed", async () => {
    fireEvent.input(screen.getByTestId(SLIDER));
    expect(updateAcoConfig).toHaveBeenCalledTimes(1);
    expect(updateAcoConfig).toHaveBeenCalledWith("antMaxSpeed", 4);
  });
});

describe("Checkbox", () => {
  const CHECKBOX = "showFoodItemsQuadtreeCheckbox";

  beforeEach(() => {
    render(
      <Checkbox
        configParam={"showFoodItemsQuadtree"}
        isChecked={false}
        updateAcoConfig={updateAcoConfig}
      />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders the checkbox", async () => {
    expect(screen.getByTestId(CHECKBOX)).toBeInTheDocument();
  });

  test("updates the ACO config when checkbox toggled", async () => {
    fireEvent.click(screen.getByTestId(CHECKBOX));
    expect(updateAcoConfig).toHaveBeenCalledTimes(1);
    expect(updateAcoConfig).toHaveBeenCalledWith("showFoodItemsQuadtree", true);
  });
});
