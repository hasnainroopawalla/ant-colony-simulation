import * as React from "react";
import { sketch } from "../aco";
import p5 from "p5";

export function Sketch() {
  const p5ContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const p5Instance = new p5(sketch, p5ContainerRef.current ?? undefined);

    return () => p5Instance.remove();
  }, []);

  return <div className="sketch-container" ref={p5ContainerRef} />;
}
