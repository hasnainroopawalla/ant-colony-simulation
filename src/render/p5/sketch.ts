import type { FrameCallback } from "../renderer";
import type { Position } from "../../math/types";
import * as RenderConstants from "../render.constants";

type P5Sketch = (p: p5) => void;

export const updateAcoConfig = () => {};

export const setCanvasInteraction = () => {};

export function createSketch(
  container: HTMLElement,
  callbacks: {
    frame: FrameCallback;
    onMouseClick: (position: Position) => void;
  },
): P5Sketch {
  return (p: p5) => {
    const getContainerSize = () => ({
      w: container.clientWidth || p.windowWidth,
      h: container.clientHeight || p.windowHeight,
    });

    p.setup = () => {
      // explicitly stop the draw loop to prevent the simulation
      // from running before the user starts it.
      p.noLoop();

      const { w, h } = getContainerSize();
      p.createCanvas(w, h);
      p.frameRate(RenderConstants.FRAME_RATE);
    };

    p.draw = () => {
      callbacks.frame();
    };

    p.windowResized = () => {
      const { w, h } = getContainerSize();
      p.resizeCanvas(w, h);
    };

    p.mouseClicked = () => {
      callbacks.onMouseClick({ x: p.mouseX, y: p.mouseY });
    };
  };
}
