import { ApiOptions, Connector } from "./types";
import { getConnector } from "./connector";

export function create<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
>(
  options: ApiOptions<Q, M>
): [Q & M & { queries: Q; mutations: M }, Connector] {
  const { queries, mutations } = options;
  // todo: fix serverApi to match type
  const serverApi = queries;
  const connector: Connector = getConnector<Q, M>(queries, mutations);

  return [serverApi as Q & M & { queries: Q; mutations: M }, connector];
}
