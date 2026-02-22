import { z } from "zod";
import {
  forgotPasswordSchema,
  loginFormSchema,
  registerFormSchema,
  resetPasswordSchema,
} from "@/schemas/forms";

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export type LoginFormData = z.infer<typeof loginFormSchema>;

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export type VerifyEmailData = {
  token: string;
  email: string;
};

export interface APIError {
  message: string;
  field?: string;
  path?: string;
}

export interface APIErrorResponse {
  success: false;
  errors: APIError[];
}

export interface APIResponse<T> {
  success: boolean;
  data: T | T[];
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  linkedin?: string | null;
  twitter?: string | null;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthData {
  message: string;
  user?: User;
}
