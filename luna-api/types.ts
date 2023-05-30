import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { NextRequest } from "next/server";

export interface Connector {
  GET: (
    request: NextRequest,
    params: {
      params: { method: string };
    }
  ) => Promise<Response>;
  POST: (
    request: NextRequest,
    params: {
      params: { method: string };
    }
  ) => Promise<Response>;
}

export interface CreateServerApi<
  Q extends { [key: string]: (ctx: any, ...args: any[]) => any }
> {
  (getContext: () => any): [
    serverApi: {
      [P in keyof Q]: OmitFirstArg<Q[P]>;
    },
    connector: Connector
  ];
}

export interface ProtectedApiOptions<
  Q extends { [key: string]: (ctx: any, ...args: any[]) => any },
  M extends { [key: string]: (ctx: any, ...args: any[]) => any }
> {
  url: string;
  queries: Q;
  mutations: M;
}

export interface ApiOptions<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
> {
  queries: Q;
  mutations: M;
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

type UseQuery<T extends (...args: any[]) => any> = {
  useQuery: (...args: Parameters<T>) => UseQueryResult<Awaited<ReturnType<T>>>;
};

export type QueryType<T extends { [key: string]: (...args: any[]) => any }> = {
  [P in keyof T]: UseQuery<T[P]>;
};

export type ProtectedQueryType<
  T extends { [key: string]: (...args: any[]) => any }
> = {
  [P in keyof T]: UseQuery<OmitFirstArg<T[P]>>;
};

type ApiUseMutationOptions<T extends (...args: any[]) => any> = Omit<
  UseMutationOptions<Awaited<ReturnType<T>>, unknown, Parameters<T>>,
  "mutationFn" | "mutationKey" | "variables"
>;
type UseMutation<T extends (...args: any[]) => any> = {
  useMutation: (
    options?: ApiUseMutationOptions<T>
    // TODO: handle mutateAsync
  ) => Omit<UseMutationResult<Awaited<ReturnType<T>>>, "mutate"> & {
    mutate: (...args: Parameters<T>) => void;
  };
};

export type MutationType<T extends { [key: string]: (...args: any[]) => any }> =
  {
    [P in keyof T]: UseMutation<T[P]>;
  };

export type ProtectedMutationType<
  T extends { [key: string]: (...args: any[]) => any }
> = {
  [P in keyof T]: UseMutation<OmitFirstArg<T[P]>>;
};

export type ClientApiType<
  T extends {
    queries: { [key: string]: (...args: any[]) => any };
    mutations: { [key: string]: (...args: any[]) => any };
  }
> = QueryType<T["queries"]> & MutationType<T["mutations"]>;
