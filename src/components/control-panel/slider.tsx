import React from "react";
import { IConfig, IUpdateAcoConfig } from "../../aco/sketch.interface";

type ISliderProps = {
  configParam: keyof IConfig;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  updateAcoConfig: IUpdateAcoConfig;
};

export const Slider = (props: ISliderProps) => {
  const { configParam, min, max, step, defaultValue, updateAcoConfig } = props;

  const [value, setValue] = React.useState(defaultValue);

  const formatValue = () => {
    return value < 10 ? `${value.toFixed(1)}` : `${value.toFixed(0)}`;
  };

  const updateValue = (event: React.FormEvent<HTMLInputElement>) => {
    const element = event.target as HTMLInputElement;
    const newValue = Number(element.value);
    updateAcoConfig(configParam, newValue);
    setValue(newValue);
  };

  return (
    <>
      <input
        type="range"
        // TODO: define id and data-testid once as a const
        id={`${configParam}Slider`}
        data-testid={`${configParam}Slider`}
        min={min}
        max={max}
        defaultValue={defaultValue}
        step={step}
        onInput={(event) => updateValue(event)}
      />
      <span id={`${configParam}Value`} className="slider-output">
        {formatValue()}
      </span>
    </>
  );
};
