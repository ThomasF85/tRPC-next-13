import { NextResponse } from "next/server";
import {
  Connector,
  CreateServerApi,
  MutationType,
  ProtectedApiOptions,
  ProtectedMutationType,
  ProtectedQueryType,
  QueryType,
} from "./types";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./utils";

export function createProtected<
  Q extends { [key: string]: (ctx: any, ...args: any[]) => any },
  M extends { [key: string]: (ctx: any, ...args: any[]) => any }
>(
  options: ProtectedApiOptions<Q, M>
): [ProtectedQueryType<Q> & ProtectedMutationType<M>, CreateServerApi<Q>] {
  const { queries, mutations, url } = options;
  const serverApi = queries;
  const connector: Connector = getConnector<Q, M>(queries, mutations);
  const api: any = {};
  // TODOs: add args to fetcher and de-serialize correctly, add mutations, check if can be typed correctly
  for (const key in queries) {
    api[key] = {
      useQuery: (...args: any) =>
        useQuery({ queryFn: () => fetcher(`${url}/${key}`) }),
    };
  }

  return [
    api as ProtectedQueryType<Q> & ProtectedMutationType<M>,
    {} as CreateServerApi<Q>,
  ];
}
