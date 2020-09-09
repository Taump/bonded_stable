import { CHANGE_ACTIVE } from "../../types";
import config from "../../../config";
import { addRecentStablecoin } from "../settings/addRecentStablecoin";
import { getOraclePrice } from "../../../helpers/getOraclePrice";
// export const changeActive = (address) => ({
//   type: CHANGE_ACTIVE,
//   payload: address,
// });

export const changeActive = (address) => async (dispatch, getState, socket) => {
  const store = getState();

  if (!store.list.loaded || !address) return null;
  if (!(address in store.list.data)) return null;
  const { params, deposit, governance } = store.list.data[address];
  const stableInfo = await socket.api.getAaStateVars({
    address,
  });

  const depositInfo = await socket.api.getAaStateVars({
    address: deposit,
  });

  const governanceInfo = await socket.api.getAaStateVars({
    address: governance,
  });

  let oracleValue1 = 0,
    oracleValue2 = 0,
    oracleValue3 = 0;

  await socket.justsaying("light/new_aa_to_watch", {
    aa: address,
  });

  await socket.justsaying("light/new_aa_to_watch", {
    aa: deposit,
  });

  await socket.justsaying("light/new_aa_to_watch", {
    aa: governance,
  });

  // if ("oracles" in stableInfo) {
  //   const { oracles } = stableInfo;

  //   if (oracles[0]) {
  //     oracleValue1 = await socket.api.getDataFeed({
  //       oracles: [oracles[0].oracle],
  //       feed_name: oracles[0].feed_name,
  //       ifnone: "none",
  //     });
  //   }
  //   if (oracles[1]) {
  //     oracleValue2 = await socket.api.getDataFeed({
  //       oracles: [oracles[1].oracle],
  //       feed_name: oracles[1].feed_name,
  //       ifnone: "none",
  //     });
  //   }
  //   if (oracles[2]) {
  //     oracleValue3 = await socket.api.getDataFeed({
  //       oracles: [oracles[2].oracle],
  //       feed_name: oracles[2].feed_name,
  //       ifnone: "none",
  //     });
  //   }
  // } else {
  //   if (params.oracle1) {
  //     oracleValue1 = await socket.api.getDataFeed({
  //       oracles: [params.oracle1],
  //       feed_name: params.feed_name1,
  //       ifnone: "none",
  //     });
  //   }
  //   if (params.oracle2) {
  //     oracleValue2 = await socket.api.getDataFeed({
  //       oracles: [params.oracle2],
  //       feed_name: params.feed_name2,
  //       ifnone: "none",
  //     });
  //   }
  //   if (params.oracle3) {
  //     oracleValue3 = await socket.api.getDataFeed({
  //       oracles: [params.oracle3],
  //       feed_name: params.feed_name3,
  //       ifnone: "none",
  //     });
  //   }
  // }
  const oraclePrice = await getOraclePrice(stableInfo, params);

  const oracleValueReserve = await socket.api.getDataFeed({
    oracles: [config.reserves[params.reserve_asset].oracle],
    feed_name: config.reserves[params.reserve_asset].feed_name,
    ifnone: "none",
  });

  const symbolByAsset1 = await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    stableInfo.asset1
  );

  const symbolByAsset2 = await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    stableInfo.asset2
  );

  const symbolByAsset3 = await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    depositInfo.asset
  );

  dispatch({
    type: CHANGE_ACTIVE,
    payload: {
      address,
      params,
      stable_state: stableInfo,
      deposit_state: depositInfo,
      governance_state: governanceInfo,
      oracleValue1: oracleValue1 !== "none" ? oracleValue1 : 0,
      oracleValue2: oracleValue2 !== "none" ? oracleValue2 : 0,
      oracleValue3: oracleValue3 !== "none" ? oracleValue3 : 0,
      deposit_aa: deposit,
      governance_aa: governance,
      oracleValueReserve,
      oraclePrice,
      symbol1:
        symbolByAsset1 !== stableInfo.asset1.replace(/[+=]/, "").substr(0, 6) &&
        symbolByAsset1,
      symbol2:
        symbolByAsset2 !== stableInfo.asset2.replace(/[+=]/, "").substr(0, 6) &&
        symbolByAsset2,
      symbol3:
        symbolByAsset3 !== depositInfo.asset.replace(/[+=]/, "").substr(0, 6) &&
        symbolByAsset3,
    },
  });

  dispatch(addRecentStablecoin(address));
};
