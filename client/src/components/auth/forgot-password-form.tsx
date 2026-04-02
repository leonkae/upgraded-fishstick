"use client";

import { useState } from "react"; // Switched from useActionState to useState
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // Use useRouter instead of redirect for client-side

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
import { toast } from "sonner";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    setIsPending(true);
    try {
      // Direct API call - Replace with your actual backend URL if it's not localhost
      const response = await fetch(
        "http://localhost:3005/api/v1/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }

      toast.success(data.message || "Reset link sent!", { duration: 8000 });
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthFormWrapper form="forgot-password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          <p className="text-sm sm:text-base text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>

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

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium rounded-lg"
            disabled={isPending}
          >
            {isPending ? "Sending link..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export { ForgotPasswordForm };
