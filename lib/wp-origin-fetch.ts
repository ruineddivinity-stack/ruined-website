import "server-only";
import dns from "node:dns";
import { Agent, fetch as undiciFetch } from "undici";

/**
 * WordPress.com's Atomic hosting force-redirects any request whose Host
 * doesn't match the site's "primary site address" — including this app's
 * own production domain once it's pointed at Vercel instead of WordPress.
 * Resolving through the separately-connected `wp.` subdomain (while still
 * presenting the real hostname for the TLS SNI/Host header, so WordPress
 * doesn't redirect) reaches WordPress directly, the same way `curl --resolve`
 * would. Node's global fetch won't accept a dispatcher from a separately
 * imported undici instance, so this uses undici's own fetch throughout.
 */
const PINNED_HOST = "ruinedrx.com";
const RESOLVE_VIA = "wp.ruinedrx.com";

const originAgent = new Agent({
  connect: {
    lookup: ((hostname: string, options: dns.LookupAllOptions, callback: unknown) => {
      const target = hostname === PINNED_HOST ? RESOLVE_VIA : hostname;
      dns.lookup(
        target,
        { ...options, all: true },
        callback as (err: NodeJS.ErrnoException | null, addresses: dns.LookupAddress[]) => void,
      );
    }) as never,
  },
  // This dispatcher is a module-level singleton reused across every wpFetch
  // call — including across warm serverless invocations on Vercel. HTTP/1.1
  // pipelining (undici's default) can misalign a kept-alive connection under
  // bursty/irregular traffic, causing one request to receive a response (or
  // have its own body processed) as if it were a different one. Disabling
  // it trades a little connection reuse efficiency for never getting a
  // response that doesn't belong to the request that asked for it.
  pipelining: 0,
});

export function wpFetch(
  url: string,
  init?: Parameters<typeof undiciFetch>[1],
): ReturnType<typeof undiciFetch> {
  return undiciFetch(url, { ...init, dispatcher: originAgent });
}
