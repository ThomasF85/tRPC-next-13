"use client";

import { createClient } from "@/luna-api/createClient";
import { ProtectedAPI } from "./protectedApi";

export const protectedApi = createClient<ProtectedAPI>(
  "http://localhost:3000/api/protected"
);
