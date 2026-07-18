import * as React from "react";
import { useSimulator } from "./contexts/simulator-context";
import type { Stats } from "../events";

export const useStats = (): Stats => {
  const sim = useSimulator();

  const [stats, setStats] = React.useState<Stats>({
    fps: 0,
    antCount: {
      food: 0,
      home: 0,
    },
    foodAmount: 0,
    elapsedTime: 0,
  });

  React.useEffect(() => {
    const unsubscribe = sim.on("stats.update", (data) => {
      setStats(data);
    });

    return () => {
      unsubscribe();
    };
  }, [sim]);

  return stats;
};
