"use client";

import {
  resendPhoneVerificationCodeAction,
  verifyPhoneAction,
} from "./actions";
import { useActionState } from "react";

const phoneVerificationInitialState = {
  message: "",
};

export function PhoneVerificationForm() {
  const [state, action] = useActionState(
    verifyPhoneAction,
    phoneVerificationInitialState
  );
  return (
    <form action={action}>
      <label htmlFor='form-verify.code'>Code</label>
      <input id='form-verify.code' name='code' required />
      <button>Verify</button>
      <p>{state.message}</p>
    </form>
  );
}

const resendPhoneInitialState = {
  message: "",
};

export function ResendPhoneVerificationCodeForm() {
  const [state, action] = useActionState(
    resendPhoneVerificationCodeAction,
    resendPhoneInitialState
  );
  return (
    <form action={action}>
      <button>Resend code</button>
      <p>{state.message}</p>
    </form>
  );
}
