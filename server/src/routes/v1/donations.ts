import { Router } from "express";

const donationsRouter = Router();

donationsRouter.get("/", (req, res) => {
  res.json({
    message: "Donation endpoint",
  });
});

export { donationsRouter };
