"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Phone, Building2 } from "lucide-react";

export default function DonationDetailsPage() {
  const searchParams = useSearchParams();
  const responseId = searchParams.get("responseId");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 text-white p-2">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-5 md:p-6 border border-white/10 shadow-2xl relative"
        >
          {/* Banner */}
          <div className="absolute -top-2 right-4 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full">
            Thank You for Your Support!
          </div>

          {/* Header */}
          <div className="mb-3">
            <h1 className="text-xl md:text-2xl font-bold font-serif tracking-tight">
              Support The Fireplace Code
            </h1>
            <p className="text-orange-300 text-xs mt-1">
              Your gift is appreciated but completely optional
            </p>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            If you feel led to support this ministry, you may donate using the
            methods below. There is <strong>no pressure</strong> — you can skip
            this step anytime.
          </p>

          {/* M-PESA */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold">M-PESA</h3>
            </div>

            <div className="space-y-3 bg-black/40 rounded-xl p-3">
              {[
                { label: "PAYBILL NUMBER", value: "247247" },
                { label: "ACCOUNT NUMBER", value: "0728899980" },
                { label: "TILL NUMBER", value: "3646130" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    {item.label}
                  </p>
                  <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2.5">
                    <span className="text-base font-mono font-bold">
                      {item.value}
                    </span>
                    <Button
                      onClick={() => copyToClipboard(item.value, item.label)}
                      variant="ghost"
                      size="icon"
                      className="text-orange-400 hover:text-orange-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-2">
              Account Name: The Fireplace Code
            </p>
          </div>

          {/* Bank */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold">Equity Bank Transfer</h3>
            </div>

            <div className="bg-black/40 rounded-xl p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-400">Account Name</p>
                <p className="text-base font-medium">The Fireplace Code</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Account Number</p>
                <div className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2.5">
                  <span className="text-base font-mono font-bold">
                    1450183758661
                  </span>
                  <Button
                    onClick={() =>
                      copyToClipboard("1450183758661", "Account Number")
                    }
                    variant="ghost"
                    size="icon"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <p className="text-gray-400">Bank Code</p>
                  <p className="font-mono">068</p>
                </div>
                <div>
                  <p className="text-gray-400">Branch Code</p>
                  <p className="font-mono">145</p>
                </div>
                <div>
                  <p className="text-gray-400">Swift Code</p>
                  <p className="font-mono">EQBLKENYA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1 h-12 border-white/30 hover:bg-white/10 text-white text-sm"
            >
              ← Back
            </Button>

            <Button
              onClick={() => (window.location.href = "/quiz")}
              className="flex-1 h-12 bg-white text-purple-950 hover:bg-gray-100 font-semibold text-sm"
            >
              Skip & View My Results
            </Button>
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-5">
            No minimum amount • No obligation • Thank you for taking the
            assessment
          </p>
        </motion.div>
      </div>
    </div>
  );
}
