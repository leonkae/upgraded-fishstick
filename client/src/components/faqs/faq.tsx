"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How long does the quiz take?",
    answer:
      "The quiz typically takes 5 minutes to complete. It consists of 10 thought-provoking questions about your moral choices and personality traits.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes, your responses are 100% private and anonymous. We never share individual results without explicit consent.",
  },
  {
    question: "Can I retake the quiz?",
    answer:
      "Yes! You can retake the quiz as many times as you'd like. Your results may vary based on your current mindset and choices.",
  },
  {
    question: "How accurate are the results?",
    answer:
      "Our algorithm is based on psychological research and moral philosophy. While no quiz is 100% accurate, most users find their results highly reflective of their moral compass.",
  },
  {
    question: "Can I share my results?",
    answer:
      "Absolutely! After completing the quiz, you can share your results on social media, download a result card, or email them to yourself.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-background-tertiary pt-24 pb-16 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold  mb-4 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-tertiary-text text-base text-white sm:text-lg ">
            Everything you need to know about The Future of Man quiz
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-background-secondary rounded-xl p-4 sm:p-6"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-left text-white">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="text-highlight-text w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <ChevronDown className="text-highlight-text w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
              {openIndex === index && (
                <div className="mt-4 text-tertiary-text text-sm sm:text-base">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-background-secondary rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold  mb-4 text-white">
            Still have questions?
          </h3>
          <p className="text-tertiary-text mb-6 text-sm sm:text-base text-white">
            We're here to help! Reach out to our support team for assistance.
          </p>
          <Link
            href="/contact"
            className="bg-background-button text-button-text px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-background-button-hover hover:text-button-text-hover transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
};

export { FAQ };
