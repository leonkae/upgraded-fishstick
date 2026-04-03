"use client";

import React, { useEffect, useState } from "react";
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
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  LucideIcon,
} from "lucide-react";

// --- Types & Interfaces ---
interface PaymentMetadata {
  email?: string;
  method?: string;
  channel?: string;
  [key: string]: unknown;
}

interface PaymentError {
  message: string;
}

interface PaymentRecord {
  reference: string;
  email: string;
  amount: number | string;
  metadata?: PaymentMetadata;
  timestamp?: string;
}

interface Transaction {
  id: string;
  user: string;
  amount: string;
  method: string;
  status: string;
  date: string;
}

interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

// --- Helper Functions ---
const formatAmount = (raw: number | string) => {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (Number.isNaN(n) || n == null) return "KES 0.00";
  // If your API sends cents/kobo, keep the /100. If it sends full KES, remove it.
  const units = n / 100;
  return `KES ${units.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

export const Payments: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // FIXED: State moved inside component and properly typed
  const [error, setError] = useState<string | PaymentError | null>(null);

  useEffect(() => {
    setIsMounted(true);
    let mounted = true;

    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost:3005/api/v1/payment/all`;
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const json = await res.json();

        // Defensive check for data structure
        const rawPayments: PaymentRecord[] = Array.isArray(json.payments)
          ? json.payments
          : Array.isArray(json)
            ? json
            : [];

        if (!mounted) return;

        // Map transactions
        const txs: Transaction[] = rawPayments.map((p) => ({
          id: p.reference ?? `ref-${Math.random().toString(36).slice(2, 9)}`,
          user: p.email ?? p.metadata?.email ?? "Unknown User",
          amount: formatAmount(p.amount),
          method: p.metadata?.method ?? p.metadata?.channel ?? "Other",
          status: "Completed",
          date: p.timestamp ? new Date(p.timestamp).toLocaleString() : "N/A",
        }));

        setTransactions(txs);

        // Calculate Stats
        const totalRaw = rawPayments.reduce((s, p) => {
          const val =
            typeof p.amount === "string" ? Number(p.amount) : p.amount;
          return s + (Number.isFinite(val) ? Number(val) : 0);
        }, 0);

        const totalRevenue = totalRaw / 100;
        const avgDonation = rawPayments.length
          ? totalRevenue / rawPayments.length
          : 0;
        const uniqueUsers = new Set(
          rawPayments.map((p) =>
            (p.email ?? p.metadata?.email ?? "anon").toLowerCase()
          )
        ).size;

        setStats([
          {
            title: "Total Revenue",
            value: `KES ${totalRevenue.toFixed(2)}`,
            change: "Live",
            icon: DollarSign,
          },
          {
            title: "Average Donation",
            value: `KES ${avgDonation.toFixed(2)}`,
            change: "Live",
            icon: TrendingUp,
          },
          {
            title: "Total Transactions",
            value: String(rawPayments.length),
            change: "Live",
            icon: CreditCard,
          },
          {
            title: "Paying Users",
            value: String(uniqueUsers),
            change: "Live",
            icon: Users,
          },
        ]);
      } catch (err) {
        // FIXED: Proper typing instead of `any`
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch payment data. Please check if the backend is running.";

        if (mounted) {
          setError(errorMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPayments();
    return () => {
      mounted = false;
    };
  }, []);

  // Hydration guard
  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-gray-500">
        Loading payment data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 border border-red-200 rounded-lg bg-red-50 m-4">
        <p className="font-bold">Unable to load payments</p>
        <p className="text-sm">
          {typeof error === "string" ? error : error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">
          Track donations and payment transactions
        </p>
      </div>

      {/* Stats Grid */}
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

      {/* Table */}
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
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-400"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs text-purple-600">
                      {t.id}
                    </TableCell>
                    <TableCell className="text-sm">{t.user}</TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {t.amount}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 uppercase">
                      {t.method}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {t.date}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
