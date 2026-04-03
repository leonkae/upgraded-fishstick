"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Interfaces stay the same...
interface RecentActivity {
  type: string;
  name: string;
  email: string;
  time: string;
  result: number;
}

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  newToday: number;
  recentActivity: RecentActivity[];
}

const Analytics = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchStats = async () => {
      try {
        // Safe check: localhost might not be reachable during build
        const res = await fetch("http://localhost:3005/api/v1/stats");
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 1. Don't render anything meaningful until the component is mounted in the browser
  if (!isMounted || loading) {
    return (
      <p className="text-gray-500 text-center p-10">Loading analytics...</p>
    );
  }

  // 2. Safe check for stats existence with a cleaner fallback
  if (!stats || !stats.recentActivity) {
    return (
      <p className="text-gray-500 text-center p-10">Waiting for data...</p>
    );
  }

  // Data processing with fallbacks
  const recentActivity = stats.recentActivity || [];
  const heavenCount = recentActivity.filter((a) => a.result >= 20).length;
  const hellCount = recentActivity.filter((a) => a.result <= 10).length;
  const inBetweenCount = Math.max(
    0,
    recentActivity.length - heavenCount - hellCount
  );

  const quizResults = [
    { name: "Heaven", value: heavenCount, color: "#22c55e" },
    { name: "Hell", value: hellCount, color: "#ef4444" },
    { name: "In-Between", value: inBetweenCount, color: "#f59e0b" },
  ];

  const activityByMonth: Record<string, { users: number; quizzes: number }> =
    {};
  recentActivity.forEach((activity) => {
    if (!activity.time) return;
    const date = new Date(activity.time);
    const month = date.toLocaleString("default", { month: "short" });
    if (!activityByMonth[month]) {
      activityByMonth[month] = { users: 0, quizzes: 0 };
    }
    activityByMonth[month].users += 1;
    activityByMonth[month].quizzes += 1;
  });

  const monthlyData = Object.keys(activityByMonth).map((month) => ({
    month,
    users: activityByMonth[month].users,
    quizzes: activityByMonth[month].quizzes,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track performance and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers || 0}</div>
            <p className="text-green-600 text-sm">
              {stats.totalUsers > 0
                ? ((stats.newToday / stats.totalUsers) * 100).toFixed(1)
                : "0.0"}
              % today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Recent Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recentActivity.length}</div>
            <p className="text-orange-600 text-sm">
              Latest:{" "}
              {recentActivity[0]?.time
                ? new Date(recentActivity[0].time).toLocaleDateString()
                : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quizResults}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {quizResults.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#7c3aed" name="New Users" />
                  <Bar
                    dataKey="quizzes"
                    fill="#a855f7"
                    name="Quiz Completions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{activity.name || "Unknown"}</p>
                  <p className="text-sm text-gray-600">
                    {activity.email} • {activity.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {activity.result >= 20
                      ? "Heaven"
                      : activity.result <= 10
                        ? "Hell"
                        : "In-Between"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.time
                      ? new Date(activity.time).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Analytics };
