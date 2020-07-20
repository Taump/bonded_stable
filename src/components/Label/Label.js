import React from "react";
import { Tooltip } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export const Label = ({ label, descr }) => {
  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      <span style={{ paddingRight: 5 }}>{label}</span>
      <Tooltip title={descr}>
        {" "}
        <ExclamationCircleOutlined />
      </Tooltip>
    </span>
  );
};
