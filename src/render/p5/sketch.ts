import type { FrameCallback } from "../renderer";
import type { Position } from "../../math";
import * as RenderConstants from "../render.constants";
import p5 from "p5";

type P5Sketch = (p: p5) => void;

export function createSketch(
  container: HTMLElement,
  callbacks: {
    frame: FrameCallback;
    onMouseClick: (position: Position) => void;
  },
): P5Sketch {
  const bindCanvasInteraction = (p: p5, canvas: p5.Renderer) => {
    canvas.mouseClicked(() =>
      callbacks.onMouseClick({ x: p.mouseX, y: p.mouseY }),
    );
  };

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
      const canvas = p.createCanvas(w, h);

      bindCanvasInteraction(p, canvas);

      p.frameRate(RenderConstants.FRAME_RATE);
    };

    p.draw = () => {
      callbacks.frame();
    };

    p.windowResized = () => {
      const { w, h } = getContainerSize();
      p.resizeCanvas(w, h);
    };
  };
}
