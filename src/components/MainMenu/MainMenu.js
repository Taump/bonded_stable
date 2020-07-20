import React from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

export const MainMenu = ({ mode, pathname }) => {
  return (
    <Menu
      mode={mode === "horizontal" ? "horizontal" : "vertical"}
      breakpoint="lg"
      collapsedWidth="0"
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/">
        <NavLink to="/" activeClassName="selected">
          Home
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/create">
        <NavLink to="/create" activeClassName="selected">
          Create
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/settings">
        <NavLink to="/settings" activeClassName="selected">
          Settings
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};
