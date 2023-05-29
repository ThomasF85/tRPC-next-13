import { NextResponse } from "next/server";
import { Connector } from "./types";

export function getConnector<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
>(queries: Q, mutations: M, getContext?: () => any): Connector {
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
      const result = getContext ? await query(getContext()) : await query();
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
      const result = getContext
        ? await mutation(getContext())
        : await mutation();
      return NextResponse.json(result);
    },
  };
}
