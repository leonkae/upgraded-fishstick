"use client";

import Image from "next/image";
import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";

const Team = () => {
  return (
    <section id="team" className="bg-background-secondary py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-tertiary-text text-base sm:text-lg">
            Meet the people behind The Future of Man
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-card-purple p-4 sm:p-6 rounded-2xl text-center">
            <Image
              src="/img1.jpg"
              alt="David Chen"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              David Chen
            </h3>
            <p className="text-highlight-text mb-4 text-sm sm:text-base">
              Founder & Lead Developer
            </p>
            <p className="text-tertiary-text mb-4 text-sm sm:text-base">
              10+ years experience in ethical AI and psychology
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="https://linkedin.com"
                className="text-tertiary-text hover:text-highlight-text transition-colors"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-tertiary-text hover:text-highlight-text transition-colors"
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>

          <div className="bg-card-purple p-4 sm:p-6 rounded-2xl text-center">
            <Image
              src="/img2.jpg"
              alt="Sarah Williams"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Sarah Williams
            </h3>
            <p className="text-highlight-text mb-4 text-sm sm:text-base">
              Head of Research
            </p>
            <p className="text-tertiary-text mb-4 text-sm sm:text-base">
              PhD in Behavioral Psychology
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="https://linkedin.com"
                className="text-tertiary-text hover:text-highlight-text transition-colors"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-tertiary-text hover:text-highlight-text transition-colors"
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>

          <div className="bg-card-purple p-4 sm:p-6 rounded-2xl text-center">
            <Image
              src="/img3.jpg"
              alt="Michael Torres"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Michael Torres
            </h3>
            <p className="text-highlight-text mb-4 text-sm sm:text-base">
              UX Designer
            </p>
            <p className="text-tertiary-text mb-4 text-sm sm:text-base">
              Specialist in ethical design and accessibility
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="https://linkedin.com"
                className="text-tertiary-text hover:text-highlight-text transition-colors"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-tertiary-text hover:text-highlight-text transition-colors"
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Team };
