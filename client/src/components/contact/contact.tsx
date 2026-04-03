"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Form submitted:", formData);

    setMessage("Thank you for your message! We'll get back to you soon.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <section
      id="contact"
      className="bg-background-secondary pt-32 pb-20  sm:px-6 animate-fade-in"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-text mb-4">
              Get in Touch
            </h2>
            <p className="text-tertiary-text text-base sm:text-lg mb-8">
              Have questions about the quiz? Want to share your experience?
              We&apos;d love to hear from you!
            </p>

            <div className="space-y-6">
              <div className="flex items-center text-tertiary-text justify-center lg:justify-start">
                <Mail className="text-highlight-text w-6 h-6 sm:w-8 sm:h-8 mr-4" />
                <span className="text-sm sm:text-base">
                  support@futureofman.com
                </span>
              </div>
              <div className="flex items-center text-tertiary-text justify-center lg:justify-start">
                <Phone className="text-highlight-text w-6 h-6 sm:w-8 sm:h-8 mr-4" />
                <span className="text-sm sm:text-base">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-tertiary-text justify-center lg:justify-start">
                <MapPin className="text-highlight-text w-6 h-6 sm:w-8 sm:h-8 mr-4" />
                <span className="text-sm sm:text-base">
                  123 Faith Street, Heaven&apos;s Gate, CA 90210
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-primary-text font-semibold text-lg sm:text-xl mb-4">
                Follow Us
              </h3>
              <div className="flex justify-center lg:justify-start space-x-4">
                {[
                  { icon: Facebook, href: "https://facebook.com" },
                  { icon: Twitter, href: "https://twitter.com" },
                  { icon: Instagram, href: "https://instagram.com" },
                  { icon: Linkedin, href: "https://linkedin.com" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-background-tertiary rounded-full flex items-center justify-center text-primary-text hover:bg-background-secondary transition-colors animate-pulse-hover"
                  >
                    <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-background-accent rounded-2xl p-6 sm:p-8 animate-slide-up">
            <h3 className="text-xl sm:text-2xl font-semibold text-secondary-text mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-secondary-text text-sm sm:text-base mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text placeholder-tertiary-text"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text placeholder-tertiary-text"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text placeholder-tertiary-text"
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-secondary-text text-sm sm:text-base mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text"
                >
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Quiz Feedback</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-secondary-text text-sm sm:text-base mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring-secondary bg-background-accent text-secondary-text placeholder-tertiary-text"
                  placeholder="Your message here..."
                />
                {errors.message && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-background-primary text-primary-text py-3 rounded-lg hover:bg-background-secondary transition-colors flex items-center justify-center gap-2 animate-pulse-hover"
              >
                Send Message
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
            {message && (
              <p className="text-green-500 text-sm sm:text-base mt-4 text-center animate-fade-in">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Contact };
