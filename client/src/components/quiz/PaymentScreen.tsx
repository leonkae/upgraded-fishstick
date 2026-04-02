"use client";
import React, { useState, useEffect } from "react";
import { useQuestionnaire } from "./QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  Heart,
  ChevronDown,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.yourdomain.com";

const PaymentScreen: React.FC = () => {
  const {
    setCurrentStep,
    setUserInfo,
    userInfo,
    getSubmissionPayload,
    resetQuestionnaire,
  } = useQuestionnaire();

  // Removed unused setIsProcessing and setIsCompleted to satisfy linter
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted] = useState(false);

  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [ageRange, setAgeRange] = useState<string>(userInfo.ageRange || "");
  const [wantsDiscipleship, setWantsDiscipleship] = useState<boolean | null>(
    userInfo.wantsDiscipleship ?? null
  );

  const cameFromResults =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("from") === "results"
      : false;

  useEffect(() => {
    setName(userInfo.name || "");
    setEmail(userInfo.email || "");
    setPhone(userInfo.phone || "");
    setAgeRange(userInfo.ageRange || "");
    setWantsDiscipleship(userInfo.wantsDiscipleship ?? null);
  }, [userInfo]);

  const handleSubmit = async (withDonation: boolean) => {
    if (!name || !email || !phone) {
      alert("Please fill in your name, email, and phone number.");
      return;
    }

    setIsProcessing(true);

    setUserInfo({
      name,
      email,
      phone,
      ageRange,
      wantsDiscipleship,
    });

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
      const res = await fetch(`${API_BASE}/api/v1/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save submission");

      const savedResponse = await res.json().catch(() => ({}));
      const savedResponseId =
        savedResponse?.data?._id ||
        savedResponse?._id ||
        savedResponse?.id ||
        null;

      if (savedResponseId) {
        localStorage.setItem("last_response_id", savedResponseId);
      }

      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("from");
        window.history.replaceState({}, "", url.toString());
      } catch {
        // Silently catch history errors
      }

      setIsProcessing(false);

      if (withDonation) {
        const params = new URLSearchParams({
          responseId: savedResponseId || "",
        });
        window.location.href = `/donation-details?${params.toString()}`;
      } else {
        if (cameFromResults) {
          resetQuestionnaire();
        } else {
          setCurrentStep("result");
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setIsProcessing(false);
      alert("Something went wrong. Please try again.");
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 p-4">
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl max-w-lg w-full text-center border border-white/10"
        >
          <CheckCircle size={80} className="text-emerald-400 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white font-serif tracking-tight">
            Thank You!
          </h2>
          <p className="text-gray-300 text-base">Preparing your results...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-6xl">
        <div className="grid md:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl border border-purple-700/30 bg-gradient-to-br from-purple-900/80 to-indigo-950/80 backdrop-blur-sm">
          {/* LEFT */}
          <div className="p-5 sm:p-6 lg:p-8 order-2 md:order-1">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-7 w-7 text-orange-400" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
                  Complete Your Journey
                </h2>
              </div>

              <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">
                Please share your details to receive your personalized spiritual
                assessment. Supporting the ministry is completely optional.
                <span className="block mt-2 text-xs sm:text-sm text-purple-300/80 italic">
                  Your data is safe and will never be shared without your
                  consent.
                </span>
              </p>

              <div className="space-y-5">
                <div>
                  <Label className="text-gray-200 flex items-center gap-2 mb-1">
                    <User size={16} /> Full Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <Label className="text-gray-200 flex items-center gap-2 mb-1">
                    <Mail size={16} /> Email Address
                  </Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <Label className="text-gray-200 flex items-center gap-2 mb-1">
                    <Phone size={16} /> Phone Number
                  </Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                    disabled={isProcessing}
                  />
                </div>

                <div className="relative">
                  <Label className="text-gray-200 flex items-center gap-2 mb-1">
                    <User size={16} /> Age Range (Optional)
                  </Label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    disabled={isProcessing}
                    className="h-11 w-full px-3 text-sm rounded-md bg-purple-950/40 border border-purple-700/50 text-white appearance-none"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Under 18">Under 18</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55+">55+</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-[36px] h-4 w-4 text-gray-400" />
                </div>

                <div>
                  <Label className="text-gray-200 flex items-center gap-2 mb-2">
                    <Heart size={16} /> Are you interested in joining a
                    discipleship program?
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        disabled={isProcessing}
                        checked={wantsDiscipleship === true}
                        onChange={() => setWantsDiscipleship(true)}
                      />
                      <span className="text-gray-200 text-sm">Yes</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        disabled={isProcessing}
                        checked={wantsDiscipleship === false}
                        onChange={() => setWantsDiscipleship(false)}
                      />
                      <span className="text-gray-200 text-sm">No</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <Button
                    onClick={() => handleSubmit(false)}
                    className="w-full h-12 text-sm"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "View My Results"}
                  </Button>

                  <Button
                    onClick={() => handleSubmit(true)}
                    className="w-full h-12 text-sm"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : "I Want to Support This Ministry"}
                  </Button>
                </div>

                <p className="text-center text-xs text-purple-300/70 mt-4">
                  Supporting the ministry is completely optional.
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:block relative overflow-hidden order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
              alt="Nature Background"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { PaymentScreen };
