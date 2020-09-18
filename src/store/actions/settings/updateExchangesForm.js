import { UPDATE_EXCHANGE_FORM } from "../../types";

export const updateExchangesForm = (payload) => {
  let newPayload;
  if (payload.currentCurrency === "gbyte") {
    newPayload = { ...payload, amountCurrency: undefined };
  } else {
    newPayload = { ...payload, amountToken: undefined };
  }
  return {
    type: UPDATE_EXCHANGE_FORM,
    payload: payload,
  };
};
