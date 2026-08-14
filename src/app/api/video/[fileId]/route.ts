/**
 * Streams a public Drive file through our own origin.
 *
 * Why this exists: Drive's `/preview` iframe is cross-origin, so its player
 * chrome (pop-out button, centre control bar, bottom bar) cannot be restyled or
 * hidden. Serving the bytes ourselves lets the modal use a plain <video> with
 * controls we own.
 *
 * The API key stays on the server — it is never part of the URL the browser
 * sees. Range headers are forwarded both ways so seeking and scrubbing work.
 *
 * Requires, in Google Cloud Console for the same project as SHEETS_API_KEY:
 *   1. Google Drive API enabled, and
 *   2. the key's "API restrictions" list to include Google Drive API.
 * Missing either returns 403 and the modal falls back to the Drive iframe.
 */

import { getDriveAccessToken } from "@/lib/driveAuth";

/** Drive file ids are URL-safe base64-ish; reject anything else outright. */
const FILE_ID = /^[a-zA-Z0-9_-]{10,128}$/;

export async function GET(
  request: Request,
  context: RouteContext<"/api/video/[fileId]">,
) {
  const { fileId } = await context.params;

  if (!FILE_ID.test(fileId)) {
    return new Response("Invalid file id", { status: 400 });
  }

  // A service account token is required for media. An API key is accepted for
  // metadata but refused for bytes, so there is no usable key-only fallback.
  const token = await getDriveAccessToken();
  if (!token) {
    return new Response("Drive service account is not configured", { status: 500 });
  }

  const upstreamUrl =
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}` +
    `?alt=media`;

  const headersOut: Record<string, string> = { Authorization: `Bearer ${token}` };
  // Pass the browser's Range through so <video> can seek instead of buffering
  // the whole file before it plays.
  const range = request.headers.get("range");
  if (range) headersOut.Range = range;

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: headersOut,
      cache: "no-store",
    });
  } catch (error) {
    console.warn("Drive media request failed.", error);
    return new Response("Upstream request failed", { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    // 403 here usually means the key is not allowed to call the Drive API.
    console.warn(`Drive media responded ${upstream.status} for ${fileId}.`);
    return new Response("Video unavailable", { status: upstream.status });
  }

  const headers = new Headers();
  for (const header of [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
  ]) {
    const value = upstream.headers.get(header);
    if (value) headers.set(header, value);
  }
  if (!headers.has("accept-ranges")) headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=3600");

  return new Response(upstream.body, { status: upstream.status, headers });
}
