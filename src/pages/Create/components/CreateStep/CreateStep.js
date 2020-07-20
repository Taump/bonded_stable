import React, { useState } from "react";
import { Button, Result } from "antd";
import { WalletOutlined } from "@ant-design/icons";

import config from "config";
import { generateLink } from "utils/generateLink";

export const CreateStep = ({ data, setCurrent }) => {
  const link = generateLink(1e5, data, undefined, config.FACTORY_AA);
  return (
    <Result
      status="info"
      icon={<WalletOutlined />}
      title="We are waiting for your request"
      subTitle="Please click on the «Create» button and send the data using your wallet."
      extra={[
        <Button href={link} type="primary" key="CreateStep-create">
          Create
        </Button>,
        <Button
          onClick={() => {
            setCurrent(0);
          }}
          type="danger"
          key="CreateStep-reset"
        >
          Reset
        </Button>,
      ]}
    />
  );
};
