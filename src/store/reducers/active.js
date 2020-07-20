import { CHANGE_ACTIVE } from "../types";
const initialState = {
  address: "",
  deposit_aa: "",
  params: {},
  stable_state: {},
  deposit_state: {},
  governance_state: {},
  oracleValue: 0,
};

export const activeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ACTIVE: {
      return {
        address: action.payload.address,
        params: action.payload.params,
        stable_state: action.payload.stable_state,
        deposit_state: action.payload.deposit_state,
        governance_state: action.payload.governance_state,
        oracleValue: action.payload.oracleValue,
        deposit_aa: action.payload.deposit_aa,
      };
    }
    default:
      return state;
  }
};
