import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { FpsIndicator } from "./fps-indicator";
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

const renderIndicator = () =>
  render(
    <SimulatorProvider simulator={mockSimulator}>
      <FpsIndicator />
    </SimulatorProvider>,
  );

const emitStats = (stats: Stats) => {
  act(() => {
    statsHandler?.(stats);
  });
};

describe("FpsIndicator", () => {
  afterEach(() => {
    vi.clearAllMocks();
    statsHandler = undefined;
  });

  test("subscribes to stats.update on mount", () => {
    renderIndicator();
    expect(mockSimulator.on).toHaveBeenCalledWith(
      "stats.update",
      expect.any(Function),
    );
  });

  test("renders the rounded fps value", () => {
    renderIndicator();
    emitStats({
      fps: 59.6,
      antCount: { home: 0, food: 0 },
      foodAmount: 0,
      elapsedTime: 0,
    });
    expect(screen.getByText("60 fps")).toBeInTheDocument();
  });
});
