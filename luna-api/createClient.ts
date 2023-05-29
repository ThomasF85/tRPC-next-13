import { useQuery } from "@tanstack/react-query";
import { ClientApiType } from "./types";
import { fetcher } from "./utils";

export function createClient<
  T extends {
    queries: { [key: string]: (...args: any[]) => any };
    mutations: { [key: string]: (...args: any[]) => any };
  }
>(url: string): ClientApiType<T> {
  // TODOs: add args to fetcher and de-serialize correctly, add mutations
  const handler = {
    get(target: any, prop: string) {
      // todo: check what to do about $$typeof and prototype
      if (prop === "$$typeof") {
        return undefined;
      }
      if (target.hasOwnProperty(prop)) {
        return target[prop];
      }
      target[prop] = {
        useQuery: (...args: any) =>
          useQuery({
            queryKey: [prop, ...args],
            queryFn: () => fetcher(`${url}/${prop}`),
          }),
      };
      return target[prop];
    },
  };

  return new Proxy({}, handler) as ClientApiType<T>;
}
