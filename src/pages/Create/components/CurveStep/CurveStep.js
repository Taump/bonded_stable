import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Button, Select, message } from "antd";

import { validator } from "utils/validators";
import { getStatusVaild } from "utils/getStatusVaild";
import { Label } from "components/Label/Label";
import styles from "../../CreatePage.module.css";
import client from "services/socket";

const { useForm } = Form;
const initialValues = {
  m: 2,
  n: 0.5,
  leverage: 0,
  interest_rate: 0,
  oracle: "F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N",
  feed_name: "GBYTE_USD",
  reserve_asset: "base",
  reserve_asset_decimals: 9,
};
export const CurverStep = ({ setCurrent, setData }) => {
  const [form] = useForm();
  const { getFieldsValue } = form;
  const [checkOracle, setCheckOracle] = useState(null);
  const [validFields, setValidFields] = useState({
    m: true,
    n: true,
    leverage: true,
    interest_rate: true,
    oracle: true,
    feed_name: true,
    reserve_asset: true,
    decimals1: undefined,
    decimals2: undefined,
    reserve_asset_decimals: true,
  });

  const nextIsActive =
    validFields.m &&
    validFields.n &&
    validFields.reserve_asset &&
    validFields.reserve_asset_decimals &&
    validFields.decimals1 &&
    validFields.decimals2 &&
    validFields.leverage &&
    validFields.interest_rate;

  const validateValue = ({
    name,
    value,
    type,
    maxValue,
    minValue,
    isInteger,
  }) =>
    validator({
      value,
      type,
      maxValue,
      minValue,
      isInteger,
      onSuccess: () => setValidFields((v) => ({ ...v, [name]: true })),
      onError: () => setValidFields((v) => ({ ...v, [name]: false })),
    });

  useEffect(() => {
    const getStatusOracle = async () => {
      const { oracle, feed_name } = getFieldsValue();
      try {
        const data_feed = await client.api.getDataFeed({
          oracles: [oracle],
          feed_name: feed_name,
          ifnone: "none",
        });
        if (data_feed !== "none") {
          setCheckOracle(true);
        } else {
          message.error("The Oracle is not active!");
          setCheckOracle(null);
        }
      } catch (e) {
        setCheckOracle(null);
        message.error("Oracle is not found!");
        console.log("error", e);
      }
    };
    if (checkOracle === false) {
      getStatusOracle();
    }
  }, [checkOracle, getFieldsValue]);
  return (
    <Form
      size="large"
      layout="vertical"
      form={form}
      initialValues={initialValues}
      className={styles.form}
    >
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 16 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.oracle)}
            name="oracle"
            label={
              <Label
                label="Oracle"
                className="label"
                descr="Address of price oracle that tracks the exchange rate between the target currency (e.g. USD) and the collateral currency (e.g. GBYTE)."
              />
            }
          >
            <Input
              placeholder="Oracle"
              autoComplete="off"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.feed_name)}
            name="feed_name"
            label={<Label label="Feed name" descr="Test test test" />}
          >
            <Input
              placeholder="Feed name"
              autoComplete="off"
              disabled={checkOracle === true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 16 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.reserve_asset)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    value,
                    type: "asset",
                    name: "reserve_asset",
                  }),
              },
            ]}
            name="reserve_asset"
            label={<Label label="Reserve asset" descr="Test test" />}
          >
            {/* <Input
              placeholder="Reserve asset"
              autoComplete="off"
              style={{ width: "100%" }}
            /> */}
            <Select placeholder="Reserve asset" style={{ width: "100%" }}>
              <Select.Option value={"base"}>GBYTE</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.reserve_asset_decimals)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    value,
                    name: "reserve_asset_decimals",
                    type: "decimals",
                  }),
              },
            ]}
            name="reserve_asset_decimals"
            label={<Label label="Reserve decimals" descr="Test test test" />}
          >
            <Input
              placeholder="Reserve decimals"
              autoComplete="off"
              disabled={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.decimals1)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "decimals1", type: "decimals" }),
              },
            ]}
            name="decimals1"
            label={<Label label="Decimals 1" descr="Test test" />}
          >
            <Input
              placeholder="Decimals 1"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.decimals2)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "decimals2", type: "decimals" }),
              },
            ]}
            name="decimals2"
            label={<Label label="Decimals 2" descr="Test test test" />}
          >
            <Input placeholder="Decimals 2" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            validateStatus={getStatusVaild(validFields.leverage)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "leverage", type: "number" }),
              },
            ]}
            hasFeedback
            name="leverage"
            label={<Label label="Leverage" descr="Test test" />}
          >
            <Input
              placeholder="Leverage"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.m)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "m", type: "number" }),
              },
            ]}
            name="m"
            label={<Label label="m" descr="Test test" />}
          >
            <Input
              placeholder="m"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            validateStatus={getStatusVaild(validFields.n)}
            hasFeedback
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "n", type: "number" }),
              },
            ]}
            name="n"
            label={<Label label="n" descr="Test test test" />}
          >
            <Input placeholder="n" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.interest_rate)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    value,
                    name: "interest_rate",
                    type: "number",
                  }),
              },
            ]}
            name="interest_rate"
            label={<Label label="Interest rate" descr="Test test" />}
          >
            <Input
              placeholder="Interest rate"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
      </Row>
      {(checkOracle === null || checkOracle === false) && (
        <Button
          loading={checkOracle === false}
          onClick={() => setCheckOracle(false)}
        >
          Check oracle
        </Button>
      )}
      {checkOracle === true && (
        <Button
          disabled={!nextIsActive}
          onClick={() => {
            setData((d) => ({ ...d, ...form.getFieldsValue() }));
            setCurrent((c) => c + 1);
          }}
        >
          Next
        </Button>
      )}
    </Form>
  );
};
