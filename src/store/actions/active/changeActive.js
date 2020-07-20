import { CHANGE_ACTIVE } from "../../types";
// export const changeActive = (address) => ({
//   type: CHANGE_ACTIVE,
//   payload: address,
// });

export const changeActive = (address) => async (dispatch, getState, socket) => {
  const store = getState();
  console.log("test", store.list.data[address]);
  const { params, deposit, governance } = store.list.data[address];
  const stableInfo = await socket.api.getAaStateVars({
    address,
  });
  // console.log("stableInfo", stableInfo);
  // console.log("deposit", deposit);
  const depositInfo = await socket.api.getAaStateVars({
    address: deposit,
  });
  // console.log("depositInfo", depositInfo);
  const governanceInfo = await socket.api.getAaStateVars({
    address: governance,
  });
  // console.log("governanceInfo", governanceInfo, governance);
  const oracleValue = await socket.api.getDataFeed({
    oracles: [params.oracle],
    feed_name: params.feed_name,
    ifnone: "none",
  });

  dispatch({
    type: CHANGE_ACTIVE,
    payload: {
      address,
      params,
      stable_state: stableInfo,
      deposit_state: depositInfo,
      governance_state: governanceInfo,
      oracleValue: oracleValue !== "none" ? oracleValue : 0,
      deposit_aa: deposit,
    },
  });
};
