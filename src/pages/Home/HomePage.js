import React from "react";
import { Tabs, Typography, Col, Row } from "antd";
import { MainLayout } from "components/MainLayout/MainLayout";
import {
  SettingOutlined,
  InteractionOutlined,
  ImportOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Issue } from "./components/Issue/Issue";
import { Redeem } from "./components/Redeem/Redeem";
import { Deposits } from "./components/Deposits/Deposits";
const { Title } = Typography;
const { TabPane } = Tabs;
export const HomePage = () => {
  const { address, stable_state } = useSelector((state) => state.active);
  return (
    <MainLayout>
      {address ? (
        <>
          <Title level={2}>Home</Title>
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane
              tab={
                <span>
                  <InteractionOutlined /> Issue/redeem
                </span>
              }
              key="1"
            >
              {"reserve" in stable_state ? (
                <Row style={{ marginTop: 20 }}>
                  <Col md={{ span: 10 }} xs={{ span: 24 }}>
                    <Issue />
                  </Col>
                  <Col md={{ span: 10, offset: 4 }} xs={{ span: 24 }}>
                    <Redeem />
                  </Col>
                </Row>
              ) : (
                <Row style={{ marginTop: 20 }}>
                  <Col span={18}>
                    <Issue />
                  </Col>
                </Row>
              )}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <LineChartOutlined />
                  Capacitors
                </span>
              }
              key="2"
            >
              Content of Tab Pane 2
            </TabPane>

            <TabPane
              tab={
                <span>
                  <ImportOutlined /> Deposits
                </span>
              }
              key="4"
            >
              <Deposits />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SettingOutlined />
                  Governance
                </span>
              }
              key="3"
            >
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </>
      ) : (
        <p>
          Информация, которая показывается, когда не выбран активный ск.
          Возможно здесь нужно будет описать варианты использования, как делали
          это в обычных ск
        </p>
      )}
    </MainLayout>
  );
};
