"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ListChecks,
  BarChart2,
  CreditCard,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Questions", icon: ListChecks, href: "/admin/questions" },
  { label: "Analytics", icon: BarChart2, href: "/admin/analytics" },
  { label: "Payments", icon: CreditCard, href: "/admin/payments" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-background-secondary border-r p-4 hidden md:block">
      <h2 className="text-xl font-semibold mb-6">⭐ Admin Panel</h2>
      <nav className="space-y-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-5 px-3 py-2 rounded-lg hover:bg-muted transition",
                active
                  ? "bg-background-button text-primary font-medium"
                  : "text-muted-foreground bg-background-tertiary hover:bg-background-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export { Sidebar };
