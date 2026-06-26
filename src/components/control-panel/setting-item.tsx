import * as React from "react";

type ISettingItemProps = {
  title: string;
  slider?: React.ReactNode;
  checkbox?: React.ReactNode;
};

export const SettingItem = (props: ISettingItemProps) => {
  const { title, slider, checkbox } = props;

  return (
    <div className="setting-item flex flex-row justify-between p-2">
      <span className="setting-title text-white">{title}</span>
      <div className="setting-component flex flex-row gap-2.5">
        {checkbox}
        {slider}
      </div>
    </div>
  );
};
