import { Request, Response } from "express";
import { GuestResponseModel } from "@/db/models/guest-response";

export const getStats = async (req: Request, res: Response) => {
  try {
    // Total unique users based on email
    const totalUsers = await GuestResponseModel.distinct("userInfo.email").then(
      (arr) => arr.length
    );

    // Active users in the last 7 days
    const activeUsers = await GuestResponseModel.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // New users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = await GuestResponseModel.countDocuments({
      createdAt: { $gte: today },
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newToday,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
