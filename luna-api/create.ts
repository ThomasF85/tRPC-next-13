import {
  ApiOptions,
  Connector,
  OmitFirstArguments,
  ProtectedApiOptions,
} from "./types";
import { getConnector } from "./connector";

export function create<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
>(
  options: ApiOptions<Q, M>
): [Q & M & { queries: Q; mutations: M }, Connector] {
  const { queries, mutations } = options;
  const serverApi = {
    ...queries,
    ...mutations,
    queries: { ...queries },
    mutations: { ...mutations },
  };
  const connector: Connector = getConnector<Q, M>(queries, mutations);

  return [serverApi, connector];
}

export function createProtected<
  C,
  Q extends { [key: string]: (ctx: C, ...args: any[]) => any },
  M extends { [key: string]: (ctx: C, ...args: any[]) => any }
>(
  options: ProtectedApiOptions<C, Q, M>
): [
  OmitFirstArguments<Q> &
    OmitFirstArguments<M> & {
      queries: OmitFirstArguments<Q>;
      mutations: OmitFirstArguments<M>;
    },
  Connector
] {
  const { queries, mutations, getContext, middleware } = options;
  const queriesWithContext: any = {};
  const mutationsWithContext: any = {};
  if (middleware) {
    for (const query in queries) {
      queriesWithContext[query] = async (...args: any[]) =>
        await middleware(await getContext(), queries[query], ...args);
    }
    for (const mutation in mutations) {
      mutationsWithContext[mutation] = async (...args: any[]) =>
        await middleware(await getContext(), mutations[mutation], ...args);
    }
  } else {
    for (const query in queries) {
      queriesWithContext[query] = async (...args: any[]) =>
        await queries[query](await getContext(), ...args);
    }
    for (const mutation in mutations) {
      mutationsWithContext[mutation] = async (...args: any[]) =>
        await mutations[mutation](await getContext(), ...args);
    }
  }

  const serverApi = {
    ...queriesWithContext,
    ...mutationsWithContext,
    queries: { ...queriesWithContext },
    mutations: { ...mutationsWithContext },
  };
  const connector: Connector = getConnector<Q, M>(
    queries,
    mutations,
    getContext,
    middleware
  );

  return [
    serverApi as OmitFirstArguments<Q> &
      OmitFirstArguments<M> & {
        queries: OmitFirstArguments<Q>;
        mutations: OmitFirstArguments<M>;
      },
    connector,
  ];
}
