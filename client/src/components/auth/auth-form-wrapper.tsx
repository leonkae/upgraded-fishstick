// src/components/auth/auth-form-wrapper.tsx

import Link from "next/link";

const forms = {
  login: {
    title: "Log in to your account",
    description: "Welcome back! Please log in to continue.",
    "footer-text": "",
    "footer-link": "",
    "footer-link-text": "",
  },
  "forgot-password": {
    title: "Forgot Password",
    description: "Reset your password and regain access to your account.",
    "footer-text": "Remembered your password?",
    "footer-link": "/auth/login",
    "footer-link-text": "Log in",
  },
  "reset-password": {
    title: "Reset Password",
    description: "Set a new password for your account.",
    "footer-text": "Remembered your password?",
    "footer-link": "/auth/login",
    "footer-link-text": "Log in",
  },
} as const;

interface AuthFormWrapperProps {
  form: keyof typeof forms;
  children: React.ReactNode;
}

const AuthFormWrapper = ({ form, children }: AuthFormWrapperProps) => {
  const config = forms[form];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-xl sm:max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-10">
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-black"></h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto"></p>
          </div>

          <div className="w-full">{children}</div>

          {config["footer-link"] && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                {config["footer-text"]}{" "}
                <Link
                  href={config["footer-link"]}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {config["footer-link-text"]}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AuthFormWrapper };
