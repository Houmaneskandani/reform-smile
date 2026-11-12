import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";
import { LOCAL_EDITOR_ENABLED } from "@/app/keystatic/local-mode";

// API behind the website editor in local mode: it lists, reads and writes content/*.json on
// this computer and has NO sign-in (Keystatic 0.6.9). So it only answers under
// `npm run dev:admin` (see src/app/keystatic/local-mode.ts), which listens on 127.0.0.1 only,
// so it can't be reached from the network. Under plain `npm run dev`, which listens on every
// network interface, it is a 404. It also only answers requests addressed to this computer
// (127.0.0.1 / localhost), which blocks DNS rebinding from other websites in the browser.
//
// In production it always returns 404. Keystatic Cloud (the production editor) doesn't use it.

const keystatic = LOCAL_EDITOR_ENABLED ? makeRouteHandler({ config }) : null;

const LOCAL_HOSTNAMES = new Set(["127.0.0.1", "localhost", "[::1]"]);

/** The hostname from the Host header, without the port ("[::1]:3000" -> "[::1]"). */
function hostname(request: Request): string {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  if (host.startsWith("[")) return host.slice(0, host.indexOf("]") + 1);
  return host.split(":")[0];
}

function notFound(): Response {
  return new Response("Not Found", { status: 404 });
}

export async function GET(request: Request): Promise<Response> {
  if (!keystatic || !LOCAL_HOSTNAMES.has(hostname(request))) return notFound();
  return keystatic.GET(request);
}

export async function POST(request: Request): Promise<Response> {
  if (!keystatic || !LOCAL_HOSTNAMES.has(hostname(request))) return notFound();
  return keystatic.POST(request);
}
