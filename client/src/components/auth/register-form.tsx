"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface SignupFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
  }>({ score: 0, label: "" });

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*]/.test(password)) score += 1;
    if (password.length >= 12) score += 1;

    const labels = ["", "Weak", "Weak", "Medium", "Strong", "Very Strong"];
    return { score, label: labels[score] };
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const array = new Uint8Array(12);
    crypto.getRandomValues(array);
    const password = Array.from(array)
      .map((x) => chars[x % chars.length])
      .join("");
    setFormData({
      ...formData,
      password,
    });
    setErrors({ ...errors, password: undefined });
    setPasswordStrength(calculatePasswordStrength(password));
    return password;
  };

  const validateForm = (): SignupFormErrors => {
    const newErrors: SignupFormErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include numbers and special characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms of Service";
    }
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: undefined });
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
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
    console.log("Form submitted:", formData);
    // 🔔 Show success toast
    toast.success("Account created successfully! Please log in.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    });
    setPasswordStrength({ score: 0, label: "" });
  };

  return (
    <section
      id="admin-signup"
      className="min-h-screen flex items-center justify-center py-6 sm:px-6"
    >
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        {/* Signup Form */}
        <div className="bg-background-accent p-6 sm:p-8 rounded-2xl w-full max-w-md mx-auto lg:max-w-full animate-slide-up">
          <div className="flex items-center mb-6 sm:mb-8">
            <UserPlus className="text-highlight-text w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-text">
              Create Admin Account
            </h2>
          </div>
          <p className="text-tertiary-text text-sm sm:text-base mb-6">
            Only authorized admins can create accounts.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary-text text-sm sm:text-base mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text placeholder-gray-500 text-sm sm:text-base"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-secondary-text text-sm sm:text-base mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text placeholder-gray-500 text-sm sm:text-base"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-highlight-text hover:text-background-button-hover"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 w-8 rounded-full ${
                          passwordStrength.score >= i
                            ? passwordStrength.score <= 2
                              ? "bg-red-500"
                              : passwordStrength.score <= 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-xs sm:text-sm ${
                      passwordStrength.score <= 2
                        ? "text-red-500"
                        : passwordStrength.score <= 3
                          ? "text-yellow-500"
                          : "text-green-500"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => generatePassword()}
                  className="text-highlight-text hover:text-background-button-hover text-xs sm:text-sm underline"
                >
                  Generate Password
                </button>
              </div>
              <p className="text-tertiary-text text-xs sm:text-sm mt-1">
                Must be at least 8 characters long with numbers and special
                characters
              </p>
              {errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <label className="block text-secondary-text text-sm sm:text-base mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text placeholder-gray-500 text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-highlight-text hover:text-background-button-hover"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-background-tertiary accent-background-tertiary"
                />
                <span className="ml-2 text-tertiary-text text-sm sm:text-base">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-highlight-text hover:text-background-button-hover"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-highlight-text hover:text-background-button-hover"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.agreeTerms}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-background-button hover:bg-background-button-hover text-button-text hover:text-button-text-hover py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-semibold"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-tertiary-text text-sm sm:text-base mt-4 sm:mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-highlight-text hover:text-background-button-hover"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Image (Large Devices Only) */}
        <div className="hidden lg:block relative rounded-2xl overflow-hidden animate-slide-up">
          <Image
            src="/login.jpg"
            alt="Admin dashboard preview"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export { RegisterForm };
