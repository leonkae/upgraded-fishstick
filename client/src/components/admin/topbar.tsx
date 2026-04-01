// src/components/admin/topbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import { LogOut, User } from "lucide-react";

const Topbar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call backend logout first
      await fetch("http://localhost:3005/api/v1/auth/logout", {
        method: "DELETE",
        credentials: "include",
      });

      // Then clear local state
      logout();

      // Force hard redirect to login
      router.replace("/auth/login");

      // Optional: Force page reload to clear any cached state
      // window.location.href = '/auth/login';
    } catch (error) {
      console.error("Logout failed", error);
      // Fallback
      logout();
      router.replace("/auth/login");
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background shadow-sm">
      <h1 className="text-secondary-text text-lg font-extrabold">
        Welcome back, Admin
      </h1>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/profile")}
        >
          <User className="w-5 h-5" />
        </Button>

        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export { Topbar };
