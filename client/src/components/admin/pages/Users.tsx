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
import {
  Users as UsersIcon,
  Search,
  MoreHorizontal,
  AlertCircle,
  Download,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  result: number;
  time: string; // ISO string from backend
  ageRange?: string;
  wantsDiscipleship?: boolean | null;
}

interface RawActivityData {
  name: string;
  email: string;
  result: number;
  time: string | Date;
  ageRange?: string;
  wantsDiscipleship?: boolean | null;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    newToday: 0,
    retakeDue: 0,
  });
  const [changes, setChanges] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    newToday: 0,
    retakeDue: 0,
  });

  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<
    null | "total" | "active" | "premium" | "newToday" | "retakeDue"
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3005/api/v1/stats?page=${page}&limit=${limit}`
        );
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "API error");
        const data = json.data;

        const recentActivity = (data.recentActivity || []).map(
          (r: RawActivityData) => ({
            ...r,
            time: new Date(r.time),
          })
        );

        // ────────────────────────────────────────────────
        // Date range helpers
        // ────────────────────────────────────────────────
        const startOfDay = (d: Date) => {
          const x = new Date(d);
          x.setHours(0, 0, 0, 0);
          return x;
        };

        const daysAgo = (d: Date, days: number) => {
          const x = new Date(d);
          x.setDate(x.getDate() - days);
          return x;
        };

        const inRange = (t: Date, start: Date, end: Date) =>
          t >= start && t < end;

        const uniqueEmailsInRange = (
          arr: { email: string; time: Date }[],
          start: Date,
          end: Date
        ) => {
          const set = new Set<string>();
          for (const a of arr) {
            if (inRange(a.time, start, end)) set.add(a.email);
          }
          return set.size;
        };

        const countEntriesInRange = (
          arr: { time: Date }[],
          start: Date,
          end: Date
        ) => arr.reduce((c, a) => (inRange(a.time, start, end) ? c + 1 : c), 0);

        const countHeavenInRange = (
          arr: { result: number; time: Date }[],
          start: Date,
          end: Date
        ) =>
          arr.reduce(
            (c, a) =>
              inRange(a.time, start, end) && a.result >= 20 ? c + 1 : c,
            0
          );

        const now = new Date();
        const todayStart = startOfDay(now);
        const yesterdayStart = startOfDay(daysAgo(now, 1));
        const last7Start = startOfDay(daysAgo(now, 6));
        const prev7Start = startOfDay(daysAgo(now, 13));
        const prev7End = last7Start;

        // ────────────────────────────────────────────────
        // Core stats
        // ────────────────────────────────────────────────
        const currentTotalUsers = data.totalUsers ?? 0;
        const currentActiveUsers = data.activeUsers ?? 0;
        const currentNewToday = data.newToday ?? 0;
        const currentPremium = countHeavenInRange(
          recentActivity,
          last7Start,
          now
        );

        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const RETAKE_DAYS = 91;
        const retakeDueCount = recentActivity.filter((a: { time: Date }) => {
          if (!a.time) return false;
          const diffDays = Math.floor(
            (now.getTime() - a.time.getTime()) / MS_PER_DAY
          );
          return diffDays > RETAKE_DAYS;
        }).length;

        // ────────────────────────────────────────────────
        // Change calculations
        // ────────────────────────────────────────────────
        const pctChange = (nowVal: number, prevVal: number) => {
          if (prevVal === 0) return nowVal === 0 ? 0 : 100;
          return ((nowVal - prevVal) / prevVal) * 100;
        };

        const newUsersLast7 = uniqueEmailsInRange(
          recentActivity,
          last7Start,
          now
        );
        const newUsersPrev7 = uniqueEmailsInRange(
          recentActivity,
          prev7Start,
          prev7End
        );
        const activeLast7 = uniqueEmailsInRange(
          recentActivity,
          last7Start,
          now
        );
        const activePrev7 = uniqueEmailsInRange(
          recentActivity,
          prev7Start,
          prev7End
        );
        const premiumLast7 = countHeavenInRange(
          recentActivity,
          last7Start,
          now
        );
        const premiumPrev7 = countHeavenInRange(
          recentActivity,
          prev7Start,
          prev7End
        );
        const newTodayCount = countEntriesInRange(
          recentActivity,
          todayStart,
          now
        );
        const newYesterdayCount = countEntriesInRange(
          recentActivity,
          yesterdayStart,
          todayStart
        );

        setStats({
          totalUsers: currentTotalUsers,
          activeUsers: currentActiveUsers,
          premiumUsers: currentPremium,
          newToday: currentNewToday,
          retakeDue: retakeDueCount,
        });

        setChanges({
          totalUsers: pctChange(newUsersLast7, newUsersPrev7),
          activeUsers: pctChange(activeLast7, activePrev7),
          premiumUsers: pctChange(premiumLast7, premiumPrev7),
          newToday: pctChange(newTodayCount, newYesterdayCount),
          retakeDue: 0,
        });

        // Table data
        const formattedUsers = recentActivity.map((u: RawActivityData) => ({
          name: u.name,
          email: u.email,
          result: u.result,
          time: u.time instanceof Date ? u.time.toISOString() : u.time,
          ageRange: u.ageRange,
          wantsDiscipleship: u.wantsDiscipleship,
        }));
        setUsers(formattedUsers);

        setTotalPages(Math.ceil((data.totalCount || 1) / limit));
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchData();
  }, [page]);

  // ────────────────────────────────────────────────
  // Helper functions
  // ────────────────────────────────────────────────
  const calculateResult = (score: number) => {
    if (score >= 20) return "Heaven";
    if (score >= 10) return "In-Between";
    return "Hell";
  };

  const isActive = (time: string) => {
    const now = new Date();
    const last = new Date(time);
    const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const RETAKE_DAYS = 91;
  const WARNING_DAYS_LEFT = 14;

  const getRetakeStatus = (timeStr: string) => {
    if (!timeStr) {
      return {
        text: "Never taken",
        variant: "destructive" as const,
        icon: true,
      };
    }

    const lastQuiz = new Date(timeStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - lastQuiz.getTime()) / MS_PER_DAY
    );

    if (diffDays > RETAKE_DAYS) {
      const overdueBy = diffDays - RETAKE_DAYS;
      return {
        text: `Overdue by ${overdueBy} day${overdueBy === 1 ? "" : "s"}`,
        variant: "destructive" as const,
        icon: true,
      };
    }

    const daysLeft = RETAKE_DAYS - diffDays;

    if (daysLeft <= 0) {
      return {
        text: "Retake due today",
        variant: "destructive" as const,
        icon: true,
      };
    }

    if (daysLeft <= WARNING_DAYS_LEFT) {
      return {
        text: `Retake in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
        variant: "secondary" as const,
        className: "bg-orange-100 text-orange-800 border-orange-300",
        icon: false,
      };
    }

    return {
      text: `Up to date (${daysLeft} days left)`,
      variant: "outline" as const,
      icon: false,
    };
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        "http://localhost:3005/api/v1/stats/export-users"
      );
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Could not download export");
    }
  };

  // ────────────────────────────────────────────────
  // Filter logic
  // ────────────────────────────────────────────────
  const displayedUsers = activeFilter
    ? users.filter((user) => {
        if (activeFilter === "total") return true;
        if (activeFilter === "active") return isActive(user.time);
        if (activeFilter === "premium")
          return calculateResult(user.result) === "Heaven";
        if (activeFilter === "newToday") {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          return new Date(user.time) >= todayStart;
        }
        if (activeFilter === "retakeDue") {
          const status = getRetakeStatus(user.time);
          return status.variant === "destructive";
        }
        return true;
      })
    : users;

  type FilterType = "total" | "active" | "premium" | "newToday" | "retakeDue";

  const statCards: {
    key: FilterType;
    title: string;
    value: string;
    change: number;
    period: string;
    icon: typeof UsersIcon;
    color?: string;
  }[] = [
    {
      key: "total",
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: changes.totalUsers,
      period: "last 7 days",
      icon: UsersIcon,
    },
    {
      key: "active",
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: changes.activeUsers,
      period: "last 7 days",
      icon: UsersIcon,
    },
    {
      key: "premium",
      title: "Premium Users",
      value: stats.premiumUsers.toLocaleString(),
      change: changes.premiumUsers,
      period: "last 7 days",
      icon: UsersIcon,
    },
    {
      key: "newToday",
      title: "New Today",
      value: stats.newToday.toLocaleString(),
      change: changes.newToday,
      period: "today",
      icon: UsersIcon,
    },
    {
      key: "retakeDue",
      title: "Retake Due",
      value: stats.retakeDue.toLocaleString(),
      change: changes.retakeDue,
      period: "overdue",
      icon: AlertCircle,
      color: stats.retakeDue > 0 ? "text-red-600" : "text-gray-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage user accounts</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative max-w-md w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search users..." className="pl-10" />
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="gap-2 whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          Export All Users (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat) => {
          const isPositive = stat.change >= 0;
          const isActiveFilter = activeFilter === stat.key;

          return (
            <Card
              key={stat.key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isActiveFilter ? "ring-2 ring-purple-500 shadow-md" : ""
              }`}
              onClick={() =>
                setActiveFilter(activeFilter === stat.key ? null : stat.key)
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className={`h-4 w-4 ${stat.color || "text-purple-600"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
                >
                  {isPositive ? "+" : ""}
                  {stat.change.toFixed(1)}% {stat.period}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          {activeFilter && (
            <div className="mb-4 flex items-center justify-between bg-purple-50 p-3 rounded-md">
              <div className="text-sm font-medium">
                Showing:{" "}
                <span className="text-purple-700 font-semibold">
                  {statCards.find((s) => s.key === activeFilter)?.title ||
                    activeFilter}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilter(null)}
              >
                Clear filter
              </Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Age Range</TableHead>
                <TableHead>Discipleship Interest</TableHead>

                <TableHead>Quiz Score</TableHead>
                <TableHead>Quiz Result</TableHead>
                <TableHead>Retake</TableHead>
                <TableHead>Last Quiz</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        👤
                      </div>
                      <span className="font-medium">
                        {String(user.name || "Unknown User")}
                      </span>
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
                  <TableCell>
                    <Badge variant="secondary">{user.ageRange || "—"}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.wantsDiscipleship === true ? (
                      <Badge className="bg-green-600 hover:bg-green-700 text-white">
                        Yes
                      </Badge>
                    ) : user.wantsDiscipleship === false ? (
                      <Badge variant="destructive">No</Badge>
                    ) : (
                      <Badge variant="secondary">—</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.result}</TableCell>
                  <TableCell>{calculateResult(user.result)}</TableCell>
                  <TableCell>
                    {(() => {
                      const status = getRetakeStatus(user.time);
                      return (
                        <Badge
                          variant={status.variant}
                          className={`flex items-center gap-1 ${status.className || ""}`}
                        >
                          {status.icon && (
                            <AlertCircle className="h-3.5 w-3.5" />
                          )}
                          {status.text}
                        </Badge>
                      );
                    })()}
                  </TableCell>
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

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {displayedUsers.length} of {users.length} entries
              {activeFilter && " (filtered)"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              {Array.from(
                { length: Math.min(totalPages, 3) },
                (_, i) => i + 1
              ).map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(num)}
                  className={page === num ? "bg-purple-700 text-white" : ""}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPages}
              >
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
