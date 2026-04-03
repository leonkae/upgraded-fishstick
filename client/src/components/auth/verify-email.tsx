"use client";

import { verifyEmail } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [state, verifyEmailAction, pending] = useActionState(verifyEmail, null);

  useEffect(() => {
    // 1. Handle Initial Execution
    if (state === null) {
      if (!token || !email) {
        toast.error("Invalid token or email.");
        router.replace("/auth/login");
        return;
      }

      startTransition(() => {
        verifyEmailAction({ token, email });
      });
      return;
    }

    // 2. Handle Success
    if ("message" in state) {
      toast.success(state.message, { duration: 8000 });
      router.replace("/auth/login");
    }

    // 3. Handle Error
    if ("error" in state) {
      toast.error(state.error);
      router.replace("/auth/login");
    }
  }, [state, token, email, verifyEmailAction, router]); // Added all missing dependencies

  return (
    <>
      <h2 className="text-2xl font-bold text-center">Verifying...</h2>
      {pending && <p className="text-center">Please wait...</p>}
    </>
  );
};

export { VerifyEmail };
