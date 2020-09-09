import React, { useState, useEffect } from "react";
import { Form, Input, Typography, Button, Checkbox, Row, Space } from "antd";
import { useSelector } from "react-redux";
import { validator } from "utils/validators";
import { $get_exchange_result } from "helpers/bonded";
import { generateLink } from "utils/generateLink";
import { getParams } from "helpers/getParams";
import config from "config";
const { Title, Text } = Typography;
const { useForm } = Form;
export const Issue = () => {
  const {
    address,
    params,
    stable_state,
    deposit_aa,
    symbol1,
    symbol2,
    symbol3,
    oracles,
    oracleValueReserve,
    oraclePrice,
  } = useSelector((state) => state.active);

  const [validFields, setValidFields] = useState({
    tokens1: undefined,
    tokens2: undefined,
  });
  const { activeWallet } = useSelector((state) => state.settings);
  const [form] = useForm();
  const [fields, setFields] = useState([]);
  const [tokens1, setTokens1] = useState(undefined);
  const [tokens2, setTokens2] = useState(undefined);
  const [convert, setConvert] = useState(false);
  const [enableHelp, setEnableHelp] = useState(false);

  const reserve = stable_state.reserve;
  const [amount, setAmount] = useState(undefined);

  // const isActiveIssue =
  //   reserve !== undefined
  //     ? (tokens1 !== "" && validFields.tokens1) ||
  //       (tokens2 !== "" && validFields.tokens2)
  //     : validFields.tokens1 && validFields.tokens2;

  let isActiveIssue = false;

  if (reserve) {
    if (Number(tokens1) && tokens1 && Number(tokens2) && tokens2) {
      isActiveIssue = validFields.tokens1 && validFields.tokens2;
      console.log(1);
    } else if (tokens1 && Number(tokens1)) {
      isActiveIssue = validFields.tokens1;
      console.log(2);
    } else if (tokens2 && Number(tokens2)) {
      isActiveIssue = validFields.tokens2;
      console.log(3);
    }
  } else {
    isActiveIssue =
      Number(tokens1) &&
      validFields.tokens1 &&
      Number(tokens2) &&
      validFields.tokens2;
    console.log(4);
  }

  const validateValue = (params) =>
    validator({
      ...params,
      onSuccess: () => setValidFields((v) => ({ ...v, [params.name]: true })),
      onError: () => setValidFields((v) => ({ ...v, [params.name]: false })),
    });

  const { setFieldsValue, resetFields } = form;
  const actualParams = getParams(params, stable_state);

  useEffect(() => {
    const get_exchange_result = $get_exchange_result({
      tokens1: tokens1 * 10 ** actualParams.decimals1 || 0,
      tokens2: tokens2 * 10 ** actualParams.decimals2 || 0,
      params: actualParams,
      vars: stable_state,
      oracle_price: oraclePrice,
      timestamp: Math.floor(Date.now() / 1000),
      oracleValueReserve,
    });

    if (enableHelp || !reserve) {
      if (tokens2 !== 0 && tokens2 !== undefined) {
        setFieldsValue({
          tokens1: Number(get_exchange_result.s1init).toFixed(
            actualParams.decimals1
          ),
        });

        setTokens1(
          Number(get_exchange_result.s1init).toFixed(actualParams.decimals1)
        );
        setValidFields((v) => ({ ...v, tokens1: true }));
      }
    }

    setAmount(get_exchange_result);
  }, [
    tokens1,
    tokens2,
    reserve,
    isActiveIssue,
    setFieldsValue,
    oraclePrice,
    params,
    stable_state,
    oracleValueReserve,
  ]);

  let link = "";
  try {
    link =
      amount !== undefined && amount.reserve_needed !== undefined
        ? generateLink(
            Math.ceil(amount.reserve_needed * 1.001 + 1000),
            {
              tokens1:
                Number(tokens1).toFixed(params.decimals1) *
                  10 ** params.decimals1 || undefined,
              tokens2:
                Number(tokens2).toFixed(params.decimals2) *
                  10 ** params.decimals2 || undefined,
              tokens2_to: convert ? deposit_aa : undefined,
            },
            activeWallet,
            address
          )
        : "";
  } catch {}

  useEffect(() => {
    resetFields();
    setValidFields((v) => ({ ...v, tokens1: false }));
    setValidFields((v) => ({ ...v, tokens2: false }));
  }, [address, resetFields]);

  const priceChange =
    amount !== undefined && 1 / amount.p2 - (1 / stable_state.p2 || 0);
  const changePriceProcent = (priceChange / (1 / stable_state.p2) || 0) * 100;
  const changeFinalPriceProcent =
    amount !== undefined
      ? ((1 / amount.p2 - 1 / amount.target_p2) / (1 / amount.target_p2)) * 100
      : 0;

  const clearForm = () => {
    setValidFields({ tokens1: false, tokens2: false });
    resetFields();
    setTokens1(undefined);
    setTokens2(undefined);
    setFieldsValue({
      tokens1: undefined,
      tokens2: undefined,
    });
    setAmount(undefined);
  };
  const f = (x) => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);
  return (
    <>
      <Row justify="space-between" align="middle">
        <Title level={3}>Buy tokens</Title>
        {reserve && (
          <Checkbox
            checked={enableHelp}
            onChange={(e) => {
              setEnableHelp(e.target.checked);
              if (!enableHelp) {
                setTokens1(
                  Number(amount.s1init).toFixed(actualParams.decimals1)
                );
                setFieldsValue({
                  tokens1: Number(amount.s1init).toFixed(
                    actualParams.decimals1
                  ),
                });
              }
            }}
            style={{ marginBottom: 12 }}
          >
            Set token1 amount to minimize fees
          </Checkbox>
        )}
      </Row>
      {!reserve && (
        <p>
          <Text type="secondary">
            You are the first to buy tokens this stablecoin, so you should buy
            token 1 and token 2 at the same time
          </Text>
        </p>
      )}
      <p>
        <Text type="secondary">
          How many tokens of each type you want to buy
        </Text>
      </p>
      <Form
        // fields={fields}
        form={form}
        // onFieldsChange={(changedFields, allFields) => {
        //   console.log("changedFields", changedFields);
        //   if (changedFields.length > 0) {
        //     const tokens1 = changedFields.find((t) => t.name === "tokens1");
        //     const tokens2 = changedFields.find((t) => t.name === "tokens2");
        //     if (tokens1) {
        //       if (f(tokens1.value) <= 3) {
        //         setFields(allFields);
        //       }
        //     }
        //     if (tokens2) {
        //       if (f(tokens2.value) <= 3) {
        //         setFields(allFields);
        //       }
        //     }
        //   }
        // }}
        onValuesChange={(value, store) => {
          if ("tokens1" in value) {
            console.log("test", f(value.tokens1));
            if (f(value.tokens1) <= actualParams.decimals1) {
              setTokens1(value.tokens1);
            }
          } else if ("tokens2" in value) {
            if (f(value.tokens2) <= actualParams.decimals2) {
              setTokens2(value.tokens2);
            }
          }
        }}
        size="large"
        style={{ marginBottom: 20 }}
      >
        <Form.Item
          name="tokens1"
          rules={[
            {
              validator: (rule, value) =>
                validateValue({
                  value,
                  name: "tokens1",
                  type: "number",
                  minValue: reserve === undefined ? 0 : undefined,
                  maxDecimals: actualParams.decimals1,
                }),
            },
          ]}
        >
          <Input
            placeholder={`Amount of tokens1 (${
              symbol1 || stable_state.asset1
            })`}
            autoComplete="off"
            suffix={
              <span style={{ color: "#ccc" }}>
                {amount !== undefined &&
                  "≈ " +
                    amount.s1p.toFixed(2) +
                    " " +
                    (oracleValueReserve
                      ? config.reserves[actualParams.reserve_asset].feedCurrency
                      : config.reserves[actualParams.reserve_asset].name)}
              </span>
            }
            disabled={enableHelp || !reserve}
          />
        </Form.Item>
        <Form.Item
          name="tokens2"
          rules={[
            {
              validator: (rule, value) =>
                validateValue({
                  value,
                  name: "tokens2",
                  type: "number",
                  maxDecimals: actualParams.decimals2,
                }),
            },
          ]}
        >
          <Input
            suffix={
              <span style={{ color: "#ccc" }}>
                {amount !== undefined &&
                  "≈ " +
                    amount.s2p.toFixed(2) +
                    " " +
                    (oracleValueReserve
                      ? config.reserves[actualParams.reserve_asset].feedCurrency
                      : config.reserves[actualParams.reserve_asset].name)}
              </span>
            }
            placeholder={`Amount of tokens2 (${
              symbol2 || stable_state.asset2
            })`}
            autoComplete="off"
          />
        </Form.Item>

        {params.interest_rate !== 0 && (
          <Checkbox
            style={{ marginBottom: 20 }}
            checked={convert}
            onChange={(e) => setConvert(e.target.checked)}
          >
            Immediately convert to stable token {symbol3 || ""}
          </Checkbox>
        )}

        <>
          <Text type="secondary" style={{ display: "block" }}>
            <b>Fee:</b>{" "}
            {(amount &&
              amount !== undefined &&
              amount.fee !== 0 &&
              amount.fee_percent !== Infinity &&
              (tokens1 || tokens2) &&
              Number(amount.fee_percent).toFixed(2)) ||
              0}
            %
          </Text>
          <Text type="secondary" style={{ display: "block" }}>
            <b>Reward:</b>{" "}
            {(amount &&
              amount !== undefined &&
              amount.reward !== 0 &&
              (tokens1 || tokens2) &&
              !isNaN(amount.reward_percent) &&
              Number(amount.reward_percent).toFixed(2)) ||
              0}
            %
          </Text>
          {amount !== undefined && (
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: reserve ? 0 : 20 }}
            >
              <b>{"p2" in stable_state ? "Price change: " : "Price: "}</b>
              {isActiveIssue ? (
                <>
                  {priceChange > 0 ? "+" : ""}
                  {priceChange.toFixed(4)}
                  {"p2" in stable_state &&
                    " (" +
                      (changePriceProcent > 0 ? "+" : "") +
                      changePriceProcent.toFixed(2) +
                      "%)"}
                </>
              ) : (
                " - "
              )}
            </Text>
          )}
          {reserve && (
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 20 }}
            >
              <b>Final price:</b>{" "}
              {(amount &&
                amount !== undefined &&
                (Number(tokens1) || Number(tokens2)) &&
                Number(1 / amount.p2).toFixed(
                  actualParams.reserve_asset_decimals
                ) +
                  ` (${Math.abs(changeFinalPriceProcent).toFixed(2)}% ${
                    changeFinalPriceProcent > 0 ? "above" : "below"
                  } the target)`) ||
                "-"}
            </Text>
          )}
        </>
        {(isActiveIssue === undefined || !isActiveIssue) && (
          <Button disabled={true}>Send</Button>
        )}
        {amount && isActiveIssue !== undefined && isActiveIssue ? (
          <>
            <Space>
              <Button
                type="primary"
                href={link}
                // onClick={() => setTimeout(() => clearForm(), 100)}
                disabled={
                  ((Number(tokens1) === 0 || tokens1 === undefined) &&
                    (Number(tokens2) === 0 || tokens2 === undefined)) ||
                  !isActiveIssue
                }
              >
                Send{" "}
                {Number(
                  (amount.reserve_needed * 1.001) /
                    10 ** params.reserve_asset_decimals
                ).toFixed(params.reserve_asset_decimals)}{" "}
                {params.reserve_asset === "base"
                  ? " GB"
                  : params.reserve_asset.slice(0, 4)}
              </Button>
              {isActiveIssue && oracleValueReserve && (
                <div>
                  ≈ {amount.reserve_needed_in_сurrency.toFixed(2)}{" "}
                  {oracleValueReserve
                    ? config.reserves[actualParams.reserve_asset].feedCurrency
                    : config.reserves[actualParams.reserve_asset].name}
                </div>
              )}
            </Space>
            <div>
              <Text type="secondary" style={{ fontSize: 10 }}>
                1% was added to protect against price volatility, you'll get
                this amount back if the prices don't change.
              </Text>
            </div>
          </>
        ) : null}
      </Form>
    </>
  );
};
