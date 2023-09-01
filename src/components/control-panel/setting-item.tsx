import React, { ReactNode } from "react";

const styles = {
  settingItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "8px",
  },
  settingTitle: {
    color: "#fff",
  },
  settingComponent: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
} as const;

type ISettingItemProps = {
  title: string;
  slider?: ReactNode;
  checkbox?: ReactNode;
};

export const SettingItem = (props: ISettingItemProps) => {
  const { title, slider, checkbox } = props;

  return (
    <div className="setting-item" style={styles.settingItem}>
      <span className="setting-title" style={styles.settingTitle}>
        {title}
      </span>
      <div className="setting-component" style={styles.settingComponent}>
        {checkbox}
        {slider}
      </div>
    </div>
  );
};
