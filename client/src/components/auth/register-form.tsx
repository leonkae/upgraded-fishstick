"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerFormSchema } from "@/schemas/forms";
import { RegisterFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { register } from "@/services/auth";
import { SameLineInputs } from "@/components/ui/dual-input";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { RequiredInput } from "@/components/ui/required-input";

const RegisterForm = () => {
  const [state, registerAction, pending] = useActionState(register, null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormData) => {
    startTransition(() => {
      registerAction(values);
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
    <AuthFormWrapper form="register">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SameLineInputs>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    First Name <RequiredInput />
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Last Name <RequiredInput />
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Wick" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SameLineInputs>

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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone <RequiredInput />
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+254712777888" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Username <RequiredInput />
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="johnwick" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SameLineInputs>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Confirm Password <RequiredInput />
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SameLineInputs>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "..." : "Register"}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export { RegisterForm };
