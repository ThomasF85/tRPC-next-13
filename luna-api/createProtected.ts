import { NextResponse } from "next/server";
import {
  Connector,
  CreateServerApi,
  ProtectedApiOptions,
  ProtectedMutationType,
  ProtectedQueryType,
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
  const api: any = {};
  // TODOs: add args to fetcher and de-serialize correctly, add mutations, check if can be typed correctly
  for (const key in queries) {
    api[key] = {
      useQuery: (...args: any) =>
        useQuery({
          queryKey: ["protected", key, ...args],
          queryFn: () => fetcher(`${url}/${key}`),
        }),
    };
  }

  return [
    api as ProtectedQueryType<Q> & ProtectedMutationType<M>,
    getServerApiCreator(queries, mutations),
  ];
}

function getServerApiCreator<
  Q extends { [key: string]: (ctx: any, ...args: any[]) => any },
  M extends { [key: string]: (ctx: any, ...args: any[]) => any }
>(queries: Q, mutations: M): CreateServerApi<Q> {
  return (getContext: () => any) => {
    const connector: Connector = getConnector(queries, mutations, getContext);
    const serverApi: any = {};
    for (const key in queries) {
      serverApi[key] = (...args: any[]) => queries[key](getContext(), ...args);
    }
    return [serverApi, connector];
  };
}

function getConnector<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
>(queries: Q, mutations: M, getContext: () => any): Connector {
  return {
    GET: async (
      request: Request,
      params: {
        params: { method: string };
      }
    ): Promise<Response> => {
      const query = queries[params.params.method];
      if (!query) {
        return NextResponse.json(
          { message: "Query not found" },
          { status: 404 }
        );
      }
      const result = await query(getContext());
      return NextResponse.json(result);
    },
    POST: async (
      request: Request,
      params: {
        params: { method: string };
      }
    ): Promise<Response> => {
      const mutation = mutations[params.params.method];
      if (!mutation) {
        return NextResponse.json(
          { message: "Mutation not found" },
          { status: 404 }
        );
      }
      const result = await mutation(getContext());
      return NextResponse.json(result);
    },
  };
}
