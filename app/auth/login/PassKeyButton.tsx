"use client";
import { useState } from "react";

export function PasskeyLoginButton() {
  const [message, setMessage] = useState("");
  return (
    <>
      <button
        onClick={async () => {
          // const challenge = await createChallenge();
          const challenge = console.log("aaa");

          const credential = {
            publicKey: {
              challenge,
              userVerification: "required",
            },
          };
          // const credential = await navigator.credentials.get({
          // 	publicKey: {
          // 		challenge,
          // 		userVerification: "required"
          // 	}
          // });

          if (!(credential instanceof PublicKeyCredential)) {
            throw new Error("Failed to create public key");
          }
          if (
            !(credential.response instanceof AuthenticatorAssertionResponse)
          ) {
            throw new Error("Unexpected error");
          }

          // const result = await loginWithPasskeyAction({
          // 	credential_id: encodeBase64(new Uint8Array(credential.rawId)),
          // 	signature: encodeBase64(new Uint8Array(credential.response.signature)),
          // 	authenticator_data: encodeBase64(new Uint8Array(credential.response.authenticatorData)),
          // 	client_data_json: encodeBase64(new Uint8Array(credential.response.clientDataJSON))
          // });
          // setMessage(result.message);
        }}
      >
        ورود با کلید عبور
      </button>
      <p>{message}</p>
    </>
  );
}
