import type { FrameCallback } from "../renderer";
import RenderConfig from "../render.config";

type P5Sketch = (p: p5) => void;

export const updateAcoConfig = () => {};

export const setCanvasInteraction = () => {};

export function createSketch(
  container: HTMLElement,
  frameCallback: FrameCallback,
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
      p.frameRate(RenderConfig.frameRate);
    };

    p.draw = () => {
      frameCallback();
    };

    p.windowResized = () => {
      const { w, h } = getContainerSize();
      p.resizeCanvas(w, h);
    };
  };
}
