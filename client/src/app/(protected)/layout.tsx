"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Set mounted state to prevent SSR/Prerender mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/v1/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          router.replace("/auth/login");
          return;
        }

        const data = await res.json();
        const role = data?.user?.role || data?.data?.user?.role;

        if (role !== "admin") {
          // Use window check for alert to be safe
          if (typeof window !== "undefined") {
            alert("You don't have admin privileges");
          }
          router.replace("/");
          return;
        }
      } catch (error) {
        // Ensure we aren't rendering the error object anywhere
        console.error("Auth check failed:", error);
        router.replace("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, isMounted]);

  // Prevent rendering anything during the server-side prerender phase
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return <>{children}</>;
}
