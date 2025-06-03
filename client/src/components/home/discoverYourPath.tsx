"use client";
import { Cloud, Scale, Flame } from "lucide-react";

const DiscoverYourPath = () => {
  return (
    <section id="paths" className="bg-background-secondary py-20 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold  mb-4">Discover Your Path</h2>
        <p className="text-tertiary-text mb-12">
          After completing the quiz, you&apos;ll find out if your destiny leads
          to:
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card-blue p-8 rounded-2xl">
            <div className="w-12 h-12 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Cloud size={24} />
            </div>
            <h3 className="text-2xl font-bold  mb-4">Heaven</h3>
            <p className="text-tertiary-text mb-6">
              Your moral compass and choices align with a higher path. You
              prioritize kindness and ethics.
            </p>
            <div className="text-sm">32% of quiz takers</div>
          </div>
          <div className="bg-card-purple p-8 rounded-2xl">
            <div className="w-12 h-12 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale size={24} />
            </div>
            <h3 className="text-2xl font-bold  mb-4">In-Between</h3>
            <p className="text-tertiary-text mb-6">
              You balance between right and wrong, sometimes making compromises
              in your moral judgments.
            </p>
            <div className="text-sm ">45% of quiz takers</div>
          </div>
          <div className="bg-card-red p-8 rounded-2xl">
            <div className="w-12 h-12 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Flame size={24} />
            </div>
            <h3 className="text-2xl font-bold  mb-4">Hell</h3>
            <p className="text-tertiary-text mb-6">
              Your choices often prioritize self-interest over the greater good,
              potentially leading to a darker path.
            </p>
            <div className="text-sm">23% of quiz takers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { DiscoverYourPath };
