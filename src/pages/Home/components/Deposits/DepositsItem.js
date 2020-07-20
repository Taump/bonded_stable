import React from "react";
import { Card, Space, Button } from "antd";
import { generateLink } from "utils/generateLink";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";
export const DepositsItem = ({
  id,
  stable_amount,
  decimals,
  amount,
  growth_factor,
  interest_recipient,
  owner,
  activeWallet,
  deposit_aa,
  asset,
  setVisibleEditRecipient,
}) => {
  const new_stable_amount = Math.floor(amount * growth_factor);
  const interest = new_stable_amount - stable_amount;
  const closeUrl = generateLink(
    stable_amount,
    { id },
    activeWallet,
    deposit_aa,
    encodeURIComponent(asset)
  );
  const receiveUrl = generateLink(1e4, { id }, activeWallet, deposit_aa);

  return (
    <Card style={{ marginBottom: 10, wordBreak: "break-all" }}>
      <div>
        <b>ID:</b> {id}
      </div>
      <div>
        <b>Stable:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={stable_amount} />
      </div>
      <div>
        <b>Interest:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={interest} />
      </div>
      <div>
        <b>Interest recipient:</b> {interest_recipient || owner}
      </div>
      <Space size={10} align="center" style={{ marginTop: 10 }}>
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
          onClick={() => setVisibleEditRecipient(id)}
        >
          Edit recipient
        </Button>
        <Button type="link" size="small" href={closeUrl}>
          Close
        </Button>
      </Space>
    </Card>
  );
};
