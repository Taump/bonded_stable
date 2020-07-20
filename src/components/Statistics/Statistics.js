import React from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";
import { Label } from "components/Label/Label";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";
import styles from "./Statistics.module.css";

export const Statistics = ({ windowWidth }) => {
  const { address, stable_state, params } = useSelector(
    (state) => state.active
  );
  const { supply1, supply2 } = stable_state;
  const { decimals1, decimals2 } = params;

  if (!address || windowWidth < 576) return null;
  const statisticsData = [
    {
      title: "Count of tokens1",
      descr: "lorem impsum",
      value: supply1 || 0,
      decimals: decimals1,
    },
    {
      title: "Count of tokens2",
      descr: "lorem impsum",
      value: supply2 || 0,
      decimals: decimals2,
    },
    {
      title: "Count of stable tokens",
      descr: "lorem impsum",
      value: 0,
      decimals: decimals2,
    },
    {
      title: "Current price",
      descr: "lorem impsum",
      value: "p2" in stable_state ? stable_state.p2 : 0,
    },
  ];

  return (
    <div
      style={{
        marginBottom: 20,
        background: "#fff",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <Row justify="space-between" style={{ marginBottom: -15 }}>
        {statisticsData.map((s) => (
          <Col
            xs={{ span: 20, offset: 4 }}
            sm={{ span: 10, offset: 2 }}
            lg={{ span: 6, offset: 0 }}
            style={{ marginBottom: 15 }}
          >
            <div className={styles.statisticsItem}>
              <div>
                <Label label={s.title} descr={s.descr} />
                <div style={{ marginTop: 3 }}>
                  <b style={{ fontSize: 18 }}>
                    {s.decimals ? (
                      <ShowDecimalsValue
                        value={Number(s.value)}
                        decimals={s.decimals}
                      />
                    ) : (
                      Number(s.value).toFixed(9)
                    )}
                  </b>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};
