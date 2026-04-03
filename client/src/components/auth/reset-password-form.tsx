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
import { useRouter, useSearchParams } from "next/navigation"; // Changed redirect to useRouter
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthError } = useAuth();

  // Removed 'token' state as it was unused; kept email for validation
  const [email, setEmail] = useState<string | null>(null);

  const [state, restedPasswordAction, pending] = useActionState(
    resetPassword,
    null
  );

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!tokenParam || !emailParam) {
      setAuthError("Invalid token or email");
      router.replace("/auth/login");
      return;
    }

    setEmail(emailParam);

    // Clear the token and email from the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("token");
    url.searchParams.delete("email");
    window.history.replaceState({}, document.title, url.toString());
  }, [searchParams, setAuthError, router]); // Added setAuthError and router to dependencies

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
      password: "",
      confirmPassword: "",
      token: searchParams.get("token") || "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
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
      router.push("/auth/login");
    }

    if ("error" in state) {
      toast.error(state.error);
    }
  }, [state, router]);

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
            {pending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export { ResetPasswordForm };
