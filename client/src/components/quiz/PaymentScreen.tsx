"use client";

import React, { useState, useEffect } from "react";
import { useQuestionnaire } from "./QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, User, Mail, Phone } from "lucide-react";

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
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [paymentAmount, setPaymentAmount] = useState(0); // Changed: Default to 0 to avoid hard-coded fallback

  useEffect(() => {
    setName(userInfo.name || "");
    setEmail(userInfo.email || "");
    setPhone(userInfo.phone || "");
  }, [userInfo]);

  // New: Fetch dynamic quiz price from settings
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
          setPaymentAmount(data.data.quiz.quizPrice);
        } else {
          console.warn("No quizPrice found in settings, using 0");
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
            amount: paymentAmount, // New: Use dynamic amount
            email,
            metadata,
          }),
        }
      );

      if (!initRes.ok) {
        const errData = await initRes.json().catch(() => ({}));
        console.error("Paystack initialize failed:", errData);
        throw new Error("Paystack initialization failed");
      }

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
        return;
      } else {
        console.error("Unexpected initialize response:", initData);
        throw new Error("Unexpected initialize response");
      }
    } catch (error) {
      console.error("Error during submission/payment init:", error);
      setIsProcessing(false);
      alert(
        "Something went wrong while saving your answers or initializing payment."
      );
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
          <h2 className="text-2xl font-bold mb-4 font-serif">
            Payment Confirmed!
          </h2>
          <p className="text-gray-700 mb-6">
            Your payment was successful. Preparing your results...
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
          <CreditCard size={28} className="text-heaven-accent mr-2" />
          <h2 className="text-2xl font-bold font-serif">
            Submit Your Information & Pay
          </h2>
        </div>

        <p className="text-gray-700 mb-6 text-center">
          Please provide your details to receive your personalized assessment
          results.
          <span className="block mt-2 text-sm italic">
            (You will be redirected to Paystack to complete payment. This is a
            simulation - no card is charged during dev if Paystack is in test.)
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

            <Button
              type="submit"
              className="w-full mt-6 bg-heaven-accent hover:bg-yellow-500 text-black"
              disabled={isProcessing || paymentAmount === 0}
            >
              {isProcessing
                ? "Processing..."
                : `Submit & Pay (KES ${(paymentAmount / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}{" "}
              {/* New: Dynamic display */}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export { PaymentScreen };
