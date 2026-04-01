// src/components/admin/pages/Settings.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  // State for database settings (fetched from API)
  const [dbSettings, setDbSettings] = useState({
    appName: "",
    appDescription: "",
    adminEmail: "",
    questionsCount: 5,
    timeLimit: 10,
    randomize: true,
    showResults: true,
    quizPrice: 0, // Changed: Default to 0 to avoid hard-coded fallback
    stripeKey: "",
    minDonation: 1,
    suggestedAmounts: "5, 10, 20",
    enablePayments: true,
    emailNotifications: true,
    newUserAlerts: true,
    paymentAlerts: true,
    weeklyReports: false,
  });

  // State for the currently edited field
  const [editedField, setEditedField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3005/api/v1/settings?_=" + Date.now(),
          {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        console.log("Backend response:", res.data.data); // Debug log
        if (res.data?.success && res.data?.data) {
          const { general, quiz, payment, notifications } = res.data.data;
          setDbSettings((prev) => ({
            ...prev,
            appName: general?.appName ?? prev.appName,
            appDescription: general?.description ?? prev.appDescription,
            adminEmail: general?.adminEmail ?? prev.adminEmail,
            questionsCount: quiz?.questionCount ?? prev.questionsCount,
            timeLimit: quiz?.timeLimit ?? prev.timeLimit,
            randomize: quiz?.randomize ?? prev.randomize,
            showResults: quiz?.showResults ?? prev.showResults,
            quizPrice: quiz?.quizPrice ?? prev.quizPrice, // New: Fetch quiz price
            stripeKey: payment?.stripeKey ?? prev.stripeKey,
            minDonation: payment?.minDonation ?? prev.minDonation,
            suggestedAmounts: Array.isArray(payment?.suggestedAmounts)
              ? payment.suggestedAmounts.join(", ")
              : prev.suggestedAmounts,
            enablePayments: payment?.enablePayments ?? prev.enablePayments,
            emailNotifications:
              notifications?.emailNotifications ?? prev.emailNotifications,
            newUserAlerts: notifications?.newUserAlerts ?? prev.newUserAlerts,
            paymentAlerts: notifications?.paymentAlerts ?? prev.paymentAlerts,
            weeklyReports: notifications?.weeklyReports ?? prev.weeklyReports,
          }));
        }
      } catch (err) {
        console.log("No existing settings found, using defaults.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle field selection for editing
  const handleEditField = (key: string, currentValue: any) => {
    setEditedField(key);
    setEditedValue(currentValue);
  };

  // Handle input changes for the edited field
  const handleChange = (value: any) => {
    setEditedValue(value);
  };

  // Save the edited field
  const handleSave = async () => {
    if (!editedField) {
      setMessage("Please select a field to edit.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      let payload: any = {};
      let fieldValue = editedValue;

      // Handle specific field transformations
      if (editedField === "suggestedAmounts") {
        const suggestedAmountsString = fieldValue ?? "5, 10, 20";
        const suggestedAmountsArray = suggestedAmountsString
          .split(",")
          .map((n: string) => Number(n.trim()))
          .filter((n: number) => !isNaN(n));
        fieldValue =
          suggestedAmountsArray.length > 0
            ? suggestedAmountsArray
            : [5, 10, 20];
      } else if (
        ["questionsCount", "timeLimit", "minDonation", "quizPrice"].includes(
          editedField
        ) // New: Include quizPrice for numeric conversion
      ) {
        fieldValue = Number(fieldValue);
      }

      // Structure payload based on field category
      if (["appName", "appDescription", "adminEmail"].includes(editedField)) {
        payload = {
          general: {
            [editedField === "appDescription" ? "description" : editedField]:
              fieldValue || "",
          },
        };
      } else if (
        [
          "questionsCount",
          "timeLimit",
          "randomize",
          "showResults",
          "quizPrice",
        ].includes(
          // New: Include quizPrice in quiz fields
          editedField
        )
      ) {
        payload = {
          quiz: {
            [editedField === "questionsCount" ? "questionCount" : editedField]:
              fieldValue,
          },
        };
      } else if (
        [
          "stripeKey",
          "minDonation",
          "suggestedAmounts",
          "enablePayments",
        ].includes(editedField)
      ) {
        payload = { payment: { [editedField]: fieldValue } };
      } else if (
        [
          "emailNotifications",
          "newUserAlerts",
          "paymentAlerts",
          "weeklyReports",
        ].includes(editedField)
      ) {
        payload = { notifications: { [editedField]: fieldValue } };
      }

      const res = await axios.put(
        "http://localhost:3005/api/v1/settings",
        payload
      );

      if (res.data?.success) {
        setMessage("Setting saved successfully!");
        // Update dbSettings with the new value
        setDbSettings((prev) => ({ ...prev, [editedField]: fieldValue }));
        // Reset editing state
        setEditedField(null);
        setEditedValue("");
      } else {
        setMessage("Failed to save setting.");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Error saving setting.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedField(null);
    setEditedValue("");
    setMessage("");
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your application settings and preferences. Select a field to
          edit.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "appName", label: "Application Name", type: "text" },
              { key: "appDescription", label: "Description", type: "text" },
              { key: "adminEmail", label: "Admin Email", type: "email" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={key}
                    type={type}
                    placeholder={
                      dbSettings[key as keyof typeof dbSettings] as string
                    }
                    value={editedField === key ? editedValue : ""}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={editedField !== null && editedField !== key}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleEditField(
                        key,
                        dbSettings[key as keyof typeof dbSettings]
                      )
                    }
                    disabled={editedField === key}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex space-x-2">
              <Button
                className="bg-purple-700 hover:bg-purple-800"
                onClick={handleSave}
                disabled={saving || !editedField}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={!editedField}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "questionsCount",
                label: "Number of Questions",
                type: "number",
              },
              {
                key: "timeLimit",
                label: "Time Limit (minutes)",
                type: "number",
              },
              {
                // New: Quiz price field
                key: "quizPrice",
                label: "Quiz Price (in cents, e.g., 100000 for KES 1,000.00)",
                type: "number",
              },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={key}
                    type={type}
                    placeholder={dbSettings[
                      key as keyof typeof dbSettings
                    ].toString()}
                    value={editedField === key ? editedValue : ""}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={editedField !== null && editedField !== key}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleEditField(
                        key,
                        dbSettings[key as keyof typeof dbSettings]
                      )
                    }
                    disabled={editedField === key}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            {[
              { key: "randomize", label: "Randomize Questions" },
              { key: "showResults", label: "Show Results Immediately" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{label}</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={key}
                    checked={
                      editedField === key
                        ? editedValue
                        : dbSettings[key as keyof typeof dbSettings]
                    }
                    onCheckedChange={(val) => {
                      handleEditField(key, val);
                      handleChange(val);
                    }}
                    disabled={editedField !== null && editedField !== key}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleEditField(
                        key,
                        dbSettings[key as keyof typeof dbSettings]
                      )
                    }
                    disabled={editedField === key}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex space-x-2">
              <Button
                className="bg-purple-700 hover:bg-purple-800"
                onClick={handleSave}
                disabled={saving || !editedField}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={!editedField}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "stripeKey",
                label: "Stripe Public Key",
                type: "password",
              },
              {
                key: "minDonation",
                label: "Minimum Donation ($)",
                type: "number",
              },
              {
                key: "suggestedAmounts",
                label: "Suggested Amounts",
                type: "text",
              },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={key}
                    type={type}
                    placeholder={dbSettings[
                      key as keyof typeof dbSettings
                    ].toString()}
                    value={editedField === key ? editedValue : ""}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={editedField !== null && editedField !== key}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleEditField(
                        key,
                        dbSettings[key as keyof typeof dbSettings]
                      )
                    }
                    disabled={editedField === key}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <Label htmlFor="enablePayments">Enable Payments</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enablePayments"
                  checked={
                    editedField === "enablePayments"
                      ? editedValue
                      : dbSettings.enablePayments
                  }
                  onCheckedChange={(val) => {
                    handleEditField("enablePayments", val);
                    handleChange(val);
                  }}
                  disabled={
                    editedField !== null && editedField !== "enablePayments"
                  }
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    handleEditField("enablePayments", dbSettings.enablePayments)
                  }
                  disabled={editedField === "enablePayments"}
                >
                  Edit
                </Button>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                className="bg-purple-700 hover:bg-purple-800"
                onClick={handleSave}
                disabled={saving || !editedField}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={!editedField}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["emailNotifications", "Email Notifications"],
              ["newUserAlerts", "New User Alerts"],
              ["paymentAlerts", "Payment Alerts"],
              ["weeklyReports", "Weekly Reports"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{label}</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={key}
                    checked={
                      editedField === key
                        ? editedValue
                        : dbSettings[key as keyof typeof dbSettings]
                    }
                    onCheckedChange={(val) => {
                      handleEditField(key, val);
                      handleChange(val);
                    }}
                    disabled={editedField !== null && editedField !== key}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleEditField(
                        key,
                        dbSettings[key as keyof typeof dbSettings]
                      )
                    }
                    disabled={editedField === key}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex space-x-2">
              <Button
                className="bg-purple-700 hover:bg-purple-800"
                onClick={handleSave}
                disabled={saving || !editedField}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={!editedField}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
