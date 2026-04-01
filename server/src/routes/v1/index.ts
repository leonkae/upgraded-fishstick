// src/routes/v1/index.ts
import { Router } from "express";

import { authRouter } from "@/routes/v1/auth";
import { userRouter } from "@/routes/v1/users";
import { analyticsRouter } from "@/routes/v1/analytics";
import { quizRouter } from "@/routes/v1/quiz";
import { responseRouter } from "@/routes/v1/response";
import { statsRouter } from "@/routes/v1/stats";
import { settingsRouter } from "@/routes/v1/settings";
import { paymentRouter } from "@/routes/v1/payment";
import { teamRouter } from "@/routes/v1/team";

// NEW IMPORTS FOR PROTECTION
import { authenticate, requireAdmin } from "@/middleware/auth";
import { adminRouter } from "@/routes/v1/admin";

const v1Router = Router();

v1Router.get("/", (req, res) => {
  res.json({
    message: "Silence is golden",
  });
});

// Public routes (no protection needed)
v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/quiz", quizRouter);
v1Router.use("/analytics", analyticsRouter);
v1Router.use("/responses", responseRouter);
v1Router.use("/stats", statsRouter);
v1Router.use("/settings", settingsRouter);
v1Router.use("/payment", paymentRouter);
v1Router.use("/team", teamRouter);

// ====================== ALL ADMIN ROUTES PROTECTED HERE ======================
// Everything under /admin requires login + admin role
v1Router.use("/admin", adminRouter);

export { v1Router };
