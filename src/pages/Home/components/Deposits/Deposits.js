import React, { useState } from "react";
import { Table, Button, Space, Tooltip, List, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { generateLink } from "utils/generateLink";
import { $get_growth_factor } from "helpers/bonded.js";
import { EditRecipient } from "modals/EditRecipient";
import { OpenDepositModal } from "modals/OpenDepositModal/OpenDepositModal";
import { useWindowSize } from "hooks/useWindowSize";
import { DepositsItem } from "./DepositsItem";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";

const { Title } = Typography;

export const Deposits = () => {
  const [width] = useWindowSize();
  const [visibleEditRecipient, setVisibleEditRecipient] = useState(false);
  const [visibleOpenDeposit, setVisibleOpenDeposit] = useState(false);
  const { deposit_state, params, deposit_aa, stable_state } = useSelector(
    (state) => state.active
  );
  const { activeWallet } = useSelector((state) => state.settings);
  const growth_factor = $get_growth_factor(
    params.interest_rate,
    Math.floor(Date.now() / 1000),
    stable_state.rate_update_ts,
    stable_state.growth_factor
  );
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value) => {
        return (
          <Tooltip title={value}>
            <span>{value.substr(0, 5)}</span>
          </Tooltip>
        );
      },
      width: "10%",
    },
    {
      title: "Stable",
      dataIndex: "stable_amount",
      key: "stable",
      width: "15%",
      render: (value) => {
        return <ShowDecimalsValue decimals={params.decimals2} value={value} />;
      },
    },

    {
      title: "Interest",
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      render: (value, records) => {
        const new_stable_amount = Math.floor(records.amount * growth_factor);
        const interest = new_stable_amount - records.stable_amount;
        return (
          <ShowDecimalsValue decimals={params.decimals2} value={interest} />
        );
      },
    },
    {
      title: "Interest recipient",
      dataIndex: "interest_recipient",
      render: (value, records) => {
        return value || records.owner;
      },
    },
    {
      witdh: "30%",
      render: (_, records) => {
        const new_stable_amount = Math.floor(records.amount * growth_factor);
        const interest = new_stable_amount - records.stable_amount;
        const closeUrl = generateLink(
          records.stable_amount,
          { id: records.id },
          activeWallet,
          deposit_aa,
          encodeURIComponent(deposit_state.asset)
        );
        const receiveUrl = generateLink(
          1e4,
          { id: records.id },
          activeWallet,
          deposit_aa
        );
        return (
          <Space size={10} align="center">
            <Button
              type="link"
              size="small"
              href={receiveUrl}
              disabled={interest <= 0}
            >
              Get interest
            </Button>
            <Button
              type="link"
              size="small"
              disabled={records.owner !== activeWallet}
              onClick={() => setVisibleEditRecipient(records.id)}
            >
              Edit recipient
            </Button>
            <Button
              type="link"
              size="small"
              href={closeUrl}
              disabled={records.owner !== activeWallet}
            >
              Close
            </Button>
          </Space>
        );
      },
    },
  ];
  const deposits = {};
  for (let row in deposit_state) {
    if (row.split("_").length > 2) {
      const [_, id, ...arrayType] = row.split("_");
      const type = arrayType.join("_");
      const value = deposit_state[row];
      deposits[id] = { ...deposits[id], [type]: value };
    }
  }
  const source = [];
  for (let row in deposits) {
    if (
      deposits[row].owner === activeWallet ||
      deposits[row].interest_recipient === activeWallet
    ) {
      source.push({ id: row, ...deposits[row], key: row });
    }
  }
  const localeForEmpty = (
    <span>
      You don't have any open deposits, please{" "}
      <Button
        type="link"
        style={{ padding: 0 }}
        onClick={() => setVisibleOpenDeposit(true)}
      >
        open a new
      </Button>{" "}
      or{" "}
      <Link to="/settings">
        <Button type="link" style={{ padding: 0 }}>
          change your wallet address
        </Button>
      </Link>
    </span>
  );
  if (!activeWallet) {
    return (
      <div style={{ textAlign: "center" }}>
        <Link to="/settings">
          Please add the address of your wallet in order to start
        </Link>
      </div>
    );
  }
  return (
    <>
      {width > 1200 ? (
        <Table
          dataSource={source}
          columns={columns}
          locale={{
            emptyText: localeForEmpty,
          }}
          pagination={{ pageSize: 20, hideOnSinglePage: true }}
          title={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Title level={3} type="secondary">
                Deposits
              </Title>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setVisibleOpenDeposit(true)}
              >
                Open deposit
              </Button>
            </div>
          )}
        />
      ) : (
        <List
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          header={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Title level={3} type="secondary">
                Deposits
              </Title>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setVisibleOpenDeposit(true)}
              >
                Open deposit
              </Button>
            </div>
          }
          bordered={false}
          dataSource={source}
          locale={{
            emptyText: localeForEmpty,
          }}
          renderItem={(item) => (
            <DepositsItem
              {...item}
              decimals={params.decimals2}
              growth_factor={growth_factor}
              activeWallet={activeWallet}
              deposit_aa={deposit_aa}
              asset={stable_state.asset2}
              setVisibleEditRecipient={setVisibleEditRecipient}
            />
          )}
        />
      )}
      <EditRecipient
        visible={!!visibleEditRecipient}
        id={visibleEditRecipient}
        setShowWalletModal={setVisibleEditRecipient}
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
      />
      <OpenDepositModal
        visible={visibleOpenDeposit}
        setVisible={setVisibleOpenDeposit}
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
        asset={stable_state.asset2}
        decimals={params.decimals2}
      />
    </>
  );
};
