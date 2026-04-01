"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Copy, ArrowLeft, Phone, Building2 } from "lucide-react";

export default function DonationDetails() {
  const searchParams = useSearchParams();
  const responseId = searchParams.get("responseId");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-10">
            <Heart className="h-10 w-10 text-orange-400" />
            <h1 className="text-4xl font-bold font-serif">
              Support The Fireplace Code
            </h1>
          </div>

          <p className="text-gray-300 text-lg mb-10">
            Thank you for your desire to support this ministry. You can donate
            using any of the methods below.
          </p>

          {/* M-PESA Paybill */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="h-6 w-6 text-green-400" />
              <h3 className="text-2xl font-semibold">M-PESA Paybill</h3>
            </div>
            <div className="bg-black/30 rounded-2xl p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">PAYBILL NUMBER</p>
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                  <span className="text-3xl font-mono font-bold tracking-wider">
                    247247
                  </span>
                  <Button
                    onClick={() => copyToClipboard("247247", "Paybill")}
                    variant="ghost"
                    size="sm"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">ACCOUNT NUMBER</p>
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                  <span className="text-3xl font-mono font-bold tracking-wider">
                    0728899980
                  </span>
                  <Button
                    onClick={() =>
                      copyToClipboard("0728899980", "Account Number")
                    }
                    variant="ghost"
                    size="sm"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">TILL NUMBER</p>
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                  <span className="text-3xl font-mono font-bold tracking-wider">
                    3646130
                  </span>
                  <Button
                    onClick={() => copyToClipboard("3646130", "Till Number")}
                    variant="ghost"
                    size="sm"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400 mt-3">
              Account Name: The Fireplace Code
            </p>
          </div>

          {/* Bank Transfer */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-6 w-6 text-blue-400" />
              <h3 className="text-2xl font-semibold">
                Bank Transfer (Equity Bank)
              </h3>
            </div>
            <div className="bg-black/30 rounded-2xl p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">BANK</p>
                <p className="text-xl">Equity Bank</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">ACCOUNT NAME</p>
                <p className="text-xl font-medium">The Fireplace Code</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">ACCOUNT NUMBER</p>
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                  <span className="text-3xl font-mono font-bold tracking-wider">
                    1450183758661
                  </span>
                  <Button
                    onClick={() =>
                      copyToClipboard("1450183758661", "Account Number")
                    }
                    variant="ghost"
                    size="sm"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 text-sm">
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

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10 h-12"
            >
              ← Back
            </Button>
            <Button
              onClick={() => (window.location.href = "/quiz/result")}
              className="flex-1 bg-orange-500 hover:bg-orange-600 h-12 text-lg font-semibold"
            >
              I Have Sent My Donation
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            After making your donation, click the button above so we can prepare
            your results.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
