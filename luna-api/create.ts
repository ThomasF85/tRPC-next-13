import { NextResponse } from "next/server";
import { ApiOptions, Connector, MutationType, QueryType } from "./types";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./utils";
import { getConnector } from "./connector";

export function create<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
>(options: ApiOptions<Q, M>): [QueryType<Q> & MutationType<M>, Q, Connector] {
  const { queries, mutations, url } = options;
  const serverApi = queries;
  const connector: Connector = getConnector<Q, M>(queries, mutations);
  const api: any = {};
  // TODOs: add args to fetcher and de-serialize correctly, add mutations, check if can be typed correctly
  for (const key in queries) {
    api[key] = {
      useQuery: (...args: any) =>
        useQuery({
          queryKey: [key, ...args],
          queryFn: () => fetcher(`${url}/${key}`),
        }),
    };
  }

  return [api as QueryType<Q> & MutationType<M>, serverApi, connector];
}
