import React from "react";
import { updateConfig } from "../../aco/sketch";
import { IConfig } from "../../aco/config";

export type ICheckboxProps = {
  configParam: keyof IConfig;
};

export const Checkbox = (props: ICheckboxProps) => {
  const { configParam } = props;

  return (
    <input
      type="checkbox"
      id={configParam}
      onChange={(event) =>
        updateConfig(configParam, (event.target as HTMLInputElement).checked)
      }
    />
  );
};
