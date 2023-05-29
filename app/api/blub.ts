import { cookies } from "next/headers";

export const dingens = {
  funcA: () => 42,
  funcB: () => JSON.stringify(cookies()),
};
