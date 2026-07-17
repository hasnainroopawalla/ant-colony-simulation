import * as React from "react";
import { render, screen } from "@testing-library/react";
import { ControlPanel } from "./control-panel";
import { SettingItem } from "./setting-item";
import { SimulatorProvider } from "../contexts/simulator-context";
import type { Simulator } from "../../simulator";

const CONTROL_PANEL_CONTAINER = "control-panel-container";

const mockSimulator = {
  getPlacementMode: vi.fn(() => "food"),
  setPlacementMode: vi.fn(),
} as unknown as Simulator;

describe("ControlPanel", () => {
  beforeEach(() => {
    render(
      <SimulatorProvider simulator={mockSimulator}>
        <ControlPanel />
      </SimulatorProvider>,
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("renders the control panel open by default", async () => {
    expect(screen.getByTestId(CONTROL_PANEL_CONTAINER)).toBeVisible();
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
