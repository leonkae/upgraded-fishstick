"use client";

import React, { useState, useEffect } from "react";
import { useQuestionnaire } from "./QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  User,
  Mail,
  Phone,
  Heart,
} from "lucide-react";

const PaymentScreen: React.FC = () => {
  const {
    setCurrentStep,
    setUserInfo,
    userInfo,
    getSubmissionPayload,
    fetchFinalResult,
  } = useQuestionnaire();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [cardNumber, setCardNumber] = useState(""); // kept but not used
  const [expiry, setExpiry] = useState(""); // kept but not used
  const [cvc, setCvc] = useState(""); // kept but not used
  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [donationAmount, setDonationAmount] = useState<number>(0); // 0 = skip

  // Keep dynamic suggested amount fetch (now used as suggestion only)
  const [suggestedAmount, setSuggestedAmount] = useState(0);

  useEffect(() => {
    setName(userInfo.name || "");
    setEmail(userInfo.email || "");
    setPhone(userInfo.phone || "");
  }, [userInfo]);

  useEffect(() => {
    const fetchPaymentAmount = async () => {
      try {
        const res = await fetch(
          "http://localhost:3005/api/v1/settings?_=" + Date.now(),
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        const data = await res.json();
        if (data?.success && data?.data?.quiz?.quizPrice) {
          setSuggestedAmount(data.data.quiz.quizPrice);
          // We no longer force it — just suggest
        } else {
          console.warn("No quizPrice found in settings");
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchPaymentAmount();
  }, []);

  const getQueryParam = (key: string) => {
    if (typeof window === "undefined") return null;
    const urlSearch = new URLSearchParams(window.location.search);
    return urlSearch.get(key);
  };

  useEffect(() => {
    const verifyReference = async (ref: string) => {
      try {
        setIsProcessing(true);
        const verifyRes = await fetch(
          `http://localhost:3005/api/v1/payment/verify/${encodeURIComponent(ref)}`,
          { method: "GET" }
        );

        if (!verifyRes.ok) {
          const err = await verifyRes.json().catch(() => ({}));
          console.error("Payment verification failed:", err);
          setIsProcessing(false);
          alert("Payment verification failed. Please contact support.");
          return;
        }

        const verificationData = await verifyRes.json();
        const lastResponseId =
          (typeof window !== "undefined" &&
            localStorage.getItem("last_response_id")) ||
          null;

        await fetchFinalResult(lastResponseId || undefined);

        setIsProcessing(false);
        setIsCompleted(true);

        setTimeout(() => {
          setCurrentStep("result");

          try {
            const url = new URL(window.location.href);
            url.search = "";
            window.history.replaceState({}, "", url.toString());
          } catch (e) {
            // ignore
          }
        }, 1000);
      } catch (err) {
        console.error("Error verifying payment:", err);
        setIsProcessing(false);
        alert("Error verifying payment. Please try again or contact support.");
      }
    };

    const stepParam = getQueryParam("step");
    const ref =
      getQueryParam("reference") ||
      getQueryParam("trxref") ||
      getQueryParam("ref");

    if (ref && (stepParam === "verify" || stepParam === null)) {
      verifyReference(ref);
    }
  }, [fetchFinalResult, setCurrentStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setUserInfo({ name, email, phone });

    const payload = {
      ...getSubmissionPayload(),
      userInfo: { name, email, phone },
    };

    try {
      // Always save the response first (so results are available even if skipping donation)
      const res = await fetch("http://localhost:3005/api/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        throw new Error("Failed to save submission");
      }

      let savedResponse: any = null;
      try {
        savedResponse = await res.json();
      } catch {
        // ignore if no json
      }

      const savedResponseId =
        savedResponse?.data?._id ||
        savedResponse?._id ||
        savedResponse?.id ||
        null;

      if (savedResponseId) {
        try {
          localStorage.setItem("last_response_id", savedResponseId);
        } catch {
          // ignore storage errors
        }
      }

      // If user entered a positive donation amount → proceed to payment
      if (donationAmount > 0) {
        const metadata = {
          response_id: savedResponseId,
        };

        const initRes = await fetch(
          "http://localhost:3005/api/v1/payment/initialize",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: donationAmount * 100, // convert to kobo/cents
              email,
              metadata,
            }),
          }
        );

        if (!initRes.ok) {
          const errData = await initRes.json().catch(() => ({}));
          console.error("Paystack initialize failed:", errData);
          // We don't throw — allow proceeding to results anyway
        } else {
          const initData = await initRes.json();

          if (initData && initData.authorization_url) {
            try {
              localStorage.setItem(
                "pending_paystack_reference",
                initData.reference || initData?.data?.reference || ""
              );
            } catch {
              // ignore
            }

            window.location.href = initData.authorization_url;
            return; // redirect to Paystack — don't continue to results yet
          }
        }
      }

      // If no donation or payment init skipped/failed → go directly to results
      setIsProcessing(false);
      setCurrentStep("result");
    } catch (error) {
      console.error("Error during submission:", error);
      setIsProcessing(false);
      // Even on error, try to let user see results
      setCurrentStep("result");
      alert("We saved your answers. You can now view your results.");
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 heaven-gradient">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 rounded-xl p-8 shadow-lg max-w-md w-full text-center"
        >
          <div className="mb-6 flex justify-center">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 font-serif">Thank You!</h2>
          <p className="text-gray-700 mb-6">
            Your support is greatly appreciated. Preparing your results...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 heaven-gradient">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 rounded-xl p-8 shadow-lg max-w-md w-full"
      >
        <div className="flex items-center justify-center mb-6">
          <Heart size={28} className="text-heaven-accent mr-2" />
          <h2 className="text-2xl font-bold font-serif">
            Submit Your Information
          </h2>
        </div>

        <p className="text-gray-700 mb-6 text-center">
          Please provide your details to receive your personalized assessment
          results.
          <span className="block mt-2 text-sm italic">
            Donation is optional — you can proceed directly to results.
            (Paystack test mode in development — no real charge)
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User size={16} /> Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone size={16} /> Phone Number
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (123) 456-7890"
                required
              />
            </div>

            {/* Donation amount field */}
            <div className="pt-4">
              <Label htmlFor="donation" className="flex items-center gap-2">
                <Heart size={16} /> Support This Ministry (Optional)
              </Label>
              <Input
                id="donation"
                type="number"
                value={donationAmount || ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDonationAmount(isNaN(val) || val < 0 ? 0 : val);
                }}
                placeholder={"Enter amount or leave blank"}
                min={0}
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Enter any amount in KES or leave as 0 to skip
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-8">
              <Button
                type="submit"
                className="w-full bg-heaven-accent hover:bg-yellow-500 text-black"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : donationAmount > 0
                    ? `Donate KES ${donationAmount.toLocaleString()} & View Results`
                    : "Proceed to Results"}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export { PaymentScreen };
