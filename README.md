# **The Future of Man**

## 📘 Project Overview

The Future of Man is a web-based quiz application designed to provide users with a fun, introspective experience. Users answer a series of moral and personality-driven questions and receive personalized results that place them in one of three categories: **"Heaven"**, **"Hell"**, or **"In-Between"**. The application includes both a user-facing frontend and a secure admin backend for managing content and analyzing results.

---

## 🛠️ Tech Stack

- **Frontend:** React (Next.js)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Hosting:** DigitalOcean (Droplet)
- **Email Service:** Amazon SES
- **Payment Gateways:** M-Pesa API, PayStack

---

## ✨ Features

- Single-question-per-screen quiz format
- Dynamic scoring logic and personalized results
- Optional donations via M-Pesa or card
- Social media sharing of results
- Admin panel for managing content and viewing analytics
- Multilingual support and accessibility-ready UI
- Email delivery of quiz results
- Secure data handling and GDPR compliance

---

## 🚀 Setup Instructions

- Clone this repository:
  `git clone https://github.com/markmuthii/the-future-of-man.git`
- Install dependencies for frontend and backend:
  `npm install` (client and server)
- Create a `.env` file with all required environment variables (see below)
- Start the client dev server:
  `npm run dev` (client)
- Start the backend server:
  `npm run dev` (server)

---

## 🔐 Environment Variables

Rename the `.env.example` to `.env` on both the client and the server and fill in the relevant values. All are required for the app to run.

---

## 📄 License & Credits

This project is developed and maintained by **Kram Digital Agencies**. All rights reserved.
Redistribution or commercial use without written consent is prohibited.
