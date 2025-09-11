"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, TrendingUp, CreditCard, Users } from "lucide-react";

const Payments = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$15,847",
      change: "+18% this month",
      icon: DollarSign,
    },
    {
      title: "Average Donation",
      value: "$12.50",
      change: "+5% this month",
      icon: TrendingUp,
    },
    {
      title: "Total Transactions",
      value: "1,268",
      change: "+12% this month",
      icon: CreditCard,
    },
    {
      title: "Paying Users",
      value: "892",
      change: "+15% this month",
      icon: Users,
    },
  ];

  const transactions = [
    {
      id: "TXN-001",
      user: "Sarah Johnson",
      amount: "$10.00",
      method: "Credit Card",
      status: "Completed",
      date: "May 15, 2025",
    },
    {
      id: "TXN-002",
      user: "Michael Chen",
      amount: "$25.00",
      method: "PayPal",
      status: "Completed",
      date: "May 15, 2025",
    },
    {
      id: "TXN-003",
      user: "David Wilson",
      amount: "$5.00",
      method: "Credit Card",
      status: "Pending",
      date: "May 15, 2025",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">
          Track donations and payment transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.user}</TableCell>
                  <TableCell className="font-medium">
                    {transaction.amount}
                  </TableCell>
                  <TableCell>{transaction.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "Completed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Methods Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Credit Card</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>PayPal</span>
                <span className="font-medium">24%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>M-Pesa</span>
                <span className="font-medium">8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span>🛠️</span>
                </div>
                <div>
                  <p className="font-medium">Support Development</p>
                  <p className="text-sm text-gray-600">
                    Improve the quiz and add new features
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span>🌍</span>
                </div>
                <div>
                  <p className="font-medium">Global Impact</p>
                  <p className="text-sm text-gray-600">
                    Reach more people worldwide
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span>👥</span>
                </div>
                <div>
                  <p className="font-medium">Community Growth</p>
                  <p className="text-sm text-gray-600">
                    Foster stronger community of self-discovery
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { Payments };
