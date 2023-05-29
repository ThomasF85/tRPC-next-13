"use client";

import { AppRouter } from "@/trpc/server/routers/app";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
