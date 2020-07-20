import { ADD_WALLET, CHANGE_ACTIVE_WALLET } from "../types";
const initialState = {
  wallets: [],
  activeWallet: null,
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WALLET: {
      if (!state.wallets.find((w) => w === action.payload)) {
        return {
          ...state,
          wallets: [...state.wallets, action.payload],
          activeWallet: action.payload,
        };
      } else {
        return state;
      }
    }
    case CHANGE_ACTIVE_WALLET: {
      return {
        ...state,
        activeWallet: action.payload,
      };
    }
    default:
      return state;
  }
};
