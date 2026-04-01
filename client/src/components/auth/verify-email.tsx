// src/components/auth/verify-email.tsx
"use client";

import { verifyEmail } from "@/services/auth";
import { redirect, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || null;
  const email = searchParams.get("email") || null;

  const [state, verifyEmailAction, pending] = useActionState(verifyEmail, null);

  useEffect(() => {
    if (state === null) {
      if (!token || !email) {
        toast.error("Invalid token or email.");
        redirect("/auth/login");
      }

      startTransition(() => {
        verifyEmailAction({ token, email });
      });

      return;
    }

    if ("message" in state) {
      toast.success(state.message, { duration: 8000 });
      redirect("/auth/login");
    }

    if ("error" in state) {
      toast.error(state.error);
      redirect("/auth/login");
    }
  }, [state]);

  return (
    <>
      <h2 className="text-2xl font-bold text-center">Verifying...</h2>
      {pending && <p className="text-center">Please wait...</p>}
    </>
  );
};

export { VerifyEmail };
