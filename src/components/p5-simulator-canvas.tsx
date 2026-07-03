import * as React from "react";

type SimulatorCanvasProps = {
  onCanvasReady: (canvas: HTMLDivElement) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
};

export function P5SimulatorCanvas({
  onCanvasReady,
  canvasRef,
}: SimulatorCanvasProps) {
  React.useLayoutEffect(() => {
    if (canvasRef.current) {
      onCanvasReady(canvasRef.current);
    }
  }, [canvasRef, onCanvasReady]);

  return (
    <div
      className="sketch-container h-screen flex-1 overflow-hidden"
      ref={canvasRef}
    />
  );
}
