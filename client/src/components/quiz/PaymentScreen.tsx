// PaymentScreen.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useQuestionnaire } from "./QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, User, Mail, Phone } from "lucide-react";

const PAYMENT_AMOUNT = 100000; // adjust as needed

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

  useEffect(() => {
    setName(userInfo.name || "");
    setEmail(userInfo.email || "");
    setPhone(userInfo.phone || "");
  }, [userInfo]);

  const getQueryParam = (key: string) => {
    if (typeof window === "undefined") return null;
    const urlSearch = new URLSearchParams(window.location.search);
    return urlSearch.get(key);
  };

  // When Paystack redirects back with reference, verify and fetch final result
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
        // At this point payment verified on backend.
        // Fetch the saved response id from localStorage (we saved it before redirect).
        const lastResponseId =
          (typeof window !== "undefined" &&
            localStorage.getItem("last_response_id")) ||
          null;

        // Fetch final result from server (by id if available)
        await fetchFinalResult(lastResponseId || undefined);

        setIsProcessing(false);
        setIsCompleted(true);

        // Move to result screen after a short UI delay
        setTimeout(() => {
          setCurrentStep("result");
          // optionally remove query params to clean URL
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // 1) Save responses
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

      // Capture saved response id robustly
      let savedResponse: any = null;
      try {
        savedResponse = await res.json();
      } catch {
        // ignore if no json
      }

      // try multiple shapes: savedResponse.data._id, savedResponse._id, savedResponse.id
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

      // 2) Initialize Paystack transaction
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
            amount: PAYMENT_AMOUNT,
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
        // redirect to Paystack authorization page
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
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Submit & Pay (KES 1,000.00)"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export { PaymentScreen };
