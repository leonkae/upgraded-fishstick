"use client";

import React, { useState, useEffect } from "react";
import { useQuestionnaire } from "./QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, User, Mail, Phone } from "lucide-react";

const PaymentScreen: React.FC = () => {
  const { setCurrentStep, setUserInfo, userInfo, getSubmissionPayload } =
    useQuestionnaire();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");

  // Sync local state with context userInfo if it changes externally
  useEffect(() => {
    setName(userInfo.name || "");
    setEmail(userInfo.email || "");
    setPhone(userInfo.phone || "");
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Update userInfo in context with current form values
    setUserInfo({ name, email, phone });

    // Create payload with form values directly to avoid context sync issues
    const payload = {
      ...getSubmissionPayload(),
      userInfo: { name, email, phone }, // Override userInfo with local state
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
        const errorData = await res.json();
        console.error("Server error response:", errorData);
        throw new Error("Failed to save submission");
      }

      setTimeout(() => {
        setIsProcessing(false);
        setIsCompleted(true);

        setTimeout(() => {
          setCurrentStep("result");
        }, 1500);
      }, 2000);
    } catch (error) {
      console.error("Error saving submission:", error);
      setIsProcessing(false);
      alert("Something went wrong while saving your answers.");
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
            Information Submitted!
          </h2>
          <p className="text-gray-700 mb-6">
            Your assessment has been processed. Preparing your results...
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
            Submit Your Information
          </h2>
        </div>

        <p className="text-gray-700 mb-6 text-center">
          Please provide your details to receive your personalized assessment
          results.
          <span className="block mt-2 text-sm italic">
            (This is a simulation - no actual payment will be processed)
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

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-heaven-accent hover:bg-yellow-500 text-black"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Submit Information ($0.00)"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export { PaymentScreen };
