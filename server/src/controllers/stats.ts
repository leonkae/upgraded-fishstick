import { Request, Response } from "express";
import { GuestResponseModel } from "@/db/models/guest-response";
import { respond } from "@/utils"; // assuming this is your helper

export const getStats = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Total count for pagination
    const totalCount = await GuestResponseModel.countDocuments({});

    // Unique users (by email)
    const totalUsers = await GuestResponseModel.distinct("userInfo.email").then(
      (arr) => arr.length
    );

    // Active users (any submission in last 7 days)
    const activeUsers = await GuestResponseModel.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // New today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = await GuestResponseModel.countDocuments({
      createdAt: { $gte: today },
    });

    // Fetch paginated recent quiz data — EXPLICITLY select ageRange
    const recentQuiz = await GuestResponseModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "userInfo.name userInfo.email userInfo.ageRange createdAt responses.score"
      ) // ← added ageRange + score
      .lean();

    // Format for frontend (now includes ageRange)
    const recentActivity = recentQuiz.map((item) => ({
      type: "Quiz completed",
      name: item.userInfo?.name || "Guest",
      email: item.userInfo?.email || "—",
      ageRange: item.userInfo?.ageRange || "—", // ← FIXED: now included!
      result:
        item.responses?.reduce(
          (sum: number, r: any) => sum + (r.score || 0),
          0
        ) || 0,
      time: item.createdAt?.toISOString() || new Date().toISOString(),
    }));

    // Return everything your frontend expects
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newToday,
        recentActivity,
        totalCount,
      },
    });
  } catch (err: any) {
    console.error("Error fetching dashboard stats:", err.message, err.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
