import * as React from "react";
import type { Simulator } from "../../simulator";

type SimulatorContextValue = {
  simulator: Simulator;
};

type SimulatorProviderProps = SimulatorContextValue;

const SimulatorContext = React.createContext<SimulatorContextValue>(
  {} as SimulatorContextValue,
);

export const SimulatorProvider = ({
  children,
  simulator,
}: React.PropsWithChildren<SimulatorProviderProps>) => {
  return (
    <SimulatorContext.Provider
      value={{
        simulator,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = (): Simulator =>
  React.useContext(SimulatorContext).simulator;
