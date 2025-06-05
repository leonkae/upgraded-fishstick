"use client";

import { HelpCircle, BarChart3, Share } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-background-secondary py-20 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold  mb-4">How It Works</h2>
        <p className="text-tertiary-text mb-12 max-w-2xl mx-auto">
          Our quiz uses a unique algorithm to analyze your moral compass and
          personality traits
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card-purple p-8 rounded-2xl">
            <div className="w-12 h-12 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Answer Questions</h3>
            <p className="text-tertiary-text">
              Respond to our thought-provoking moral and personality questions,
              one screen at a time.
            </p>
          </div>
          <div className="bg-card-purple p-8 rounded-2xl">
            <div className="w-12 h-12 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold  mb-4">Get Analyzed</h3>
            <p className="text-tertiary-text">
              Our algorithm analyzes your responses to determine your spiritual
              destination.
            </p>
          </div>
          <div className="bg-card-purple p-8 rounded-2xl">
            <div className="w-12 h-12 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Share size={24} />
            </div>
            <h3 className="text-xl font-bold  mb-4">Share Results</h3>
            <p className="text-tertiary-text">
              Discover your path, receive personalized recommendations, and
              share with friends.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HowItWorks };
