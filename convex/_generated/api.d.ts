/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as dashboard from "../dashboard.js";
import type * as enums from "../enums.js";
import type * as guests from "../guests.js";
import type * as helpers_canAccessRole from "../helpers/canAccessRole.js";
import type * as hosts from "../hosts.js";
import type * as http from "../http.js";
import type * as users from "../users.js";
import type * as validators_guest from "../validators/guest.js";
import type * as validators_host from "../validators/host.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  dashboard: typeof dashboard;
  enums: typeof enums;
  guests: typeof guests;
  "helpers/canAccessRole": typeof helpers_canAccessRole;
  hosts: typeof hosts;
  http: typeof http;
  users: typeof users;
  "validators/guest": typeof validators_guest;
  "validators/host": typeof validators_host;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
