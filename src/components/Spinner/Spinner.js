import React from "react";
import { Spin } from "antd";
import styles from "./Spinner.module.css";

export const Spinner = () => (
  <div className={styles.Spinner}>
    <Spin size="large" />
  </div>
);
