import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Input, Modal, Space } from "antd";
import obyte from "obyte";
import { generateLink } from "utils/generateLink";
import { redirect } from "utils/redirect";

export const EditRecipient = ({
  visible,
  setShowWalletModal,
  id,
  activeWallet,
  deposit_aa,
}) => {
  const addressInput = useRef(null);
  const [address, setAddress] = useState({
    value: undefined,
    valid: undefined,
  });

  const handleChange = (ev) => {
    const value = ev.target.value;
    if (obyte.utils.isValidAddress(value)) {
      setAddress({ value: value, valid: true });
    } else {
      setAddress({ value: value, valid: false });
    }
  };

  let validateStatus = "";
  if (address.valid === true) {
    validateStatus = "success";
  } else if (address.valid === false) {
    validateStatus = "error";
  } else {
    validateStatus = "";
  }

  const handleCancel = () => {
    setShowWalletModal(false);
    setAddress({ value: undefined, valid: undefined });
  };

  useEffect(() => {
    if (addressInput.current) {
      addressInput.current.focus();
    }
  }, [visible]);
  const link = generateLink(
    1e4,
    { id, change_interest_recipient: 1, interest_recipient: address.value },
    activeWallet,
    deposit_aa
  );
  return (
    <Modal
      visible={visible}
      title="Edit recipient"
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
            disabled={!address.valid}
            href={link}
            onClick={() =>
              setTimeout(() => {
                handleCancel();
              }, 100)
            }
          >
            Edit
          </Button>
        </Space>
      }
    >
      <Form size="large">
        <Form.Item hasFeedback={true} validateStatus={validateStatus}>
          <Input
            placeholder="Address of the new interest recipient"
            value={address.value}
            onChange={handleChange}
            ref={addressInput}
            autoFocus={true}
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
