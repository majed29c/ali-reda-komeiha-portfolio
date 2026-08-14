import { createSign } from "node:crypto";

/**
 * Mints Drive access tokens from the service account.
 *
 * Drive hands file *metadata* to a plain API key but refuses the file *bytes*,
 * answering with an "automated queries" abuse page. Media needs a real OAuth
 * token, which is what this produces: a JWT signed with the service account's
 * private key, exchanged at Google's token endpoint for a bearer token scoped
 * to read-only Drive.
 *
 * The account only sees files that have been shared with its email — sharing
 * the folder in Drive is what grants access, not any IAM role.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

/** Tokens last an hour; hold one rather than signing a JWT per request. */
let cached: { token: string; expiresAt: number } | null = null;

function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.trim();
  if (!raw) return null;

  try {
    // Accept either raw JSON or base64 — base64 is what .env.local holds, since
    // the private key's newlines do not survive a plain env value.
    const json = raw.startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(json) as Partial<ServiceAccount>;

    if (!parsed.client_email || !parsed.private_key) {
      console.warn("Service account key is missing client_email or private_key.");
      return null;
    }
    return { client_email: parsed.client_email, private_key: parsed.private_key };
  } catch (error) {
    console.warn("Could not parse GOOGLE_SERVICE_ACCOUNT_KEY.", error);
    return null;
  }
}

const base64url = (value: string) => Buffer.from(value).toString("base64url");

/** Returns null when no service account is configured or the exchange fails. */
export async function getDriveAccessToken(): Promise<string | null> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const account = readServiceAccount();
  if (!account) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  // Escaped newlines survive some copy/paste routes into env vars; normalise.
  const signature = signer.sign(
    account.private_key.replace(/\\n/g, "\n"),
    "base64url",
  );

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${header}.${claims}.${signature}`,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`Drive token exchange failed: ${res.status} ${await res.text()}`);
      return null;
    }

    const data = (await res.json()) as { access_token: string; expires_in: number };
    cached = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return data.access_token;
  } catch (error) {
    console.warn("Drive token exchange threw.", error);
    return null;
  }
}
