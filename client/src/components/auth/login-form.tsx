"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ← Add this
import { toast } from "sonner";
import { startTransition, useActionState, useEffect } from "react";

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
import { loginFormSchema } from "@/schemas/forms";
import { LoginFormData, User } from "@/types";
import { login } from "@/services/auth";
import { useAuth } from "@/store/auth";
import { RequiredInput } from "@/components/ui/required-input";

const LoginForm = () => {
  const router = useRouter(); // ← Add this
  const [state, loginAction, pending] = useActionState(login, null);
  const { setUser, authError, clearAuthError } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormData) {
    startTransition(() => {
      loginAction(values);
    });
  }

  useEffect(() => {
    if (state === null) return;

    if ("message" in state && "user" in state) {
      setUser(state.user as User);
      toast.success(state.message, { duration: 8000 });

      // Fixed: Use router.replace instead of redirect
      router.replace("/admin/dashboard");
      return;
    }

    if ("error" in state) {
      toast.error(state.error);
    }
  }, [state, router]); // ← router added here

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      clearAuthError();
    }
  }, [authError, clearAuthError]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-xl">
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-3xl font-semibold text-foreground">
            Welcome back
          </h1>
          <p className="text-base text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-black">
                      Email <RequiredInput />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@wick.com"
                        {...field}
                        className="h-12 w-full rounded-lg px-4 bg-white border border-gray-300 text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-black">
                      Password <RequiredInput />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="h-12 w-full rounded-lg px-4 bg-white border border-gray-300 text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Remember me</span>
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="w-full h-12 text-base font-medium rounded-lg"
              >
                {pending ? "Signing in..." : "Log In"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export { LoginForm };
