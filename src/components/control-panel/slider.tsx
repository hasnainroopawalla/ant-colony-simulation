import React from "react";
import { updateConfig } from "../../aco/sketch";
import { IConfig } from "../../aco/config";

type ISliderProps = {
  configParam: keyof IConfig;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

export const Slider = (props: ISliderProps) => {
  const { configParam, min, max, step, defaultValue } = props;

  const [value, setValue] = React.useState(defaultValue);

  const formatValue = () => {
    return value < 10 ? `${value.toFixed(1)}` : `${value.toFixed(0)}`;
  };

  const updateValue = (event: React.FormEvent<HTMLInputElement>) => {
    const element = event.target as HTMLInputElement;
    const newValue = Number(element.value);
    updateConfig(configParam, newValue);
    setValue(newValue);
  };

  return (
    <>
      <input
        type="range"
        id={`${configParam}Slider`}
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
