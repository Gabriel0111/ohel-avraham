import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

export type HostData = NonNullable<
  FunctionReturnType<typeof api.hosts.getAllHosts>
>[number];

export type GuestData = NonNullable<
  FunctionReturnType<typeof api.guests.getAllGuests>
>[number];
