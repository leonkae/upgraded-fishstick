import { Request, Response } from "express";
import { GuestResponseModel } from "@/db/models/guest-response";
// import { PaymentModel } from "@/db/models/payment";
// import { PremiumUserModel } from "@/db/models/premium-user";

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await GuestResponseModel.distinct("userInfo.email").then(
      (arr) => arr.length
    );

    const activeUsers = await GuestResponseModel.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // const premiumUsers = await GuestResponseModel.countDocuments({
    //   "userInfo.isPremium": true,
    // });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = await GuestResponseModel.countDocuments({
      createdAt: { $gte: today },
    });

    const recentQuiz = await GuestResponseModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentActivity = recentQuiz.map((item) => ({
      type: "Quiz completed",
      name: item.userInfo.name,
      email: item.userInfo.email,
      time: item.createdAt,
      result: item.responses.reduce((sum, r) => sum + r.score, 0),
    }));

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        // premiumUsers,
        newToday,
        recentActivity,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
