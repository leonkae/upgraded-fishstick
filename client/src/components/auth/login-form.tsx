"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: undefined });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // 🔔 Show error toast
      toast.error("Please fix the errors in the form.");
      return;
    }

    // 🔔 Show success toast
    toast.success("Login successful! Redirecting...");

    console.log("Login submitted:", formData);
  };

  return (
    <section
      id="admin-login"
      className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6"
    >
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        {/* Login Form */}
        <div className="bg-background-accent p-6 sm:p-8 rounded-2xl w-full max-w-md mx-auto lg:max-w-full animate-slide-up">
          <div className="flex items-center mb-6 sm:mb-8">
            <Star className="text-highlight-text w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-text">
              Admin Login
            </h2>
          </div>
          <p className="text-tertiary-text text-sm sm:text-base mb-6">
            Only authorized admins can access this portal.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-secondary-text text-sm sm:text-base mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text placeholder-gray-500 text-sm sm:text-base"
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-secondary-text text-sm sm:text-base mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text placeholder-gray-500 text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary-text hover:text-highlight-text"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2 sm:flex-nowrap">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-background-tertiary accent-background-tertiary"
                />
                <span className="ml-2 text-tertiary-text text-sm sm:text-base">
                  Remember me
                </span>
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-background-tertiary hover:text-background-secondary text-sm sm:text-base transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-background-tertiary text-primary-text py-2 sm:py-3 rounded-lg hover:bg-background-secondary transition-colors text-sm sm:text-base font-semibold"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-tertiary-text text-sm sm:text-base mt-4 sm:mt-6">
            Don&quot;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-highlight-text hover:text-background-button-hover"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Image (Large Devices Only) */}
        <div className="hidden lg:block relative rounded-2xl overflow-hidden animate-slide-up">
          <Image
            src="/login.jpg"
            alt="Admin dashboard"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export { LoginForm };
