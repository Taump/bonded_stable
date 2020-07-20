import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row } from "antd";
import { validator } from "utils/validators";
import { getStatusVaild } from "utils/getStatusVaild";
import { generateLink } from "utils/generateLink";
import socket from "services/socket";

const { useForm } = Form;

export const RedeemToken = ({
  tokens,
  setTokens,
  asset,
  address,
  activeWallet,
  decimals,
  reserve_asset_decimals,
}) => {
  const [valid, setValid] = useState(undefined);
  const [exchange, setExchange] = useState(undefined);
  const [token, setToken] = useState([]);
  const [form] = useForm();
  const { getFieldsValue, resetFields } = form;
  const { r_tokens } = getFieldsValue();

  const validateValue = (params) => {
    return validator({
      ...params,
      onSuccess: () => setValid(true),
      onError: () => setValid(false),
    });
  };

  useEffect(() => {
    resetFields();
    setValid(undefined);
  }, [address, resetFields]);

  useEffect(() => {
    // console.log("nre", r_tokens1, r_tokens2);
    const { r_tokens } = getFieldsValue();

    const check = async (r_tokens) => {
      const paramsDry1 = {
        address,
        trigger: {
          outputs: {
            base: 10000,
            [asset]: Number(r_tokens).toFixed(decimals) * 10 ** decimals,
          },
          address: activeWallet || "2QVJOY3BRRGWP7IOYL64O5BU3WLUJ4TZ",
        },
      };

      try {
        if (valid) {
          if (r_tokens !== "") {
            const dry = await socket.api.dryRunAa(paramsDry1);
            if ("bounced" in dry[0] && dry[0].bounced) {
              setExchange(null);
              return null;
            }

            if (
              dry[0] != undefined &&
              r_tokens !== undefined &&
              r_tokens !== ""
            ) {
              const DryObj = dry[0];

              if ("response" in DryObj && "responseVars" in DryObj.response) {
                const payout = DryObj.response.responseVars.payout;
                setExchange(payout);
              }
            }
          }
        }
      } catch (e) {
        setExchange(null);
      }
    };

    check(r_tokens);
  }, [getFieldsValue, token, activeWallet, address, valid]);

  const link = generateLink(
    Number(r_tokens).toFixed(decimals) * 10 ** decimals,
    {},
    activeWallet,
    address,
    encodeURIComponent(asset)
  );

  let extra;
  if (exchange !== undefined && exchange !== null && valid && r_tokens !== "") {
    extra = `You will get ${exchange / 10 ** reserve_asset_decimals} GBYTE `;
  } else if (exchange === null && valid && r_tokens !== "") {
    extra =
      "The transaction would change the price too much, please try a smaller amount";
  } else {
    extra = undefined;
  }

  return (
    <Form
      fields={token}
      form={form}
      onFieldsChange={(changedFields, allFields) => {
        setToken(allFields);
      }}
      size="large"
    >
      <Form.Item
        name={`r_tokens`}
        validateStatus={getStatusVaild(valid)}
        // initialValue={tokens1}
        extra={extra}
        rules={[
          {
            validator: (rule, value) =>
              validateValue({
                value,
                name: "r_tokens",
                type: "number",
                minValue: 0,
              }),
          },
        ]}
      >
        <Input.Search
          placeholder={`Amount token ${asset}`}
          autoComplete="off"
          enterButton={
            <Button
              type="primary"
              disabled={!valid || exchange === null}
              href={link}
            >
              Redeem
            </Button>
          }
        />
      </Form.Item>
    </Form>
  );
};
