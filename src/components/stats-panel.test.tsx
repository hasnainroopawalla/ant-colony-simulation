import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { StatsPanel } from "./stats-panel";
import { SimulatorProvider } from "./contexts/simulator-context";
import type { Simulator } from "../simulator";
import type { Stats } from "../events";

let statsHandler: ((data: Stats) => void) | undefined;

const mockSimulator = {
  on: vi.fn((event: string, handler: (data: Stats) => void) => {
    if (event === "stats.update") {
      statsHandler = handler;
    }
    return () => {};
  }),
} as unknown as Simulator;

const renderPanel = () =>
  render(
    <SimulatorProvider simulator={mockSimulator}>
      <StatsPanel />
    </SimulatorProvider>,
  );

const emitStats = (stats: Stats) => {
  act(() => {
    statsHandler?.(stats);
  });
};

describe("StatsPanel", () => {
  afterEach(() => {
    vi.clearAllMocks();
    statsHandler = undefined;
  });

  test("subscribes to stats.update on mount", () => {
    renderPanel();
    expect(mockSimulator.on).toHaveBeenCalledWith(
      "stats.update",
      expect.any(Function),
    );
  });

  test("renders separate home and food ant counts", () => {
    renderPanel();
    emitStats({
      fps: 60,
      antCount: { home: 320, food: 180 },
      foodAmount: 42,
      elapsedTime: 0,
    });
    expect(screen.getByText("320")).toBeInTheDocument();
    expect(screen.getByText("180")).toBeInTheDocument();
  });

  test("renders the elapsed time formatted as mm:ss", () => {
    renderPanel();
    emitStats({
      fps: 60,
      antCount: { home: 0, food: 0 },
      foodAmount: 0,
      elapsedTime: 125,
    });
    expect(screen.getByText("02:05")).toBeInTheDocument();
  });

  test("renders the food amount", () => {
    renderPanel();
    emitStats({
      fps: 59.6,
      antCount: { home: 0, food: 0 },
      foodAmount: 42,
      elapsedTime: 0,
    });
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
