import {
  ADD_WALLET,
  CHANGE_ACTIVE_WALLET,
  CHANGE_ACTIVE,
  ADD_RECENT_STABLECOIN,
  ADD_EXCHANGE,
} from "../types";

const initialState = {
  wallets: [],
  activeWallet: null,
  recent: null,
  recentList: [],
  exchanges: [],
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
    case CHANGE_ACTIVE: {
      return {
        ...state,
        recent: action.payload.address,
      };
    }
    case ADD_RECENT_STABLECOIN: {
      const address = action.payload;
      let newRecentStablecoins = [...state.recentList];
      const findAaInRecent = newRecentStablecoins.findIndex(
        (aa) => aa === address
      );
      if (findAaInRecent === -1) {
        if (newRecentStablecoins && newRecentStablecoins.length >= 5) {
          newRecentStablecoins.pop();
        }
        newRecentStablecoins.unshift(address);
      } else {
        [newRecentStablecoins[0], newRecentStablecoins[findAaInRecent]] = [
          newRecentStablecoins[findAaInRecent],
          newRecentStablecoins[0],
        ];
      }
      return {
        ...state,
        recentList: newRecentStablecoins,
      };
    }
    case ADD_EXCHANGE: {
      return {
        ...state,
        exchanges: [...state.exchanges, action.payload],
      };
    }
    default:
      return state;
  }
};
