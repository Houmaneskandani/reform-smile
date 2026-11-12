import "server-only";

/**
 * True only under `npm run dev:admin`: the website editor's local mode (no sign-in; Save
 * writes content/*.json on this computer). Used by ./layout.tsx and by its read/write API in
 * src/app/api/keystatic/[...params]/route.ts.
 *
 * NODE_ENV alone isn't enough: plain `npm run dev` (`next dev` without -H) listens on every
 * network interface, so anyone on the same Wi-Fi could use the API, which has no sign-in.
 * dev:admin listens on 127.0.0.1 only. npm (and pnpm, yarn, bun) set npm_lifecycle_event to
 * the name of the script being run, so this is an opt-in that only that script gives, on
 * every operating system and without an extra environment variable.
 */
export const LOCAL_EDITOR_ENABLED =
  process.env.NODE_ENV === "development" && process.env.npm_lifecycle_event === "dev:admin";
