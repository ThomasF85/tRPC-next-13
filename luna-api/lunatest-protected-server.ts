import { cookies } from "next/headers";
import { createServerApi } from "./lunatest-protected";

export const [protectedServerApi, protectedConnector] = createServerApi(() => {
  cookies();
  return {
    a: 42,
  };
});
