"use client";

import Link from "next/link";
import { useState } from "react";

interface FormData {
  email: string;
}

const Footer = () => {
  const [formData, setFormData] = useState<FormData>({ email: "" });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate API call or form submission
    console.log("Subscribed with email:", formData.email);
    setMessage("Thank you for subscribing!");
    setFormData({ email: "" }); // Clear the input
    // In a real app, replace console.log with an API call (e.g., fetch or axios)
  };

  return (
    <footer className="bg-background-primary py-12 px-6 text-white">
      <div className="container mx-auto text-center">
        <h3 className="text-2xl font-bold mb-6">Stay Updated</h3>
        <p className="text-tertiary-text mb-6">
          Subscribe to our newsletter for the latest updates and insights
        </p>
        <form
          onSubmit={handleSubmit}
          className="max-w-sm mx-auto flex flex-col md:flex-row gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-2 rounded-full bg-background-accent text-secondary-text placeholder-tertiary-text focus:outline-none focus:ring-2 focus:ring-highlight-text w-full md:w-auto"
            required
          />
          <button
            type="submit"
            className="bg-background-button text-button-text px-6 py-2 rounded-full font-semibold hover:bg-background-button-hover hover:text-button-text-hover transition-colors"
          >
            Subscribe
          </button>
        </form>
        {message && <p className="mt-4 text-tertiary-text">{message}</p>}
        <div className="mt-8 text-tertiary-text text-sm">
          <p>© 2025 The Future of Man. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link
              href="/terms"
              className="text-primary-text hover:text-highlight-text"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-primary-text hover:text-highlight-text"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-primary-text hover:text-highlight-text"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
