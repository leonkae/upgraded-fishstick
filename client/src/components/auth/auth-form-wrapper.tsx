import Link from "next/link";

// Configures the layout of the authentication form, including the title, description, and link to the login page.
const forms = {
  login: {
    title: "Log in to your account",
    description: "Welcome back! Please log in to continue.",
    "footer-text": "Don't have an account?",
    "footer-link": "/auth/register",
    "footer-link-text": "Register",
  },
  register: {
    title: "Create Your account",
    description: "Join our community and start your journey!",
    "footer-text": "Already have an account?",
    "footer-link": "/auth/login",
    "footer-link-text": "Log in",
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
};

interface AuthFormWrapperProps {
  form: keyof typeof forms;
  children: React.ReactNode;
}

const AuthFormWrapper = ({ form, children }: AuthFormWrapperProps) => {
  return (
    <div className="container mx-auto max-w-xl p-6 bg-background-primary">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">{forms[form].title}</h1>
        <p className="text-muted-foreground">{forms[form].description}</p>
      </div>
      {children}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          {forms[form]["footer-text"]}{" "}
          <Link
            href={forms[form]["footer-link"]}
            className="text-highlight-text"
          >
            {forms[form]["footer-link-text"]}
          </Link>
        </p>
      </div>
    </div>
  );
};

export { AuthFormWrapper };
