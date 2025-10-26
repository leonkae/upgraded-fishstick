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

// Default metadata as fallback
const defaultMetadata = {
  title: "The Future of Man",
  description:
    "A fun and introspective quiz to help you discover your destiny: Heaven, Hell, or In-Between.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State to store dynamic metadata
  const [dynamicMetadata, setDynamicMetadata] = useState({
    title: defaultMetadata.title,
    description: defaultMetadata.description,
  });

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:3005/api/v1/settings");
        console.log("Backend response:", res.data.data); // Debug log
        if (res.data?.success && res.data?.data) {
          setDynamicMetadata((prev) => ({
            ...prev,
            title: res.data.data.appName ?? prev.title,
            description: res.data.data.appDescription ?? prev.description,
          }));
        }
      } catch (err) {
        console.log("No existing settings found, using defaults.", err);
        // Keep defaultMetadata as fallback
      }
    };
    fetchSettings();
  }, []);

  // Update <head> metadata dynamically
  useEffect(() => {
    // Update document title
    document.title = dynamicMetadata.title;

    // Update meta description
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute("content", dynamicMetadata.description);

    // Update Open Graph title
    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (!ogTitleMeta) {
      ogTitleMeta = document.createElement("meta");
      ogTitleMeta.setAttribute("property", "og:title");
      document.head.appendChild(ogTitleMeta);
    }
    ogTitleMeta.setAttribute("content", dynamicMetadata.title);

    // Update Open Graph description
    let ogDescriptionMeta = document.querySelector(
      'meta[property="og:description"]'
    );
    if (!ogDescriptionMeta) {
      ogDescriptionMeta = document.createElement("meta");
      ogDescriptionMeta.setAttribute("property", "og:description");
      document.head.appendChild(ogDescriptionMeta);
    }
    ogDescriptionMeta.setAttribute("content", dynamicMetadata.description);
  }, [dynamicMetadata]);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Initial metadata as placeholders for SSR/SSG */}
        <title>{defaultMetadata.title}</title>
        <meta name="description" content={defaultMetadata.description} />
        <meta property="og:title" content={defaultMetadata.title} />
        <meta property="og:description" content={defaultMetadata.description} />
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
