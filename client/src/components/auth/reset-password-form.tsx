// src/components/auth/reset-password-form.tsx
"use client";

import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RequiredInput } from "@/components/ui/required-input";
import { resetPasswordSchema } from "@/schemas/forms";
import { resetPassword } from "@/services/auth";
import { useAuth } from "@/store/auth";
import { ResetPasswordFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  // Get the token from the URL
  const searchParams = useSearchParams();
  // Get the setAuthError function from the auth store
  const { setAuthError } = useAuth();
  // State to hold the token and email
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [state, restedPasswordAction, pending] = useActionState(
    resetPassword,
    null
  );

  useEffect(() => {
    // If the token or email is not present in the URL, redirect to the login page with an error
    if (!searchParams.get("token") || !searchParams.get("email")) {
      setAuthError("Invalid token or email");
      redirect("/auth/login");
    }

    // Set the token and email in the state
    setToken(searchParams.get("token"));
    setEmail(searchParams.get("email"));

    // Clear the token and email from the URL without triggering a rerender
    const url = new URL(window.location.href);
    url.searchParams.delete("token");
    url.searchParams.delete("email");
    window.history.replaceState({}, document.title, url.toString());
  }, [searchParams]);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
      password: "",
      confirmPassword: "",
      token: searchParams.get("token") || "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    // Check if the entered email matches the one that was in the URL
    if (values.email !== email) {
      toast.error("You cannot change the email address");
      return;
    }

    startTransition(() => {
      restedPasswordAction(values);
    });
  };

  useEffect(() => {
    if (state === null) return;

    if ("message" in state) {
      toast.success(state.message, { duration: 8000 });
      redirect("/auth/login");
    }

    if ("error" in state) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <AuthFormWrapper form="reset-password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@wick.com"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  New Password
                  <RequiredInput />
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm New Password
                  <RequiredInput />
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export { ResetPasswordForm };
