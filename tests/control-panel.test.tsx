import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ControlPanel } from "../src/components/control-panel/control-panel";
import { SettingItem } from "../src/components/control-panel/setting-item";

const CONTROL_PANEL_CONTAINER = "control-panel-container";

describe("ControlPanel", () => {
  const setCanvasInteraction = vi.fn();

  beforeEach(() => {
    render(<ControlPanel setCanvasInteraction={setCanvasInteraction} />);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("renders the control panel open by default", async () => {
    expect(screen.getByTestId(CONTROL_PANEL_CONTAINER)).toBeVisible();
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

describe("SettingItem", () => {
  afterEach(() => {
    vi.resetAllMocks();
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
      />,
    );
    expect(screen.getByText("customTitle")).toBeInTheDocument();
    expect(screen.getByTestId("customSlider")).toBeVisible();
  });

  test("only checkbox is rendered if it exists", async () => {
    render(
      <SettingItem
        title="customTitle"
        checkbox={<div data-testid="customCheckbox" />}
      />,
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
      />,
    );
    expect(screen.getByText("customTitle")).toBeInTheDocument();
    expect(screen.getByTestId("customCheckbox")).toBeVisible();
    expect(screen.getByTestId("customSlider")).toBeVisible();
  });
});
