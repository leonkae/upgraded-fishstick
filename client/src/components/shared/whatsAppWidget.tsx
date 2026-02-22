"use client";

import { FloatingWhatsApp } from "@digicroz/react-floating-whatsapp";

export default function WhatsAppWidget() {
  return (
    <FloatingWhatsApp
      phoneNumber="254114427790"
      accountName="The Future of Man"
      avatar="/images/logo.png"
      statusMessage="Online • Quick replies"
      chatMessage={`Hi! 👋 Ready to explore the future?\nAsk me anything...`}
      notification
      notificationSound
      allowEsc
      darkMode
    />
  );
}
