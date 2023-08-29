import React, { ReactNode } from "react";

type ISettingItemProps = {
  title: string;
  slider?: ReactNode;
  checkbox?: ReactNode;
};

export const SettingItem = (props: ISettingItemProps) => {
  const { title, slider, checkbox } = props;

  return (
    <div className="slider-container">
      <span className="slider-title">{title}</span>
      <div className="slider-component">
        {checkbox}
        {slider}
      </div>
    </div>
  );
};
