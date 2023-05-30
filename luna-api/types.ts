import { NextRequest } from "next/server";
import { SWRConfiguration, SWRResponse } from "swr";
import { SWRMutationConfiguration, SWRMutationResponse } from "swr/mutation";

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

export interface ApiOptions<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
> {
  queries: Q;
  mutations: M;
}

export interface ProtectedApiOptions<
  C,
  Q extends { [key: string]: (ctx: C, ...args: any[]) => any },
  M extends { [key: string]: (ctx: C, ...args: any[]) => any }
> extends ApiOptions<Q, M> {
  getContext: () => Promise<C> | C;
  middleware?: (
    ctx: C,
    next: (ctx: C, ...args: any[]) => any,
    ...args: any[]
  ) => any;
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

export type OmitFirstArguments<
  T extends { [key: string]: (ctx: any, ...args: any[]) => any }
> = {
  [P in keyof T]: OmitFirstArg<T[P]>;
};

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

type UseQuery<T extends (...args: any[]) => any> = {
  useQuery: (...args: Parameters<T>) => SWRResponse<Awaited<ReturnType<T>>>;
  useQueryOptions: (
    options: Omit<SWRConfiguration<Awaited<ReturnType<T>>>, "fetcher">,
    ...args: Parameters<T>
  ) => SWRResponse<Awaited<ReturnType<T>>>;
};

export type QueryType<T extends { [key: string]: (...args: any[]) => any }> = {
  [P in keyof T]: UseQuery<T[P]>;
};

type UseMutation<T extends (...args: any[]) => any> = {
  useMutation: (
    options?: Omit<
      SWRMutationConfiguration<Awaited<ReturnType<T>>, unknown>,
      "fetcher"
    >
  ) => Omit<SWRMutationResponse<Awaited<ReturnType<T>>>, "trigger"> & {
    mutate: (...args: Parameters<T>) => void;
  };
};

export type MutationType<T extends { [key: string]: (...args: any[]) => any }> =
  {
    [P in keyof T]: UseMutation<T[P]>;
  };

export type ClientApiType<
  T extends {
    queries: { [key: string]: (...args: any[]) => any };
    mutations: { [key: string]: (...args: any[]) => any };
  }
> = QueryType<T["queries"]> & MutationType<T["mutations"]>;
