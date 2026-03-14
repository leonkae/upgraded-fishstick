"use client";

import Link from "next/link";
import { Play } from "lucide-react";

const ReadyToDiscover = () => {
  return (
    <section
      className="bg-background-secondary py-20 text-center"
      style={{ border: "3px solid #8B5CF6" }}
    >
      <div className="container mx-auto">
        <div className="bg-gradient-to-b from-background-primary to-background-tertiary md:bg-gradient-to-r md:from-background-primary md:to-background-tertiary p-6 rounded-2xl shadow-lg">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Discover Your Path?
          </h2>
          <p className="text-tertiary-text mb-8">
            Join thousands of others who have uncovered their spiritual
            destination
          </p>
          <Link
            href="/quiz"
            className="bg-background-button text-button-text px-8 py-4 rounded-full font-semibold flex items-center gap-2 mx-auto hover:bg-background-button-hover hover:text-button-text-hover transition-colors w-fit"
          >
            <Play size={16} />
            Take Quiz Now
          </Link>
          <p className="text-tertiary-text mt-6 text-sm">
            • Takes only 5 minutes • 100% Private • Available in multiple
            languages
          </p>
        </div>
      </div>
    </section>
  );
};

export { ReadyToDiscover };
