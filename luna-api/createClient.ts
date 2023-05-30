import { ClientApiType } from "./types";
import { fetcher, postFunction } from "./utils";
import { useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export function createClient<
  T extends {
    queries: { [key: string]: (...args: any[]) => any };
    mutations: { [key: string]: (...args: any[]) => any };
  }
>(path: string): ClientApiType<T> {
  const handler = {
    get(target: any, prop: string) {
      // todo: check what to do about $$typeof and prototype
      if (prop === "$$typeof") {
        return undefined;
      }
      if (target.hasOwnProperty(prop)) {
        return target[prop];
      }
      const basePath: string = `${path}${path.endsWith("/") ? "" : "/"}${prop}`;
      target[prop] = {
        useQuery: (...args: any) => useSWR([basePath, args], fetcher),
        useQueryOptions: (options: any, ...args: any) =>
          useSWR([basePath, args], fetcher, options),
        useMutation: (options?: any) => {
          const mutationResult: any = useSWRMutation(
            basePath,
            postFunction,
            options
          );

          mutationResult.mutate = useMemo(() => {
            return (...args: any[]) => mutationResult.trigger(args);
          }, [mutationResult.trigger]);

          return mutationResult;
        },
      };
      return target[prop];
    },
  };

  return new Proxy({}, handler) as ClientApiType<T>;
}
