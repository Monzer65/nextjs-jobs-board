import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";

import type { OAuth2Tokens } from "arctic";
import { google } from "@/lib/google";
import db from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    // Invalid code or client credentials
    console.error(e);
    return new Response(null, {
      status: 400,
    });
  }
  const claims = decodeIdToken(tokens.idToken());
  const googleUserId = (claims as { sub: string }).sub;
  const username = (claims as { name: string }).name;

  // TODO: Replace this with your own DB query.
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.googleId, googleUserId))
    .execute();

  if (existingUser.length > 0) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser[0].id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  // TODO: Replace this with your own DB query.
  const newUser = await db
    .insert(user)
    .values({
      username: username,
      password: "",
      name: username,
      googleId: googleUserId,
    })
    .returning()
    .execute();

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, newUser[0].id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
