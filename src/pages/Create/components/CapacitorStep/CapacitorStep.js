import React, { useState } from "react";
import { Form, Input, Row, Col, Button } from "antd";

import { validator } from "utils/validators";
import { getStatusVaild } from "utils/getStatusVaild";
import { Label } from "components/Label/Label";
import styles from "../../CreatePage.module.css";

const { useForm } = Form;
const initialValues = {
  fee_multiplier: 5,
  moved_capacity_share: 0.1,
  threshold_distance: 0.1,
  move_capacity_timeout: 2 * 3600,
};

export const CapacitorStep = ({ setCurrent, setData }) => {
  const [form] = useForm();
  const [validFields, setValidFields] = useState({
    fee_multiplier: true,
    moved_capacity_share: true,
    threshold_distance: true,
    move_capacity_timeout: true,
    slow_capacity_share: undefined,
  });
  const nextIsActive =
    validFields.fee_multiplier &&
    validFields.moved_capacity_share &&
    validFields.threshold_distance &&
    validFields.move_capacity_timeout &&
    validFields.slow_capacity_share;

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
  return (
    <Form
      size="large"
      layout="vertical"
      form={form}
      initialValues={initialValues}
      className={styles.form}
    >
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.fee_multiplier)}
            name="fee_multiplier"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "fee_multiplier",
                    value,
                    type: "number",
                    minValue: 0,
                  }),
              },
            ]}
            label={<Label label="Fee multiplier" descr="Test test" />}
          >
            <Input
              placeholder="Fee multiplier"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.moved_capacity_share)}
            name="moved_capacity_share"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "moved_capacity_share",
                    value,
                    type: "number",
                    minValue: 0,
                  }),
              },
            ]}
            label={
              <Label label="Moved capacity share" descr="Test test test" />
            }
          >
            <Input placeholder="Moved capacity share" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.threshold_distance)}
            name="threshold_distance"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "threshold_distance",
                    value,
                    type: "number",
                    minValue: 0,
                  }),
              },
            ]}
            label={<Label label="Threshold distance" descr="Test test" />}
          >
            <Input
              placeholder="Threshold distance"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col ssm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.move_capacity_timeout)}
            name="move_capacity_timeout"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "move_capacity_timeout",
                    value,
                    type: "number",
                    isInteger: true,
                    minValue: 0,
                  }),
              },
            ]}
            label={<Label label="Move capacity timeout" descr="Test test" />}
          >
            <Input
              placeholder="Move capacity timeout"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.slow_capacity_share)}
            name="slow_capacity_share"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "slow_capacity_share",
                    value,
                    type: "number",
                  }),
              },
            ]}
            label={<Label label="Slow capacity share" descr="Test test test" />}
          >
            <Input placeholder="Slow capacity share" autoComplete="off" />
          </Form.Item>
        </Col>
      </Row>
      <Button
        disabled={!nextIsActive}
        onClick={() => {
          setData((d) => ({ ...d, ...form.getFieldsValue() }));
          setCurrent((c) => c + 1);
        }}
      >
        Next
      </Button>
    </Form>
  );
};
