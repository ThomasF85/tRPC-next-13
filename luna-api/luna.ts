import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";

interface ApiOptions<Q, M, C> {
  url: string;
  createContext?: (req: Request) => C | Promise<C>;
  queries: (ctx: C) => Q;
  mutations: (ctx: C) => M;
}

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

type UseQuery<T extends (...args: any[]) => any> = {
  useQuery: (...args: Parameters<T>) => UseQueryResult<Awaited<ReturnType<T>>>;
};

type QueryType<T extends { [key: string]: (...args: any[]) => any }> = {
  [P in keyof T]: UseQuery<T[P]>;
};

type UseMutation<T extends (...args: any[]) => any> = {
  useMutation: (
    options?: UseMutationOptions<Awaited<ReturnType<T>>>
  ) => UseMutationResult<Awaited<ReturnType<T>>>;
};

type MutationType<T extends { [key: string]: (...args: any[]) => any }> = {
  [P in keyof T]: UseMutation<T[P]>;
};

export function create<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any },
  C
>(options: ApiOptions<Q, M, C>): [QueryType<Q> & MutationType<M>, Q & M, any] {
  return [42 as QueryType<Q> & MutationType<M>, {} as Q & M, 43 as any];
}
