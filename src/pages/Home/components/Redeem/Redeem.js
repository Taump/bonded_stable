import React, { useState } from "react";
import { Form, Typography } from "antd";
import { useSelector } from "react-redux";
import { RedeemToken } from "./forms/RedeemToken";
const { Title } = Typography;

export const Redeem = () => {
  const { address, params, stable_state } = useSelector(
    (state) => state.active
  );
  const { activeWallet } = useSelector((state) => state.settings);
  const [tokens, setTokens] = useState([]);
  const tokens1Field = tokens.find((t) => t.name[0] === "r_tokens1");
  const tokens2Field = tokens.find((t) => t.name[0] === "r_tokens2");
  const tokens1 = tokens1Field ? tokens1Field.value : 0;
  const tokens2 = tokens2Field ? tokens2Field.value : 0;

  return (
    <>
      <Title level={3} type="secondary">
        Redemption stablecoins
      </Title>
      <RedeemToken
        address={address}
        tokens={tokens1}
        setTokens={setTokens}
        asset={stable_state.asset1}
        activeWallet={activeWallet}
        decimals={params.decimals1}
        reserve_asset_decimals={params.reserve_asset_decimals}
        key={1}
      />
      <RedeemToken
        address={address}
        tokens={tokens2}
        setTokens={setTokens}
        asset={stable_state.asset2}
        activeWallet={activeWallet}
        decimals={params.decimals2}
        reserve_asset_decimals={params.reserve_asset_decimals}
        key={2}
      />
    </>
  );
};
