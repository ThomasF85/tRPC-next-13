import { NextRequest, NextResponse } from "next/server";
import { Connector } from "./types";
import { decodeArguments } from "./argumentsEncoder";

export function getConnector<
  Q extends { [key: string]: (...args: any[]) => any },
  M extends { [key: string]: (...args: any[]) => any }
>(queries: Q, mutations: M, getContext?: () => any): Connector {
  return {
    GET: async (
      request: NextRequest,
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
      const args: any[] = decodeArguments(
        request.nextUrl.searchParams.get("arguments")
      );
      const result = getContext
        ? await query(getContext(), ...args)
        : await query(...args);
      return NextResponse.json(result);
    },
    POST: async (
      request: NextRequest,
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
      const args: any[] = await request.json();
      const result = getContext
        ? await mutation(getContext(), ...args)
        : await mutation(...args);
      return NextResponse.json(result);
    },
  };
}
