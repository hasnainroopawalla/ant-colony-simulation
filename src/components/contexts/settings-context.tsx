import * as React from "react";
import { useSimulator } from "./simulator-context";
import type { SettingDescriptor, SettingValue } from "../../settings-provider";

type SettingsContextValue = {
  getSettings: () => Record<string, SettingDescriptor[]>;
  updateSetting: (namespace: string, key: string, value: SettingValue) => void;
};

const SettingsContext = React.createContext<SettingsContextValue>({
  getSettings: () => ({}),
  updateSetting: () => {},
});

export const SettingsProvider = ({ children }: React.PropsWithChildren) => {
  const simulator = useSimulator();

  const getSettings = React.useCallback(
    () =>
      simulator.getSettingsProviders().reduce(
        (acc, provider) => {
          acc[provider.namespace] = provider.getSettings();
          return acc;
        },
        {} as Record<string, SettingDescriptor[]>,
      ),
    [simulator],
  );

  // TODO: fix this, dont use .find()
  const updateSetting = React.useCallback(
    (namespace: string, key: string, value: SettingValue) => {
      const provider = simulator
        .getSettingsProviders()
        .find((p) => p.namespace === namespace);
      provider?.updateSettings(key as never, value as never);
    },
    [simulator],
  );

  return (
    <SettingsContext.Provider
      value={{
        getSettings,
        updateSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue =>
  React.useContext(SettingsContext);
