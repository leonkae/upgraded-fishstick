import { Router } from "express";

import { authRouter } from "@/routes/v1/auth";
import { userRouter } from "@/routes/v1/users";
import { questionnaireRouter } from "@/routes/v1/questionnaire";
import { analyticsRouter } from "@/routes/v1/analytics";

const v1Router = Router();

v1Router.get("/", (req, res) => {
  res.json({
    message: "Silence is golden",
  });
});

v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/questionnaire", questionnaireRouter);
v1Router.use("/analytics", analyticsRouter);

export { v1Router };
