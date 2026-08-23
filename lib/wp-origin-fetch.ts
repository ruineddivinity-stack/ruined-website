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
});

export function wpFetch(
  url: string,
  init?: Parameters<typeof undiciFetch>[1],
): ReturnType<typeof undiciFetch> {
  return undiciFetch(url, { ...init, dispatcher: originAgent });
}
