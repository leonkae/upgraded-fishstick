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

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.yourdomain.com";

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
  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [ageRange, setAgeRange] = useState<string>(userInfo.ageRange || "");
  const [wantsDiscipleship, setWantsDiscipleship] = useState<boolean | null>(
    userInfo.wantsDiscipleship ?? null
  );
  const [currency, setCurrency] = useState<string>("KES");
  const [originalSuggestedKES, setOriginalSuggestedKES] = useState(0);
  const [suggestedAmount, setSuggestedAmount] = useState(0);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    KES: 1,
  });

  const supportedCurrencies = [
    "KES",
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "AUD",
    "JPY",
    "CHF",
    "SEK",
    "NOK",
    "DKK",
    "AED",
    "HKD",
    "SGD",
    "NZD",
    "BRL",
    "MXN",
    "PLN",
    "CZK",
    "ILS",
    "INR",
    "KRW",
    "THB",
    "MYR",
    "PHP",
    "TRY",
    "ZAR",
    "NGN",
  ];

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

  // Fetch quiz price in KES
  useEffect(() => {
    const fetchPaymentAmount = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/settings?_=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        const data = await res.json();
        if (data?.success && data?.data?.quiz?.quizPrice) {
          const kesPrice = data.data.quiz.quizPrice;
          setOriginalSuggestedKES(kesPrice);
          setSuggestedAmount(kesPrice);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchPaymentAmount();
  }, []);

  // Fetch exchange rates – using Frankfurter as primary source
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Primary: Frankfurter (reliable, no key, ECB-based rates)
        const symbols = supportedCurrencies
          .filter((c) => c !== "KES")
          .join(",");
        const frankfurterRes = await fetch(
          `https://api.frankfurter.dev/latest?from=KES&to=${symbols}`
        );

        if (!frankfurterRes.ok) {
          throw new Error(
            `Frankfurter responded with ${frankfurterRes.status}`
          );
        }

        const frankfurterData = await frankfurterRes.json();

        if (frankfurterData?.rates) {
          setExchangeRates({ KES: 1, ...frankfurterData.rates });
          console.log("Exchange rates loaded from Frankfurter");
          return; // success → exit early
        }
      } catch (err) {
        console.warn("Frankfurter fetch failed:", err);

        // Fallback 1: old exchangerate.host
        try {
          const symbols = supportedCurrencies
            .filter((c) => c !== "KES")
            .join(",");
          const oldRes = await fetch(
            `https://api.exchangerate.host/latest?base=KES&symbols=${symbols}`
          );
          const oldData = await oldRes.json();
          if (oldData?.rates) {
            setExchangeRates({ KES: 1, ...oldData.rates });
            console.log(
              "Exchange rates loaded from exchangerate.host (fallback)"
            );
            return;
          }
        } catch (fallbackErr) {
          console.warn("exchangerate.host fallback also failed:", fallbackErr);
        }

        // Ultimate fallback: hardcoded rates
        console.warn("Using hardcoded fallback exchange rates");
        setExchangeRates({
          KES: 1,
          USD: 0.0077,
          EUR: 0.0071,
          GBP: 0.006,
          CAD: 0.0104,
          AUD: 0.0117,
          JPY: 1.13,
          CHF: 0.0068,
          SEK: 0.08,
          NOK: 0.081,
          DKK: 0.053,
          AED: 0.028,
          HKD: 0.06,
          SGD: 0.0103,
          NZD: 0.0125,
          BRL: 0.038,
          MXN: 0.13,
          PLN: 0.03,
          CZK: 0.178,
          ILS: 0.027,
          INR: 0.64,
          KRW: 10.16,
          THB: 0.272,
          MYR: 0.036,
          PHP: 0.43,
          TRY: 0.245,
          ZAR: 0.144,
          NGN: 12.3,
        });
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 60 * 60 * 1000); // hourly
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (originalSuggestedKES > 0 && exchangeRates[currency]) {
      const converted = originalSuggestedKES * exchangeRates[currency];
      setSuggestedAmount(Number(converted.toFixed(2)));
    }
  }, [currency, exchangeRates, originalSuggestedKES]);

  // Payment verification on callback
  useEffect(() => {
    const verifyReference = async (ref: string) => {
      try {
        setIsProcessing(true);
        const verifyRes = await fetch(
          `${API_BASE}/api/v1/payment/verify/${encodeURIComponent(ref)}`,
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
        let finalAmount = donationAmount;
        let finalCurrency = currency.toUpperCase();

        // Convert non-KES/non-USD to KES
        if (finalCurrency !== "KES") {
          const rate = exchangeRates[finalCurrency];
          if (!rate || rate <= 0) {
            console.warn(
              `No valid rate for ${finalCurrency} — using original amount in KES`
            );
            // Optionally show a nicer message instead of alert
            // alert(`Could not convert ${currency}. Charged in KES.`);
          } else {
            finalAmount = Number((donationAmount / rate).toFixed(2));
          }
          finalCurrency = "KES"; // always charge in KES
        }

        const initRes = await fetch(`${API_BASE}/api/v1/payment/initialize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(finalAmount * 100),
            email,
            currency: finalCurrency,
            metadata: { response_id: savedResponseId },
          }),
        });

        if (!initRes.ok) {
          console.error(
            "Payment init failed:",
            await initRes.text().catch(() => "")
          );
          throw new Error("Payment initialization failed");
        }

        const initData = await initRes.json();
        const authUrl = initData.authorization_url;
        const ref = initData.reference || initData?.data?.reference || "";

        if (authUrl) {
          localStorage.setItem("pending_paystack_reference", ref);
          window.location.href = authUrl;
          return;
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
      alert("Something went wrong, but you can still retake or view results.");
      if (cameFromResults && donationAmount <= 0) {
        resetQuestionnaire();
      } else {
        setCurrentStep("result");
      }
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 p-6">
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-2xl max-w-lg w-full text-center border border-white/10"
        >
          <div className="mb-8 flex justify-center">
            <CheckCircle size={96} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-5 text-white font-serif tracking-tight">
            Thank You!
          </h2>
          <p className="text-gray-300 text-lg">
            Your support is greatly appreciated. Preparing your results...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl border border-purple-700/30 bg-gradient-to-br from-purple-900/80 to-indigo-950/80 backdrop-blur-sm">
          {/* LEFT - FORM */}
          <div className="p-8 lg:p-12 order-2 md:order-1">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Heart className="h-8 w-8 text-orange-400" />
                <h2 className="text-3xl font-bold text-white font-serif tracking-tight">
                  Complete Your Journey
                </h2>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Share your details to receive your personalized spiritual
                assessment. A generous donation is optional, every gift helps
                spread the message.
                <span className="block mt-2 text-sm text-purple-300/80 italic">
                  (Your data is safe with us and will never be shared without
                  your consent.)
                </span>
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label
                    htmlFor="name"
                    className="text-gray-200 flex items-center gap-2 mb-1.5"
                  >
                    <User size={18} /> Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="bg-purple-950/40 border-purple-700/50 text-white placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-500/30 h-12"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-gray-200 flex items-center gap-2 mb-1.5"
                  >
                    <Mail size={18} /> Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="bg-purple-950/40 border-purple-700/50 text-white placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-500/30 h-12"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-gray-200 flex items-center gap-2 mb-1.5"
                  >
                    <Phone size={18} /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    required
                    className="bg-purple-950/40 border-purple-700/50 text-white placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-500/30 h-12"
                  />
                </div>

                {/* Currency */}
                <div className="relative">
                  <Label
                    htmlFor="currency"
                    className="text-gray-200 flex items-center gap-2 mb-1.5"
                  >
                    <CreditCard size={18} /> Currency
                  </Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-purple-700/50 bg-purple-950/40 px-4 py-2 text-white text-sm focus:border-orange-400 focus:ring-orange-500/30 appearance-none"
                  >
                    {supportedCurrencies.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top={[42px]} h-5 w-5 text-gray-400" />
                </div>

                {/* Age Range */}
                <div className="relative">
                  <Label
                    htmlFor="ageRange"
                    className="text-gray-200 flex items-center gap-2 mb-1.5"
                  >
                    <User size={18} /> Age Range (Optional)
                  </Label>
                  <select
                    id="ageRange"
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-purple-700/50 bg-purple-950/40 px-4 py-2 text-white text-sm focus:border-orange-400 focus:ring-orange-500/30 appearance-none"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Under 18">Under 18</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55+">55+</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-[42px] h-5 w-5 text-gray-400" />
                </div>

                {/* Discipleship */}
                <div>
                  <Label className="text-gray-200 flex items-center gap-2 mb-3">
                    <Heart size={18} /> Are you interested in joining a
                    discipleship program ?
                  </Label>
                  <div className="flex flex-col sm:flex-row sm:gap-10 gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="discipleship"
                        checked={wantsDiscipleship === true}
                        onChange={() => setWantsDiscipleship(true)}
                        className="h-5 w-5 accent-orange-500"
                      />
                      <span className="text-gray-200 group-hover:text-orange-300 transition-colors">
                        Yes, please contact me
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="discipleship"
                        checked={wantsDiscipleship === false}
                        onChange={() => setWantsDiscipleship(false)}
                        className="h-5 w-5 accent-orange-500"
                      />
                      <span className="text-gray-200 group-hover:text-orange-300 transition-colors">
                        No, thank you
                      </span>
                    </label>
                  </div>
                </div>

                {/* Donation */}
                <div className="pt-4">
                  <Label
                    htmlFor="donation"
                    className="text-gray-200 flex items-center gap-2 mb-1.5"
                  >
                    <Heart size={18} /> Do you mind supporting this ministry to
                    reach many others ? (Optional)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {currency}
                    </span>
                    <Input
                      id="donation"
                      type="number"
                      value={donationAmount || ""}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDonationAmount(isNaN(val) || val < 0 ? 0 : val);
                      }}
                      placeholder="Enter any amount you'd like to contribute"
                      min={0}
                      className="bg-purple-950/40 border-purple-700/50 text-white placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-500/30 h-12 pl-14"
                    />
                  </div>

                  {donationAmount > 0 &&
                    !"KES".includes(currency) &&
                    exchangeRates[currency] > 0 && (
                      <p className="text-xs text-amber-300 mt-2 text-center">
                        ≈{" "}
                        {Math.round(
                          donationAmount / exchangeRates[currency]
                        ).toLocaleString()}{" "}
                        KES (live rate • charged in KES)
                      </p>
                    )}

                  <p className="text-xs text-purple-300/70 mt-2 text-center">
                    Your generosity helps reach more souls
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-10 h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-900/40 transition-all duration-300"
                >
                  {isProcessing
                    ? "Processing..."
                    : cameFromResults
                      ? donationAmount > 0
                        ? `Donate ${currency} ${donationAmount.toLocaleString()} & Retake`
                        : "Retake Quiz"
                      : donationAmount > 0
                        ? `Donate ${currency} ${donationAmount.toLocaleString()} & View Results`
                        : "View Your Results"}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* RIGHT - IMAGE */}
          <div className="hidden md:block relative overflow-hidden order-1 md:order-2 bg-gradient-to-br from-purple-800/30 to-indigo-900/40">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-purple-950/30 z-10" />
            <img
              src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Spiritual journey illustration"
              className="object-cover w-full h-full scale-105 transform transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20 px-10 text-center">
              <div className="text-white max-w-md">
                <h3 className="text-3xl font-bold font-serif mb-4 drop-shadow-lg">
                  Discover Your Spiritual Path
                </h3>
                <p className="text-lg text-purple-100/90 drop-shadow-md">
                  Receive personalized insights and take the next step in your
                  walk with God.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PaymentScreen };
