import { revalidateTag } from "next/cache";
import { PROJECTS_TAG } from "@/lib/getProjects";

/**
 * Webhook the Google Sheet calls on every save, so edits appear without waiting
 * out the 60s cache window. The Apps Script that calls this lives in
 * `docs/sheets-trigger.gs`.
 *
 * Guarded by a shared secret: without it, anyone could hammer the endpoint and
 * force repeated Sheets API calls.
 */
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    console.warn("REVALIDATE_SECRET is not set — refusing to revalidate.");
    return Response.json({ revalidated: false, reason: "not configured" }, { status: 500 });
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret");

  if (provided !== expected) {
    return Response.json({ revalidated: false, reason: "bad secret" }, { status: 401 });
  }

  // "max" marks the tag stale and refetches in the background on the next visit.
  revalidateTag(PROJECTS_TAG, "max");

  return Response.json({ revalidated: true, tag: PROJECTS_TAG, at: Date.now() });
}
