import React, { useState } from "react";
import { Button, Typography, Col, Row, Form, Select, Switch } from "antd";
import { MainLayout } from "components/MainLayout/MainLayout";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { AddWalletAddressModal } from "modals/AddWalletAddressModal/AddWalletAddressModal";
import { changeActiveWallet } from "../../store/actions/settings/changeActiveWallet";
const { Title } = Typography;
const { Option } = Select;
export const SettingsPage = () => {
  const dispatch = useDispatch();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { wallets, activeWallet } = useSelector((state) => state.settings);
  return (
    <MainLayout>
      <Title level={2}>Settings</Title>

      <Form size="large">
        <Form.Item>
          <Title level={4} type="secondary">
            Select and add wallet
          </Title>
          <Row>
            <Col span={16}>
              <Select
                placeholder="Select an address"
                value={activeWallet}
                optionFilterProp="children"
                onChange={(address) => {
                  if (typeof address === "string") {
                    dispatch(changeActiveWallet(address));
                  }
                }}
              >
                {wallets.map((address) => (
                  <Option value={address}>{address}</Option>
                ))}
              </Select>
            </Col>
            <Col push={1}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowWalletModal(true)}
              >
                Add
              </Button>
            </Col>
          </Row>
        </Form.Item>
        {/* <Title level={4} type="secondary">
          Interface customization
        </Title>
        <Form.Item label="Show statistics panel on the main page">
          <Switch />
        </Form.Item> */}
      </Form>

      <AddWalletAddressModal
        visible={showWalletModal}
        setShowWalletModal={setShowWalletModal}
      />
    </MainLayout>
  );
};
