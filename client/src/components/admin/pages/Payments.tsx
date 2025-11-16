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
import { DollarSign, TrendingUp, CreditCard, Users } from "lucide-react";

type PaymentRecord = {
  reference: string;
  email: string;
  amount: number | string; // Paystack returns amount (kobo) as number; be defensive
  metadata?: any;
  timestamp?: string;
};

const formatAmount = (raw: number | string) => {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (Number.isNaN(n) || n == null) return "-";
  // If amount looks like kobo (>= 100), divide by 100. Otherwise treat as full units.
  const units = Math.abs(n) >= 100 ? n / 100 : n;
  return `KES ${units.toFixed(2)}`;
};

const getApiBase = () => {
  // Allow overriding with NEXT_PUBLIC_API_BASE in production; fallback to relative path
  if (
    typeof process !== "undefined" &&
    (process as any).env?.NEXT_PUBLIC_API_BASE
  ) {
    return (process as any).env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && (window as any).__NEXT_PUBLIC_API_BASE) {
    return (window as any).__NEXT_PUBLIC_API_BASE.replace(/\/$/, "");
  }

  return ""; // relative
};

export const Payments: React.FC = () => {
  const [stats, setStats] = useState<Array<any>>([]);
  const [transactions, setTransactions] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE = getApiBase();
        // try common server paths. The app's backend might expose /api/payment/all or /api/v1/payment/all
        const candidates = [
          `http://localhost:3005/api/v1/payment/all`, // PRIMARY EXPECTED ROUTE
          `http://localhost:3005/api/v1/payment/all`,
          `http://localhost:3005/api/v1/payment/all`,
          `http://localhost:3005/api/v1/payment/all`,
        ];

        let data: { payments?: PaymentRecord[] } | null = null;
        let lastErr: any = null;

        for (const url of candidates) {
          try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) {
              lastErr = new Error(`HTTP ${res.status} from ${url}`);
              continue;
            }

            const json = await res.json();
            if (json && Array.isArray(json.payments)) {
              data = json;
              break;
            }

            // Some implementations might return payments directly
            if (json && Array.isArray(json)) {
              data = { payments: json };
              break;
            }

            lastErr = new Error(`Unexpected response shape from ${url}`);
          } catch (err) {
            lastErr = err;
            continue;
          }
        }

        if (!data) throw lastErr || new Error("No payment endpoint found");

        if (!mounted) return;

        const payments = data.payments || [];

        // Normalize transactions for the table
        const txs = payments.map((p) => ({
          id:
            p.reference ??
            p.reference ??
            `ref-${Math.random().toString(36).slice(2, 9)}`,
          user: p.email ?? p.metadata?.email ?? "Unknown",
          amount: formatAmount(p.amount),
          method: p.metadata?.method ?? p.metadata?.channel ?? "Unknown",
          status: "Completed",
          date: p.timestamp ? new Date(p.timestamp).toLocaleString() : "-",
        }));

        setTransactions(txs);

        const totalKobo = payments.reduce((s, p) => {
          const val =
            typeof p.amount === "string" ? Number(p.amount) : p.amount;
          return s + (Number.isFinite(val) ? Number(val) : 0);
        }, 0);

        const totalRevenue = totalKobo / 100;
        const avgDonation = payments.length
          ? totalRevenue / payments.length
          : 0;
        const uniqueUsers = new Set(
          payments.map((p) =>
            (p.email ?? p.metadata?.email ?? "").toLowerCase()
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
            value: String(payments.length),
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
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(String(err.message ?? err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPayments();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading payments…</p>;
  if (error)
    return <p className="text-red-600">Error loading payments: {error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">
          Track donations and payment transactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                {Icon ? <Icon className="h-4 w-4 text-green-600" /> : null}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
                  <TableCell colSpan={6} className="text-center py-6">
                    No transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-sm">{t.id}</TableCell>
                    <TableCell>{t.user}</TableCell>
                    <TableCell className="font-medium">{t.amount}</TableCell>
                    <TableCell>{t.method}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          t.status === "Completed" ? "default" : "secondary"
                        }
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{t.date}</TableCell>
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
