"use client";

import { createClient } from "@/luna-api/createClient";
import { API } from "./api";

export const api = createClient<API>("http://localhost:3000/api");
