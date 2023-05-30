import { useMutation, useQuery } from "@tanstack/react-query";
import { ClientApiType } from "./types";
import { fetcher, getPostFunction } from "./utils";
import { encodeArguments } from "./argumentsEncoder";
import { useMemo } from "react";

export function createClient<
  T extends {
    queries: { [key: string]: (...args: any[]) => any };
    mutations: { [key: string]: (...args: any[]) => any };
  }
>(url: string): ClientApiType<T> {
  const handler = {
    get(target: any, prop: string) {
      // todo: check what to do about $$typeof and prototype
      if (prop === "$$typeof") {
        return undefined;
      }
      if (target.hasOwnProperty(prop)) {
        return target[prop];
      }
      const baseURI: string = `${url}${url.endsWith("/") ? "" : "/"}${prop}`;
      const postFunction: (args: any[]) => Promise<any> =
        getPostFunction(baseURI);
      const mutationKey = [prop];
      target[prop] = {
        useQuery: (...args: any) => {
          // Todo: Check if caching encodedArgs (using deep equality) makes sense here
          const encodedArgs = encodeArguments(args);
          const uri =
            args.length === 0 ? baseURI : `${baseURI}?arguments=${encodedArgs}`;
          return useQuery({
            queryKey: [prop, encodedArgs],
            queryFn: () => fetcher(uri),
          });
        },
        useMutation: (options: any = {}) => {
          const mutationResult = useMutation({
            ...options,
            mutationKey,
            mutationFn: postFunction,
          });

          const mutate = useMemo(() => {
            return (...args: any[]) => mutationResult.mutate(args as any);
          }, [mutationResult.mutate]);

          return {
            ...mutationResult,
            mutate,
          };
        },
      };
      return target[prop];
    },
  };

  return new Proxy({}, handler) as ClientApiType<T>;
}
