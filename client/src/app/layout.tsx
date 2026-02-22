"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Initialize fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default metadata fallback
const defaultMetadata = {
  title: "The Future of Man",
  description:
    "A fun and introspective quiz to help you discover your destiny: Heaven, Hell, or In-Between.",
  image: "https://images.pexels.com/photos/3776808/pexels-photo-3776808.jpeg", // 👉 Place your diverse under-50 image here
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [dynamicMetadata, setDynamicMetadata] = useState({
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    image: defaultMetadata.image,
  });

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:3005/api/v1/settings");

        if (res.data?.success && res.data?.data) {
          setDynamicMetadata((prev) => ({
            ...prev,
            title: res.data.data.appName ?? prev.title,
            description: res.data.data.appDescription ?? prev.description,
            image: res.data.data.shareImage ?? prev.image,
          }));
        }
      } catch (err) {
        console.log("Using default metadata.", err);
      }
    };

    fetchSettings();
  }, []);

  // Dynamically update <head>
  useEffect(() => {
    document.title = dynamicMetadata.title;

    const updateMetaTag = (
      selector: string,
      attribute: string,
      value: string
    ) => {
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement("meta");

        if (selector.includes("property")) {
          element.setAttribute("property", attribute);
        } else {
          element.setAttribute("name", attribute);
        }

        document.head.appendChild(element);
      }

      element.setAttribute("content", value);
    };

    // Standard description
    updateMetaTag(
      'meta[name="description"]',
      "description",
      dynamicMetadata.description
    );

    // Open Graph
    updateMetaTag(
      'meta[property="og:title"]',
      "og:title",
      dynamicMetadata.title
    );
    updateMetaTag(
      'meta[property="og:description"]',
      "og:description",
      dynamicMetadata.description
    );
    updateMetaTag(
      'meta[property="og:image"]',
      "og:image",
      dynamicMetadata.image
    );

    // Twitter
    updateMetaTag(
      'meta[name="twitter:card"]',
      "twitter:card",
      "summary_large_image"
    );
    updateMetaTag(
      'meta[name="twitter:title"]',
      "twitter:title",
      dynamicMetadata.title
    );
    updateMetaTag(
      'meta[name="twitter:description"]',
      "twitter:description",
      dynamicMetadata.description
    );
    updateMetaTag(
      'meta[name="twitter:image"]',
      "twitter:image",
      dynamicMetadata.image
    );
  }, [dynamicMetadata]);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Fallback metadata for SSR */}
        <title>{defaultMetadata.title}</title>
        <meta name="description" content={defaultMetadata.description} />
        <meta property="og:title" content={defaultMetadata.title} />
        <meta property="og:description" content={defaultMetadata.description} />
        <meta property="og:image" content={defaultMetadata.image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultMetadata.title} />
        <meta
          name="twitter:description"
          content={defaultMetadata.description}
        />
        <meta name="twitter:image" content={defaultMetadata.image} />

        <link rel="icon" href="/favicon.ico" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}
      >
        {children}
        <Toaster position="top-center" richColors duration={5000} />
      </body>
    </html>
  );
}
