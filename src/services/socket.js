import obyte from "obyte";
import config from "config";
import { store } from "index";
import {
  openConnection,
  closeConnection,
} from "store/actions/connection/connection";
import { getList } from "store/actions/list/getList";

const client = new obyte.Client(
  `wss://obyte.org/bb${config.TESTNET ? "-test" : ""}`,
  {
    testnet: config.TESTNET,
    reconnect: true,
  }
);

client.onConnect(() => {
  store.dispatch(openConnection());

  store.dispatch(getList());

  const heartbeat = setInterval(function () {
    client.api.heartbeat();
  }, 10 * 1000);

  client.client.ws.addEventListener("close", () => {
    store.dispatch(closeConnection());
    clearInterval(heartbeat);
  });
});

export default client;
