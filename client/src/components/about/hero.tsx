"use client";

import Link from "next/link";
import {
  Users,
  Star,
  Heart,
  ShieldCheck,
  Target,
  ArrowRight,
} from "lucide-react";

const Hero = () => {
  return (
    <section id="about" className="bg-background-primary pt-32 pb-20  sm:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl text-center lg:text-4xl font-bold mb-6 text-white">
              About The Future of Man
            </h1>
            <p className="text-tertiary-text text-base sm:text-lg mb-8">
              We&apos;re on a mission to help people understand their moral
              compass and spiritual path through an engaging, thought-provoking
              quiz experience. Our unique algorithm analyzes responses to
              determine if someone&apos;s choices align with Heaven, Hell, or
              somewhere In-Between.
            </p>

            <div className="bg-background-secondary p-4 sm:p-6 rounded-xl mb-8 space-y-6">
              <div className="flex items-center">
                <Users className="text-highlight-text w-5 h-5 sm:w-6 sm:h-6 mr-4" />
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-white">
                    Global Community
                  </h3>
                  <p className="text-tertiary-text text-sm sm:text-base">
                    Join all the Quiz takers.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="text-highlight-text w-5 h-5 sm:w-6 sm:h-6 mr-4" />
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-white">
                    Trusted Results
                  </h3>
                  <p className="text-tertiary-text text-sm sm:text-base">
                    4.8/5 average rating from users
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/quiz"
              className="bg-background-button text-button-text px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold flex items-center gap-2 w-fit mx-auto sm:mx-0 hover:bg-background-button-hover hover:text-button-text-hover transition-colors"
            >
              Take the Quiz Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>

          {/* Core Values */}
          <div className="relative">
            <div className="bg-background-accent rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-text mb-4">
                Our Core Values
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-background-secondary rounded-full flex items-center justify-center mr-4">
                    <Heart className="text-highlight-text w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-text mb-1 text-base sm:text-lg">
                      Empathy & Understanding
                    </h4>
                    <p className="text-tertiary-text text-sm sm:text-base">
                      We believe in helping people understand themselves better.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-background-secondary rounded-full flex items-center justify-center mr-4">
                    <ShieldCheck className="text-highlight-text w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-text mb-1 text-base sm:text-lg">
                      Privacy & Security
                    </h4>
                    <p className="text-tertiary-text text-sm sm:text-base">
                      Your responses are always confidential and protected.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-background-secondary rounded-full flex items-center justify-center mr-4">
                    <Target className="text-highlight-text w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-text mb-1 text-base sm:text-lg">
                      Accuracy & Insight
                    </h4>
                    <p className="text-tertiary-text text-sm sm:text-base">
                      Our algorithm is continuously refined for precise results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
