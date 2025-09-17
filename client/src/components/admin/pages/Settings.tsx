"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your application settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" value="The Future of Man" />
            </div>
            <div>
              <Label htmlFor="app-description">Description</Label>
              <Input
                id="app-description"
                value="Discover your eternal path through moral choices"
              />
            </div>
            <div>
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" value="admin@futureofman.com" />
            </div>
            <Button className="bg-purple-700 hover:bg-purple-800">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Quiz Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="questions-count">Number of Questions</Label>
              <Input id="questions-count" type="number" value="5" />
            </div>
            <div>
              <Label htmlFor="time-limit">Time Limit (minutes)</Label>
              <Input id="time-limit" type="number" value="10" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="randomize">Randomize Questions</Label>
              <Switch id="randomize" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-results">Show Results Immediately</Label>
              <Switch id="show-results" defaultChecked />
            </div>
            <Button className="bg-purple-700 hover:bg-purple-800">
              Update Quiz Settings
            </Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stripe-key">Stripe Public Key</Label>
              <Input
                id="stripe-key"
                type="password"
                placeholder="pk_live_..."
              />
            </div>
            <div>
              <Label htmlFor="min-donation">Minimum Donation ($)</Label>
              <Input id="min-donation" type="number" value="1" />
            </div>
            <div>
              <Label htmlFor="suggested-amounts">Suggested Amounts</Label>
              <Input id="suggested-amounts" value="5, 10, 20" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-payments">Enable Payments</Label>
              <Switch id="enable-payments" defaultChecked />
            </div>
            <Button className="bg-purple-700 hover:bg-purple-800">
              Save Payment Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-user-alerts">New User Alerts</Label>
              <Switch id="new-user-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="payment-alerts">Payment Alerts</Label>
              <Switch id="payment-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-reports">Weekly Reports</Label>
              <Switch id="weekly-reports" />
            </div>
            <Button className="bg-purple-700 hover:bg-purple-800">
              Update Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
