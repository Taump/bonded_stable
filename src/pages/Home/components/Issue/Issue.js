import React, { useState, useEffect } from "react";
import { Form, Input, Typography, Button } from "antd";
import { useSelector } from "react-redux";
import { validator } from "utils/validators";
import { getStatusVaild } from "utils/getStatusVaild";
import { $get_exchange_result } from "helpers/bonded";
import { generateLink } from "utils/generateLink";
const { Title, Text } = Typography;
const { useForm } = Form;
export const Issue = () => {
  const { address, params, stable_state, oracleValue } = useSelector(
    (state) => state.active
  );
  const [validFields, setValidFields] = useState({
    tokens1: undefined,
    tokens2: undefined,
  });
  const [form] = useForm();
  const [tokens, setTokens] = useState([]);
  const reserve = stable_state.reserve;
  const tokens1Field = tokens.find((t) => t.name[0] === "tokens1");
  const tokens2Field = tokens.find((t) => t.name[0] === "tokens2");
  const tokens1 = tokens1Field ? tokens1Field.value : 0;
  const tokens2 = tokens2Field ? tokens2Field.value : 0;
  const [amount, setAmount] = useState(undefined);
  const isActiveIssue =
    reserve !== undefined
      ? validFields.tokens1 || validFields.tokens2
      : validFields.tokens1 && validFields.tokens2;

  const validateValue = (params) =>
    validator({
      ...params,
      onSuccess: () => setValidFields((v) => ({ ...v, [params.name]: true })),
      onError: () => setValidFields((v) => ({ ...v, [params.name]: false })),
    });

  useEffect(() => {
    const get_exchange_result = $get_exchange_result({
      tokens1: tokens1 * 10 ** params.decimals1 || 0,
      tokens2: tokens2 * 10 ** params.decimals2 || 0,
      params,
      vars: stable_state,
      oracle_price: oracleValue,
      timestamp: Math.floor(Date.now() / 1000),
    });

    if (!reserve && tokens1) {
      form.setFieldsValue({ tokens2: get_exchange_result.s2init });
      setValidFields((v) => ({ ...v, tokens2: true }));
    }

    setAmount(get_exchange_result);
  }, [tokens1, tokens2, reserve, isActiveIssue]);

  const link =
    amount != undefined && "reserve_needed" in amount
      ? generateLink(
          Math.ceil(amount.reserve_needed * 1.001 + 1000),
          {
            tokens1: tokens1 * 10 ** params.decimals1 || undefined,
            tokens2: tokens2 * 10 ** params.decimals2 || undefined,
          },
          undefined,
          address
        )
      : "";

  useEffect(() => {
    form.resetFields();
    setValidFields((v) => ({ ...v, tokens1: false }));
    setValidFields((v) => ({ ...v, tokens2: false }));
    setAmount(undefined);
  }, [address]);

  return (
    <>
      <Title level={3} type="secondary">
        Issue stablecoins
      </Title>
      {!reserve && (
        <Text type="secondary">
          You are the first to issue this stablecoin, so you should issue token
          1 and token 2 at the same time
        </Text>
      )}
      <Form
        fields={tokens}
        form={form}
        onFieldsChange={(changedFields, allFields) => {
          setTokens(allFields);
        }}
        size="large"
        style={{ marginBottom: 20 }}
      >
        <Form.Item
          hasFeedback
          name="tokens1"
          validateStatus={getStatusVaild(validFields.token1)}
          rules={[
            {
              validator: (rule, value) =>
                validateValue({
                  value,
                  name: "tokens1",
                  type: "number",
                  minValue: reserve === undefined ? 0 : undefined,
                }),
            },
          ]}
        >
          <Input
            placeholder={`Amount token1 (${stable_state.asset1})`}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="tokens2"
          hasFeedback
          validateStatus={getStatusVaild(validFields.token2)}
          rules={[
            {
              validator: (rule, value) =>
                validateValue({
                  value,
                  name: "tokens2",
                  type: "number",
                }),
            },
          ]}
        >
          <Input
            disabled={!reserve}
            placeholder={`Amount token2 (${stable_state.asset2})`}
            autoComplete="off"
          />
        </Form.Item>

        <>
          <Text type="secondary" style={{ display: "block" }}>
            <b>Fee:</b>{" "}
            {(amount &&
              amount !== undefined &&
              amount.fee != 0 &&
              (tokens1 || tokens2) &&
              Number(amount.fee_percent).toFixed(2)) ||
              0}
            %
          </Text>
          <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
            <b>Reward:</b>{" "}
            {(amount &&
              amount !== undefined &&
              amount.reward != 0 &&
              (tokens1 || tokens2) &&
              Number(amount.reward_percent).toFixed(2)) ||
              0}
            %
          </Text>
        </>
        {(isActiveIssue === undefined || !isActiveIssue) && (
          <Button disabled={true}>Send</Button>
        )}
        {isActiveIssue !== undefined && isActiveIssue && (
          <>
            <Button
              type="primary"
              href={link}
              disabled={tokens1 == 0 && tokens2 == 0}
            >
              Send{" "}
              {Number((amount.reserve_needed * 1.001) / 1e9).toFixed(
                params.reserve_asset_decimals
              )}{" "}
              {params.reserve_asset === "base"
                ? " GB"
                : params.reserve_asset.slice(4)}
            </Button>
            <div>
              <Text type="secondary" style={{ fontSize: 10 }}>
                * You will get back ~ 1% of the amount sent
              </Text>
            </div>
          </>
        )}
      </Form>
    </>
  );
};
