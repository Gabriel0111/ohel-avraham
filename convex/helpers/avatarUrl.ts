/**
 * True when `url` is a Convex file-storage URL (i.e. an avatar we've already
 * ingested and now host ourselves), as opposed to an external provider URL
 * like Google's `lh3.googleusercontent.com` which rate-limits hotlinking.
 */
export function isConvexStorageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.convex\.(cloud|site)\/api\/storage\//.test(url);
}

/**
 * True when `url` is an external image we should copy into our own storage
 * (an absolute http(s) URL that isn't already Convex-hosted).
 */
export function isIngestibleImageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  return /^https?:\/\//.test(url) && !isConvexStorageUrl(url);
}
