// routes/v1/stripe.ts
import express, { Request, Response } from "express";
import Stripe from "stripe";
import { asyncHandler } from "@/utils/asyncHandler"; // adjust path

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

router.post(
  "/initialize",
  asyncHandler(async (req: Request, res: Response) => {
    const { amount, email, currency, metadata } = req.body;

    if (!amount || !email || !currency) {
      res
        .status(400)
        .json({
          success: false,
          message: "Amount, email, and currency required",
        });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: "Donation / Support" },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata,
      success_url: `${process.env.FRONTEND_URL}/quiz?step=verify&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/quiz?cancelled=true`,
    });

    res.json({
      success: true,
      url: session.url,
      id: session.id,
    });
  })
);

router.get(
  "/verify/:sessionId",
  asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (session.payment_status === "paid") {
      res.json({ success: true, data: session });
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "Payment not completed",
          status: session.payment_status,
        });
    }
  })
);

// Webhook (also wrap if async)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(async (req: Request, res: Response) => {
    // ... your webhook logic ...
    res.json({ received: true });
  })
);

export const stripeRouter = router;
