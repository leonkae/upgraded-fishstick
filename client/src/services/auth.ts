"use server";

import { cookies, headers } from "next/headers";

import {
  AuthData,
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  VerifyEmailData,
} from "@/types";
import { fetapi } from "@/services/api";
import { createUserSession } from "@/lib/session";

type AuthState = AuthData | null | { error: string };

// Fixed: Changed 'any' to 'unknown' to resolve the linting error
export const authError = async (error: unknown) => {
  return {
    error:
      error instanceof Error
        ? error.message
        : "An error occurred. Please try again.",
  };
};

export const authHeaders = async () => {
  return {
    headers: Object.fromEntries((await headers()).entries()),
  };
};

export const register = async (_: AuthState, data: RegisterFormData) => {
  try {
    // Updated to use the new body parameter signature
    const result = await fetapi.post<AuthData>("/auth/register", data);

    return result.data;
  } catch (error) {
    return await authError(error);
  }
};

export const verifyEmail = async (_: AuthState, data: VerifyEmailData) => {
  try {
    const result = await fetapi.post<AuthData>("/auth/verify-email", data);

    return result.data;
  } catch (error) {
    return await authError(error);
  }
};

export const login = async (_: AuthState, data: LoginFormData) => {
  try {
    const result = await fetapi.post<AuthData>("/auth/login", data);

    // Create the user session by setting the cookie in the browser
    await createUserSession(result.response);

    return result.data;
  } catch (error) {
    return await authError(error);
  }
};

export const logout = async () => {
  try {
    const result = await fetapi.delete<AuthData>(
      "/auth/logout",
      await authHeaders()
    );

    // Clear the cookie in the browser
    (await cookies()).delete("auth_token");
    return result.data;
  } catch (error) {
    return await authError(error);
  }
};

export const forgotPassword = async (
  _: AuthState,
  data: ForgotPasswordFormData
) => {
  try {
    const result = await fetapi.post<AuthData>("/auth/forgot-password", data);

    return result.data;
  } catch (error) {
    return await authError(error);
  }
};

export const resetPassword = async (
  _: AuthState,
  data: ResetPasswordFormData
) => {
  try {
    const result = await fetapi.post<AuthData>("/auth/reset-password", data);

    return result.data;
  } catch (error) {
    return await authError(error);
  }
};
