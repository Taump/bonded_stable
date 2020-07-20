import React, { useState } from "react";

import { Layout, Drawer, Row, Statistic, Button } from "antd";
import { NavLink, Route, useLocation } from "react-router-dom";
import { SelectStablecoin } from "../SelectStablecoin/SelectStablecoin";
import { useWindowSize } from "hooks/useWindowSize";
import styles from "./MainLayout.module.css";
import { Statistics } from "../Statistics/Statistics";
import { MainMenu } from "../MainMenu/MainMenu";
const { Header, Content } = Layout;

export const MainLayout = (props) => {
  const { pathname } = useLocation();
  const [width] = useWindowSize();
  const [activeMenu, setActiveMenu] = useState(false);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff" }}>
        <Row justify={width < 576 ? "space-between" : undefined} align="middle">
          <NavLink
            to="/"
            style={{
              color: "rgba(0, 0, 0, 0.85)",
              paddingRight: 20,
              fontWeight: "bold",
            }}
          >
            Bonded stable <sup style={{ fontSize: 10 }}>Beta</sup>
          </NavLink>

          {width >= 576 ? (
            <MainMenu pathname={pathname} mode="horizontal" />
          ) : (
            <>
              <Button onClick={() => setActiveMenu(true)}>Menu</Button>
              <Drawer
                title={
                  <span>
                    Bonded stable <sup style={{ fontSize: 10 }}>Beta</sup>
                  </span>
                }
                placement="left"
                closable={true}
                onClose={() => setActiveMenu(false)}
                visible={activeMenu}
                bodyStyle={{ padding: 0 }}
              >
                <MainMenu pathname={pathname} mode="vertical" />
              </Drawer>
            </>
          )}
        </Row>
      </Header>

      <Content className={styles.content}>
        <Route path="/" exact>
          <SelectStablecoin />
        </Route>
        <Route path="/" exact>
          <Statistics windowWidth={width} />
        </Route>
        <div style={{ background: "#fff", padding: 20 }}>{props.children}</div>
      </Content>
    </Layout>
  );
};
