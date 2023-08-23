import React from "react";
import { IUpdateAcoConfig, IConfig } from "../../aco/sketch.interface";

export type ICheckboxProps = {
  configParam: keyof IConfig;
  updateAcoConfig: IUpdateAcoConfig;
};

export const Checkbox = (props: ICheckboxProps) => {
  const { configParam, updateAcoConfig } = props;

  return (
    <input
      type="checkbox"
      id={`${configParam}Checkbox`}
      data-testid={`${configParam}Checkbox`}
      onChange={(event) =>
        updateAcoConfig(configParam, (event.target as HTMLInputElement).checked)
      }
    />
  );
};
