import {
  LOAD_LIST_FAILURE,
  LOAD_LIST_REQUEST,
  LOAD_LIST_SUCCESS,
} from "../../types";
import config from "config";

export const getList = () => async (dispatch, getState, socket) => {
  const list = {};
  const getStablesParams = [];
  let data = {};

  dispatch({
    type: LOAD_LIST_REQUEST,
  });

  await socket.justsaying("light/new_aa_to_watch", {
    aa: config.FACTORY_AA,
  });

  try {
    data = await socket.api.getAaStateVars({
      address: config.FACTORY_AA,
    });
  } catch (e) {
    console.log("Error: ", e);
    return dispatch({
      type: LOAD_LIST_FAILURE,
    });
  }

  for (const row in data) {
    if (row.includes("governance_aa_")) {
      const address = row.split("_").slice(2)[0];
      list[address] = { ...list[address], governance: data[row] };
    } else if (row.includes("deposit_aa_")) {
      const address = row.split("_").slice(2)[0];
      list[address] = { ...list[address], deposit: data[row] };
    } else if (row.includes("curve_")) {
      const address = row.split("_").slice(1)[0];
      list[address] = { ...list[address], curve: data[row] };
    } else if (row.includes("asset_")) {
      const [address, type] = row.split("_").slice(1);
      list[address] = { ...list[address], ["asset_" + type]: data[row] };
    }
  }

  for (const address in list) {
    getStablesParams.push(
      socket.api
        .getDefinition(address)
        .then((result) => ({ address, params: result[1].params }))
    );
  }

  await Promise.all(getStablesParams).then((result) => {
    result.map(
      (res) =>
        (list[res.address] = { ...list[res.address], params: res.params })
    );
  });

  dispatch({
    type: LOAD_LIST_SUCCESS,
    payload: list,
  });
};
