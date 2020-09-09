import { openNotification } from "utils/openNotification";

export const governatesEventManager = ({
  isReq,
  payload,
  isAuthor,
  governance_state,
}) => {
  if (isReq) {
    if ("commit" in payload && "name" in payload) {
      const leader = governance_state["leader_" + payload.name];
      if (leader) {
        if (isAuthor) {
          openNotification(
            `You sent a request to commit a new value of ${payload.name}: ${leader}`
          );
        } else {
          openNotification(
            `Another user sent a request to commit the new value of ${payload.name}: ${leader}`
          );
        }
      }
    } else if ("name" in payload && "value" in payload) {
      if (isAuthor) {
        openNotification(
          `You have sent a request to add support for the  ${payload.name} value of ${payload.value}`
        );
      } else {
        openNotification(
          `Another user sent a request to add support for the ${payload.name} value of ${payload.value}`
        );
      }
    } else if ("withdraw" in payload) {
      if (isAuthor) {
        openNotification(
          "You have sent a request to withdraw your balance from governance"
        );
      } else {
        openNotification(
          "Another user sent a request to withdraw their balance from governance"
        );
      }
    }
  }
};
