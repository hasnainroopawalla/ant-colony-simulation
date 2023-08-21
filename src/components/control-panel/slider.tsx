import React from "react";
import { AcoParameter } from "../../aco/sketch";

type ISliderProps = {
  acoParameter: AcoParameter;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  updateAcoParameter: (parameter: AcoParameter, value: number) => void;
};

export const Slider = (props: ISliderProps) => {
  const { acoParameter, min, max, step, defaultValue, updateAcoParameter } =
    props;

  const [value, setValue] = React.useState(defaultValue);

  const formatValue = () => {
    return value < 10 ? `${value.toFixed(1)}` : `${value.toFixed(0)}`;
  };

  const updateValue = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = Number((event.target as HTMLInputElement).value);
    setValue(newValue);
    updateAcoParameter(acoParameter, newValue);
  };

  return (
    <div className="slider-container">
      <span className="slider-title">{acoParameter}</span>
      <div className="slider-component">
        <input
          className="slider-input"
          type="range"
          id={acoParameter}
          min={min}
          max={max}
          defaultValue={defaultValue}
          step={step}
          onInput={(event) => updateValue(event)}
        />
        <span id={`${acoParameter}Value`} className="slider-output">
          {formatValue()}
        </span>
      </div>
    </div>
  );
};
