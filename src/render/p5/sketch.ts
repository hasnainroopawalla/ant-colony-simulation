import type { FrameCallback } from "../renderer";
import RenderConfig from "../render.config";

type P5Sketch = (p: p5) => void;

export const updateAcoConfig = () => {};

export const setCanvasInteraction = () => {};

export function createSketch(frameCallback: FrameCallback): P5Sketch {
  return (p: p5) => {
    p.setup = () => {
      // explicitly stop the draw loop to prevent the simulation
      // from running before the user starts it.
      p.noLoop();

      p.createCanvas(p.windowWidth, p.windowHeight);
      p.frameRate(RenderConfig.frameRate);
    };

    p.draw = () => {
      frameCallback();
    };
  };
}
