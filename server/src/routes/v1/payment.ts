// routes/v1/payment.ts
import express, { Request, Response } from "express";
import crypto from "crypto";

const router = express.Router();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET!;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

// temporary in-memory store (replace with DB later)
const paidUsers: Array<{
  email: string;
  amount: number;
  reference: string;
  metadata?: any;
  timestamp: string;
}> = [];

const getFetch = async () => (await import("node-fetch")).default;

router.post("/initialize", async (req: Request, res: Response) => {
  const { amount, email, metadata } = req.body;

  if (!amount || !email) {
    res.status(400).json({ message: "Amount and email are required" });
    return;
  }

  try {
    const fetch = await getFetch();

    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          currency: "KES",
          metadata,
          callback_url: `${process.env.FRONTEND_URL}/quiz?step=verify`,
        }),
      }
    );

    const data: any = await response.json();

    if (!data.status) {
      res.status(400).json({ message: "Paystack init failed", data });
      return;
    }

    res.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      amount,
    });
  } catch (error) {
    console.error("Paystack init error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify/:reference", async (req: Request, res: Response) => {
  const { reference } = req.params;

  if (!reference) {
    res.status(400).json({ message: "Reference is required" });
    return;
  }

  try {
    const fetch = await getFetch();

    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data: any = await response.json();

    if (!data.status) {
      res.status(400).json({ message: "Verification failed", data });
      return;
    }

    res.json(data.data);
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    const signature = req.headers["x-paystack-signature"] as string;

    if (!signature) {
      res.status(400).send("Missing signature");
      return;
    }

    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(req.body)
      .digest("hex");

    if (hash !== signature) {
      res.status(400).send("Invalid signature");
      return;
    }

    let event;
    try {
      event = JSON.parse(req.body.toString());
    } catch {
      res.status(400).send("Invalid JSON");
      return;
    }

    if (event.event === "charge.success") {
      const payment = {
        email: event.data.customer.email,
        amount: event.data.amount,
        reference: event.data.reference,
        metadata: event.data.metadata,
        timestamp: event.data.paid_at || new Date().toISOString(),
      };

      paidUsers.push(payment);

      console.log("Webhook payment saved:", payment);
    }

    res.status(200).send("OK");
  }
);

router.get("/history", async (req: Request, res: Response): Promise<void> => {
  try {
    const fetch = await getFetch();

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    const data: any = await response.json();

    if (!data.status) {
      res.status(400).json({ message: "Fetching history failed", data });
      return;
    }

    const historyPayments = data.data.map((txn: any) => ({
      email: txn.customer?.email,
      amount: txn.amount,
      reference: txn.reference,
      metadata: txn.metadata,
      timestamp: txn.paid_at,
    }));

    res.json({
      total: historyPayments.length,
      payments: historyPayments,
    });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const fetch = await getFetch();

    // fetch historical transactions
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    const data: any = await response.json();

    const historyPayments = data.status
      ? data.data.map((txn: any) => ({
          email: txn.customer?.email,
          amount: txn.amount,
          reference: txn.reference,
          metadata: txn.metadata,
          timestamp: txn.paid_at,
        }))
      : [];

    // merge + dedupe by reference
    const all = [...historyPayments, ...paidUsers];

    const deduped = Array.from(
      new Map(all.map((p) => [p.reference, p])).values()
    );

    res.json({
      total: deduped.length,
      payments: deduped,
    });
  } catch (err) {
    console.error("ALL payments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export const paymentRouter = router;
