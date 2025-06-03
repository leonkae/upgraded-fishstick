"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-background-secondary py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          What Others Are Saying
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-background-accent p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="/img1.jpg"
                alt="User"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h4 className="font-bold text-tertiary-text">Emma J.</h4>
                <div className="flex text-highlight-text">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
            </div>
            <p className="text-secondary-text mb-4">
              &quot;This quiz really made me think about my daily choices. I
              scored &apos;In-Between&apos; and it&apos;s motivated me to be
              more mindful of how my actions affect others.&quot;
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-tertiary-text">May 2, 2025</span>
              <span className="text-sm text-secondary-text">In-Between</span>
            </div>
          </div>
          <div className="bg-background-accent p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="/img4.jpg"
                alt="User"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h4 className="font-bold text-tertiary-text">Tyler M.</h4>
                <div className="flex text-highlight-text">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} />
                </div>
              </div>
            </div>
            <p className="text-secondary-text mb-4">
              &quot;Got &apos;Heaven&apos; as my result and shared it with all
              my friends! The questions were deep and really made me reflect on
              my values. Highly recommend!&quot;
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-tertiary-text">May 5, 2025</span>
              <span className="text-sm text-secondary-text">Heaven</span>
            </div>
          </div>
          <div className="bg-background-accent p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="/img5.jpg"
                alt="User"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h4 className="font-bold text-tertiary-text">Sarah K.</h4>
                <div className="flex text-highlight-text">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} />
                </div>
              </div>
            </div>
            <p className="text-secondary-text mb-4">
              &quot;The quiz was fun and insightful. I landed in
              &apos;Hell&apos;, which was a wake-up call to rethink some of my
              choices. Definitely worth trying!&quot;
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-tertiary-text">May 7, 2025</span>
              <span className="text-sm text-secondary-text">Hell</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonials };
