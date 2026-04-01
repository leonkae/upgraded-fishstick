// src/components/auth/forgot-password-form.tsx
"use client";

import { startTransition, useActionState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { forgotPasswordSchema } from "@/schemas/forms";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ForgotPasswordFormData } from "@/types";
import { forgotPassword } from "@/services/auth";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";

const ForgotPasswordForm = () => {
  const [state, forgotPasswordAction, pending] = useActionState(
    forgotPassword,
    null
  );

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormData) => {
    startTransition(() => {
      forgotPasswordAction(values);
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
    <AuthFormWrapper form="forgot-password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          {/* Instruction Text */}
          <p className="text-sm sm:text-base text-gray-600">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-black">
                  Email address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@wick.com"
                    {...field}
                    className="h-12 w-full rounded-lg px-4 bg-white border border-gray-300 text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium rounded-lg"
            disabled={pending}
          >
            {pending ? "Sending link..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export { ForgotPasswordForm };
