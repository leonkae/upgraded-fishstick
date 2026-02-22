"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Facebook, Instagram } from "lucide-react";

const Hero = () => {
  return (
    <section id="hero" className="bg-background-primary pt-32 pb-20 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Where Will Your <span className="text-highlight-text">Choices</span>{" "}
            Lead You?
          </h1>
          <p className="text-tertiary-text text-lg mb-8">
            Take our viral personality quiz and discover if your path leads to
            Heaven, Hell, or somewhere in-between.
          </p>
          <div className="flex gap-4">
            <Link
              href="/quiz"
              className="bg-background-button hover:bg-background-button-hover text-button-text hover:text-button-text-hover px-2 py-2 md:px-8 md:py-3 rounded-full font-semibold flex items-center gap-2 transition-colors"
            >
              <Play size={16} />
              Start Quiz
            </Link>
            <Link
              href="/about"
              className="border-2 border-ring px-2 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-background-accent hover:text-secondary-text transition-colors"
            >
              Learn More
            </Link>
          </div>
          <div className="flex items-center gap-8 md:gap-3 mt-8">
            <div className="flex -space-x-2">
              <Image
                src="/img1.jpg"
                alt="User"
                width={32}
                height={32}
                className="rounded-full border-2 border-ring-secondary object-cover"
              />
              <Image
                src="/img2.jpg"
                alt="User"
                width={32}
                height={32}
                className="rounded-full border-2 border-ring-secondary"
              />
              <Image
                src="/img3.jpg"
                alt="User"
                width={32}
                height={32}
                className="rounded-full border-2 border-ring-secondary"
              />
            </div>
            <span className="text-tertiary-text">
              Join 10,000+ people who took the quiz today
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-background-accent rounded-3xl p-4 shadow-xl">
            <div className="bg-background-button text-sm font-semibold text-button-text px-4 py-1 rounded-full inline-block mb-2">
              Trending Now!
            </div>
            <Image
              src="/hero.jpg"
              alt="Diverse group of young people"
              width={500}
              height={300}
              className="w-full h-[300px] object-cover rounded-2xl mb-4"
              priority
            />
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/img4.jpg"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-ring-secondary"
                />
                <Image
                  src="/img5.jpg"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-ring-secondary"
                />
                <span className="text-sm text-tertiary-text">
                  @sarahjones and 5 others
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-tertiary-text">Share:</span>
                <button className="text-secondary-text">
                  <Facebook />
                </button>
                <button className="text-secondary-text">
                  <Instagram />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
