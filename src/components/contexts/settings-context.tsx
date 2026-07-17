import * as React from "react";
import { useSimulator } from "./simulator-context";
import type { SettingDescriptor, SettingValue } from "../../settings";

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
      Object.fromEntries(
        [...simulator.getSettingsProviders()].map(([namespace, provider]) => [
          namespace,
          provider.getSettings(),
        ]),
      ) as Record<string, SettingDescriptor[]>,
    [simulator],
  );

  const updateSetting = React.useCallback(
    (namespace: string, key: string, value: SettingValue) => {
      const provider = simulator.getSettingsProviders().get(namespace);
      provider?.updateSettings(key, value);
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
