"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const defaultMetadata = {
  title: "The Future of Man",
  description: "A fun and introspective quiz.",
  image: "https://images.pexels.com/photos/3776808/pexels-photo-3776808.jpeg",
};

export function DynamicMetadataProvider() {
  const [dynamicMetadata, setDynamicMetadata] = useState(defaultMetadata);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:3005/api/v1/settings");

        // CRITICAL: Strict check to ensure we only use strings
        if (res.data?.success && res.data?.data) {
          const { appName, appDescription, shareImage } = res.data.data;

          setDynamicMetadata({
            title:
              typeof appName === "string" ? appName : defaultMetadata.title,
            description:
              typeof appDescription === "string"
                ? appDescription
                : defaultMetadata.description,
            image:
              typeof shareImage === "string"
                ? shareImage
                : defaultMetadata.image,
          });
        }
      } catch {
        // If API fails, we do nothing and keep defaultMetadata strings
        console.warn("Metadata API failed, using defaults.");
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    // Standard browser check
    if (typeof document === "undefined") return;

    document.title = String(dynamicMetadata.title);

    const updateMeta = (
      nameOrProperty: string,
      content: string,
      isProperty = false
    ) => {
      if (!content) return;
      const selector = isProperty
        ? `meta[property="${nameOrProperty}"]`
        : `meta[name="${nameOrProperty}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(isProperty ? "property" : "name", nameOrProperty);
        document.head.appendChild(el);
      }
      el.setAttribute("content", String(content));
    };

    updateMeta("description", dynamicMetadata.description);
    updateMeta("og:title", dynamicMetadata.title, true);
    updateMeta("og:description", dynamicMetadata.description, true);
    updateMeta("og:image", dynamicMetadata.image, true);
  }, [dynamicMetadata]);

  return null;
}
