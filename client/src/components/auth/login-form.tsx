"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";

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
import { startTransition, useActionState, useEffect } from "react";
import { login } from "@/services/auth";
import { useAuth } from "@/store/auth";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { RequiredInput } from "@/components/ui/required-input";

const LoginForm = () => {
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
      redirect("/account");
    }

    if ("error" in state) {
      toast.error(state.error);
    }
  }, [state]);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      clearAuthError();
    }
  }, []);

  return (
    <AuthFormWrapper form="login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <RequiredInput />
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@wick.com" {...field} />
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
                  Password <RequiredInput />
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TODO: Get this working  */}
          <div className="flex justify-between items-center ">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-primary-text cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-highlight-text hover:text-button-text-hover"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? "..." : "Log In"}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export { LoginForm };
