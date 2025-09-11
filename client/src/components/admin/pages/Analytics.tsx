"use client";

import React from "react";
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

const Analytics = () => {
  const quizResults = [
    { name: "Heaven", value: 45, color: "#22c55e" },
    { name: "Hell", value: 25, color: "#ef4444" },
    { name: "In-Between", value: 30, color: "#f59e0b" },
  ];

  const monthlyData = [
    { month: "Jan", users: 1200, quizzes: 800 },
    { month: "Feb", users: 1500, quizzes: 1100 },
    { month: "Mar", users: 1800, quizzes: 1400 },
    { month: "Apr", users: 2200, quizzes: 1800 },
    { month: "May", users: 2800, quizzes: 2400 },
  ];

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
            <CardTitle className="text-sm text-gray-600">
              Total Quiz Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15,847</div>
            <p className="text-green-600 text-sm">+18% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">68.5</div>
            <p className="text-blue-600 text-sm">+2.3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">84%</div>
            <p className="text-green-600 text-sm">+5% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Share Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32%</div>
            <p className="text-orange-600 text-sm">+12% this month</p>
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
                  label={({ name, value }) => `${name}: ${value}%`}
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

        {/* Monthly Growth */}
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
          <CardTitle>Popular Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">How often do you help others?</p>
                <p className="text-sm text-gray-600">Answered 2,847 times</p>
              </div>
              <div className="text-right">
                <p className="font-medium">92%</p>
                <p className="text-sm text-gray-600">completion rate</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">How do you respond when wronged?</p>
                <p className="text-sm text-gray-600">Answered 2,654 times</p>
              </div>
              <div className="text-right">
                <p className="font-medium">89%</p>
                <p className="text-sm text-gray-600">completion rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Analytics };
