import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Input, Modal, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import obyte from "obyte";
import { generateLink } from "utils/generateLink";
import { redirect } from "utils/redirect";

export const OpenDepositModal = ({
  visible,
  setVisible,
  asset,
  deposit_aa,
  activeWallet,
  decimals,
}) => {
  const dispatch = useDispatch();
  const addressInput = useRef(null);
  const [amount, setAmount] = useState({
    value: undefined,
    valid: undefined,
  });

  const handleChange = (ev) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;

    if (reg.test(String(value)) || value === "") {
      setAmount({ value, valid: true });
    } else {
      setAmount({ value, valid: false });
    }
  };

  let validateStatus = "";
  if (amount.valid === true) {
    validateStatus = "success";
  } else if (amount.valid === false) {
    validateStatus = "error";
  } else {
    validateStatus = "";
  }

  const handleCancel = () => {
    setVisible(false);
    setAmount({ value: undefined, valid: undefined });
  };

  useEffect(() => {
    if (addressInput.current) {
      addressInput.current.focus();
    }
  }, [visible]);

  const link = generateLink(
    amount.value * 10 ** decimals,
    {},
    activeWallet,
    deposit_aa,
    encodeURIComponent(asset)
  );

  return (
    <Modal
      visible={visible}
      title="Open deposit"
      style={{ zIndex: -1 }}
      onCancel={handleCancel}
      footer={
        <Space size={10}>
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>

          <Button
            key="add"
            type="primary"
            disabled={!amount.valid}
            href={link}
            onClick={() =>
              setTimeout(() => {
                handleCancel();
              }, 100)
            }
          >
            Open
          </Button>
        </Space>
      }
    >
      <Form size="large">
        <Form.Item hasFeedback={true} validateStatus={validateStatus}>
          <Input
            placeholder="Amount tokens2"
            value={amount.value}
            onChange={handleChange}
            ref={addressInput}
            autoFocus={true}
            suffix={asset.slice(0, 4) + "..."}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                redirect(link);
                setTimeout(() => {
                  handleCancel();
                }, 100);
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
