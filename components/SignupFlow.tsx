"use client";

import { useState, useCallback } from "react";
import VerificationForm from "./VerificationForm";
import SignupForm from "./SignupForm";

export default function SignupFlow() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [contactInfo, setContactInfo] = useState<{
    method: string;
    value: string;
  }>({ method: "", value: "" });

  const handleSignupSuccess = useCallback((method: string, value: string) => {
    setContactInfo({ method, value });
    setStep("verify");
  }, []);

  const handleBackToSignup = useCallback(() => {
    setStep("signup");
  }, []);

  return (
    <div>
      {step === "signup" ? (
        <SignupForm onSignupSuccess={handleSignupSuccess} />
      ) : (
        <VerificationForm
          contactInfo={contactInfo}
          onBack={handleBackToSignup}
        />
      )}
    </div>
  );
}
