import { Router } from "express";

import { authRouter } from "@/routes/v1/auth";
import { userRouter } from "@/routes/v1/users";
import { analyticsRouter } from "@/routes/v1/analytics";
import { quizRouter } from "@/routes/v1/quiz";
import { responseRouter } from "@/routes/v1/response";
import { statsRouter } from "@/routes/v1/stats";
import { settingsRouter } from "@/routes/v1/settings";
import { paymentRouter } from "@/routes/v1/payment";

const v1Router = Router();

v1Router.get("/", (req, res) => {
  res.json({
    message: "Silence is golden",
  });
});

v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/quiz", quizRouter);
v1Router.use("/analytics", analyticsRouter);
v1Router.use("/responses", responseRouter);
v1Router.use("/stats", statsRouter);
v1Router.use("/settings", settingsRouter);
v1Router.use("/payment", paymentRouter);

export { v1Router };
