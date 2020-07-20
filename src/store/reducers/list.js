import { LOAD_LIST_SUCCESS, LOAD_LIST_REQUEST } from "../types";
const initialState = {
  data: {},
  loading: false,
  loaded: false,
};

export const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_LIST_REQUEST: {
      return {
        ...state,
        data: action.payload,
        loading: true,
        loaded: false,
      };
    }
    case LOAD_LIST_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
};
