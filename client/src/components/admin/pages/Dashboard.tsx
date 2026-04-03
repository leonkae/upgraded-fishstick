"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Star, UserPlus } from "lucide-react";

interface Activity {
  type: string;
  name: string;
  email: string;
  time: string;
  result: number;
}

interface StatData {
  totalUsers: number;
  activeUsers: number;
  newToday: number;
  recentActivity: Activity[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/v1/stats");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getResultLabel = (score: number): string => {
    if (score >= 20) return "Heaven";
    if (score >= 10) return "In-Between";
    return "Hell";
  };

  const getPremiumCount = (): number => {
    if (!stats?.recentActivity || !Array.isArray(stats.recentActivity))
      return 0;
    return stats.recentActivity.filter(
      (activity) => getResultLabel(activity.result) === "Heaven"
    ).length;
  };

  // 1. Exit early if not mounted or loading to prevent build worker from
  // trying to render the stats grid with null values.
  if (!mounted || loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-600">
        Dashboard data unavailable.
      </div>
    );
  }

  // 2. Define this AFTER the !stats check so it only runs when data is real
  const statCards = [
    {
      title: "Total Users",
      value: (stats.totalUsers ?? 0).toLocaleString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Users (7d)",
      value: (stats.activeUsers ?? 0).toLocaleString(),
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Premium Users (Heaven)",
      value: getPremiumCount().toLocaleString(),
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "New Today",
      value: (stats.newToday ?? 0).toLocaleString(),
      icon: UserPlus,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats.recentActivity || stats.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activity yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {activity.type ?? "Unknown Event"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.name ?? "User"} — {activity.email ?? "No Email"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Result: {getResultLabel(activity.result ?? 0)}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {activity.time
                      ? new Date(activity.time).toLocaleString()
                      : "No Date"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { Dashboard };
