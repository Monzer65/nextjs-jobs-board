import { google } from "@/lib/server/oauth";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";

import type { OAuth2Tokens } from "arctic";
import { createUser, getUserFromGoogleId } from "@/lib/server/user";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { ObjectParser } from "@pilcrowjs/object-parser";

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
    return new Response(null, {
      status: 400,
    });
  }
  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);
  const googleUserId = claimsParser.getString("sub");
  const name = claimsParser.getString("name");
  const picture = claimsParser.getString("picture");
  const email = claimsParser.getString("email");

  // TODO: Replace this with your own DB query.
  const existingUser = await getUserFromGoogleId(googleUserId);

  if (existingUser !== null) {
    const sessionToken = await generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id, {
      twoFactorVerified: false,
    });
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  // TODO: Replace this with your own DB query.
  const user = await createUser(
    email,
    name.replace(/\s/g, ""),
    "password",
    name,
    googleUserId,
    picture
  );

  const sessionToken = await generateSessionToken();
  const session = await createSession(sessionToken, user.id, {
    twoFactorVerified: false,
  });
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
