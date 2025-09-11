"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  BarChart3,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Questions", href: "/admin/questions", icon: HelpCircle },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-purple-700 text-white flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-purple-700 font-bold">⚡</span>
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? "bg-purple-800 text-white"
                  : "text-purple-100 hover:bg-purple-600 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export { Sidebar };
