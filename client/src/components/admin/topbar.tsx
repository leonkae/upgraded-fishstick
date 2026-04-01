// src/components/admin/topbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import { LogOut, User } from "lucide-react";

const Topbar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background shadow-sm mr-5">
      <h1 className="text-secondary-text text-lg font-extrabold">
        Welcome back, Admin
      </h1>

      <div className="flex items-center gap-2">
        {/* Profile Icon Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/profile")}
          aria-label="Go to profile"
        >
          <User className="w-5 h-5" />
        </Button>

        {/* Logout Button */}
        <Button variant="outline" aria-label="Logout" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export { Topbar };
