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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/v1/stats");
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

  if (loading) {
    return <p className="text-gray-500 text-center">Loading analytics...</p>;
  }

  if (!stats) {
    return <p className="text-red-500 text-center">Failed to load data.</p>;
  }

  // Pie chart data
  const heavenCount = stats.recentActivity.filter((a) => a.result >= 20).length;
  const hellCount = stats.recentActivity.filter((a) => a.result <= 10).length;
  const inBetweenCount = stats.recentActivity.length - heavenCount - hellCount;

  const quizResults = [
    { name: "Heaven", value: heavenCount, color: "#22c55e" },
    { name: "Hell", value: hellCount, color: "#ef4444" },
    { name: "In-Between", value: inBetweenCount, color: "#f59e0b" },
  ];

  // Generate monthly chart data dynamically
  const activityByMonth: Record<string, { users: number; quizzes: number }> =
    {};

  stats.recentActivity.forEach((activity) => {
    const date = new Date(activity.time);
    const month = date.toLocaleString("default", { month: "short" });
    if (!activityByMonth[month]) {
      activityByMonth[month] = { users: 0, quizzes: 0 };
    }
    // Each record represents a quiz completion by a user (same data source)
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
        <p className="text-gray-600 mt-2">
          Track your quiz performance and user engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-green-600 text-sm">
              +
              {stats.newToday > 0
                ? ((stats.newToday / stats.totalUsers) * 100).toFixed(1)
                : "0.0"}
              % today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeUsers}</div>
            <p className="text-blue-600 text-sm">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
              active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              New Users Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newToday}</div>
            <p className="text-green-600 text-sm">+{stats.newToday}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Recent Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.recentActivity.length}
            </div>
            <p className="text-orange-600 text-sm">
              Latest:{" "}
              {new Date(stats.recentActivity[0]?.time).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Results Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
          </CardContent>
        </Card>

        {/*  Monthly Growth (Dynamic) */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#7c3aed" name="New Users" />
                <Bar dataKey="quizzes" fill="#a855f7" name="Quiz Completions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{activity.name}</p>
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
                    {new Date(activity.time).toLocaleString()}
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
