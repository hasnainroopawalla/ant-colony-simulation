import React from "react";
import { IUpdateAcoConfig, IConfig } from "../../aco";

export type ICheckboxProps = {
  configParam: keyof IConfig;
  updateAcoConfig: IUpdateAcoConfig;
  isChecked: boolean;
};

export const Checkbox = (props: ICheckboxProps) => {
  const { configParam, updateAcoConfig, isChecked } = props;

  const [value, setValue] = React.useState(isChecked);

  const updateValue = (event: React.FormEvent<HTMLInputElement>) => {
    const element = event.target as HTMLInputElement;
    const newValue = element.checked;
    updateAcoConfig(configParam, newValue);
    setValue(newValue);
  };

  // TODO: Change checked color to blue
  return (
    <input
      type="checkbox"
      id={`${configParam}Checkbox`}
      data-testid={`${configParam}Checkbox`}
      checked={value}
      onChange={(event) => updateValue(event)}
    />
  );
};
