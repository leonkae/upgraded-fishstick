"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users as UsersIcon, Search, Plus, MoreHorizontal } from "lucide-react";

interface User {
  name: string;
  email: string;
  result: number;
  time: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    newToday: 0,
  });
  const [changes, setChanges] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    newToday: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/v1/stats");
        const json = await res.json();

        const data = json.data;
        const recentActivity = data.recentActivity || [];

        // Handle current stats
        const current = {
          totalUsers: data.totalUsers || 0,
          activeUsers: data.activeUsers || 0,
          premiumUsers:
            recentActivity.filter((u: any) => u.result >= 20).length || 0,
          newToday: data.newToday || 0,
        };

        // Handle past stats (fallback to same numbers if not provided)
        const past = data.lastWeek || {
          totalUsers: current.totalUsers,
          activeUsers: current.activeUsers,
          premiumUsers: current.premiumUsers,
          newToday: current.newToday,
        };

        // Calculate percentage changes
        const calcChange = (now: number, before: number) => {
          if (before === 0) return now > 0 ? 100 : 0;
          return ((now - before) / before) * 100;
        };

        const delta = {
          totalUsers: calcChange(current.totalUsers, past.totalUsers),
          activeUsers: calcChange(current.activeUsers, past.activeUsers),
          premiumUsers: calcChange(current.premiumUsers, past.premiumUsers),
          newToday: calcChange(current.newToday, past.newToday),
        };

        setStats(current);
        setChanges(delta);

        // Normalize user data
        const formattedUsers = recentActivity.map((u: any) => ({
          name: u.name,
          email: u.email,
          result: u.result,
          time: u.time,
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchData();
  }, []);

  // Heaven/Hell/In-between calculation
  const calculateResult = (score: number) => {
    if (score >= 20) return "Heaven";
    if (score >= 10) return "In-Between";
    return "Hell";
  };

  // Determine active/inactive
  const isActive = (time: string) => {
    const now = new Date();
    const last = new Date(time);
    const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: changes.totalUsers,
      period: "this week",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: changes.activeUsers,
      period: "this week",
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers.toLocaleString(),
      change: changes.premiumUsers,
      period: "this week",
    },
    {
      title: "New Today",
      value: stats.newToday.toLocaleString(),
      change: changes.newToday,
      period: "today",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage user accounts</p>
        </div>
        <Button className="bg-purple-700 hover:bg-purple-800 w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input placeholder="Search users..." className="pl-10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const isPositive = stat.change >= 0;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs mt-1 ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {stat.change.toFixed(1)}% {stat.period}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quiz Score</TableHead>
                <TableHead>Quiz Result</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        👤
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={isActive(user.time) ? "default" : "destructive"}
                    >
                      {isActive(user.time) ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.result}</TableCell>
                  <TableCell>{calculateResult(user.result)}</TableCell>
                  <TableCell>
                    {new Date(user.time).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {users.length} entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-purple-700 text-white"
              >
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Users };
