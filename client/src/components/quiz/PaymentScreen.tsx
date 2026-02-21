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
  ChevronDown,
} from "lucide-react";

const PaymentScreen: React.FC = () => {
  const {
    setCurrentStep,
    setUserInfo,
    userInfo,
    getSubmissionPayload,
    fetchFinalResult,
    resetQuestionnaire,
  } = useQuestionnaire();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [ageRange, setAgeRange] = useState<string>(userInfo.ageRange || "");
  const [wantsDiscipleship, setWantsDiscipleship] = useState<boolean | null>(
    userInfo.wantsDiscipleship ?? null
  );

  const [suggestedAmount, setSuggestedAmount] = useState(0);

  const getQueryParam = (key: string) => {
    if (typeof window === "undefined") return null;
    const urlSearch = new URLSearchParams(window.location.search);
    return urlSearch.get(key);
  };

  const cameFromResults = getQueryParam("from") === "results";

  useEffect(() => {
    setName(userInfo.name || "");
    setEmail(userInfo.email || "");
    setPhone(userInfo.phone || "");
    setAgeRange(userInfo.ageRange || "");
    setWantsDiscipleship(userInfo.wantsDiscipleship ?? null);
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
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchPaymentAmount();
  }, []);

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
        const lastResponseId = localStorage.getItem("last_response_id") || null;

        await fetchFinalResult(lastResponseId || undefined);

        setIsProcessing(false);
        setIsCompleted(true);

        setTimeout(() => {
          setCurrentStep("result");
          try {
            const url = new URL(window.location.href);
            url.search = "";
            window.history.replaceState({}, "", url.toString());
          } catch {}
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

    // Save all user info (including discipleship interest)
    setUserInfo({
      name,
      email,
      phone,
      ageRange,
      wantsDiscipleship,
    });

    // We still use getSubmissionPayload() for the responses part,
    // but override userInfo with the fresh values (including wantsDiscipleship)
    const payload = {
      ...getSubmissionPayload(),
      userInfo: {
        name,
        email,
        phone,
        ageRange,
        wantsDiscipleship,
      },
    };

    try {
      const res = await fetch("http://localhost:3005/api/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      } catch {}

      const savedResponseId =
        savedResponse?.data?._id ||
        savedResponse?._id ||
        savedResponse?.id ||
        null;

      if (savedResponseId) {
        localStorage.setItem("last_response_id", savedResponseId);
      }

      if (donationAmount > 0) {
        const metadata = { response_id: savedResponseId };

        const initRes = await fetch(
          "http://localhost:3005/api/v1/payment/initialize",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: donationAmount * 100,
              email,
              metadata,
            }),
          }
        );

        if (!initRes.ok) {
          console.error("Paystack init failed:", await initRes.text());
        } else {
          const initData = await initRes.json();
          if (initData?.authorization_url) {
            localStorage.setItem(
              "pending_paystack_reference",
              initData.reference || initData?.data?.reference || ""
            );
            window.location.href = initData.authorization_url;
            return;
          }
        }
      }

      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("from");
        window.history.replaceState({}, "", url.toString());
      } catch {}

      setIsProcessing(false);

      if (cameFromResults && donationAmount <= 0) {
        resetQuestionnaire();
      } else {
        setCurrentStep("result");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setIsProcessing(false);

      if (cameFromResults && donationAmount <= 0) {
        resetQuestionnaire();
      } else {
        setCurrentStep("result");
      }

      alert("Something went wrong, but you can still retake or view results.");
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
            Donation is optional — you can proceed directly. (Paystack test mode
            in development — no real charge)
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
                placeholder="+254 712 345 678"
                required
              />
            </div>

            {/* Age Range Dropdown */}
            <div className="relative">
              <Label
                htmlFor="ageRange"
                className="flex items-center gap-2 mb-1.5"
              >
                <User size={16} /> Age Range (Optional)
              </Label>
              <select
                id="ageRange"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
              >
                <option value="">Prefer not to say</option>
                <option value="Under 18">Under 18</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[42px] h-4 w-4 opacity-50" />
            </div>

            {/* Discipleship Group Interest */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Heart size={16} /> Interested in joining a Discipleship Group?
              </Label>
              <div className="flex flex-col sm:flex-row sm:gap-8 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="discipleship"
                    checked={wantsDiscipleship === true}
                    onChange={() => setWantsDiscipleship(true)}
                    className="h-5 w-5 text-heaven-accent border-gray-300 focus:ring-heaven-accent"
                  />
                  <span className="text-gray-700">Yes, please contact me</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="discipleship"
                    checked={wantsDiscipleship === false}
                    onChange={() => setWantsDiscipleship(false)}
                    className="h-5 w-5 text-heaven-accent border-gray-300 focus:ring-heaven-accent"
                  />
                  <span className="text-gray-700">No, thank you</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Optional — this helps us connect interested people with local
                discipleship groups.
              </p>
            </div>

            {/* Donation */}
            <div className="pt-2">
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
                placeholder="Enter amount or leave blank"
                min={0}
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Enter any amount in KES (or leave as 0 to skip)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-10">
              <Button
                type="submit"
                className="w-full bg-heaven-accent hover:bg-yellow-500 text-black font-medium py-6 text-lg"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : cameFromResults
                    ? donationAmount > 0
                      ? `Donate KES ${donationAmount.toLocaleString()} & Retake Quiz`
                      : "Retake Quiz"
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
