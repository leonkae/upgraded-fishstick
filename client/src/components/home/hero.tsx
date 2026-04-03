"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Users } from "lucide-react";
import { useRef, useState } from "react";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);

    // Optional smoother volume when unmuting
    if (!videoRef.current.muted) {
      videoRef.current.volume = 0.5;
    }
  };

  return (
    <section id="hero" className="bg-background-primary pt-30 pb-20">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.15),transparent_40%)]" />
      </div>

      <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight">
            <span className="block text-white">Your Choices Shape</span>
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 bg-clip-text text-transparent inline-block">
              your Journey
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Answer 12 quick questions in our spiritual quiz and explore how your
            choices align with{" "}
            <span className="font-semibold text-amber-300">grace</span>,{" "}
            <span className="font-semibold text-amber-300">love</span>, and the
            path toward deeper purpose.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-10">
            <Link
              href="/quiz"
              className="group relative bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-lg shadow-xl shadow-orange-900/40 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-700/50 hover:scale-[1.03] flex items-center gap-3"
            >
              <Play
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              Start the Quiz Now
            </Link>

            <Link
              href="/about"
              className="border-2 border-purple-500/60 text-purple-300 hover:bg-purple-900/40 hover:text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-[1.03]"
            >
              Learn How It Works
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-6 text-gray-400">
            <div className="flex -space-x-3">
              <Image
                src="/img1.jpg"
                alt="User"
                width={44}
                height={44}
                className="rounded-full border-2 border-purple-600/60 object-cover shadow-md"
              />
              <Image
                src="/img2.jpg"
                alt="User"
                width={44}
                height={44}
                className="rounded-full border-2 border-purple-600/60 object-cover shadow-md"
              />
              <Image
                src="/img3.jpg"
                alt="User"
                width={44}
                height={44}
                className="rounded-full border-2 border-purple-600/60 object-cover shadow-md"
              />
              <div className="w-11 h-11 rounded-full bg-purple-800/80 border-2 border-purple-600/60 flex items-center justify-center text-xs font-bold text-white shadow-md">
                +5k
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users size={20} className="text-purple-400" />
              <span className="text-base sm:text-lg">
                <strong className="text-white">Join</strong> everyone who
                discovered their path today
              </span>
            </div>
          </div>
        </div>
        =
        <div className="flex-1 relative max-w-md lg:max-w-none">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/40 border border-purple-700/30">
            =
            <video
              ref={videoRef}
              src="/hero-video.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              onLoadedData={() => setIsLoaded(true)}
              className={`w-full h-[520px] md:h-[580px] object-cover transition-all duration-700 ${
                isLoaded ? "opacity-100" : "opacity-0 blur-sm"
              }`}
            />
            =
            {!isLoaded && (
              <Image
                src="/hero.jpg"
                alt="Fallback"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/50 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10" />
            <div className="absolute z-20 bottom-6 right-6 flex gap-3">
              <button
                onClick={togglePlay}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button
                onClick={toggleMute}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
            <div className="absolute top-6 left-6 z-20">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm md:text-base font-bold px-5 py-2 rounded-full shadow-lg">
                Instant Revelation Awaits
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 z-20 text-center">
              <p className="text-white/90 text-sm md:text-base font-medium drop-shadow-lg">
                Where two or three are gathered !
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
