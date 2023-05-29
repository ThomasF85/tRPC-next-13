import { cookies } from "next/headers";
import { createServerApi } from "./protectedApi";

export const [protectedServerApi, protectedConnector] = createServerApi(() => {
  cookies();
  console.log("Checked for logged in user");
  return {
    id: "1337",
    text: "Todo injected from context",
    completed: true,
  };
});
