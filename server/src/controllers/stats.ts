import { Request, Response } from "express";
import { GuestResponseModel } from "@/db/models/guest-response";
import { respond } from "@/utils"; // assuming this is your helper
import { stringify } from "csv-stringify";

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

export const exportUsersCsv = async (req: Request, res: Response) => {
  try {
    // Set headers for file download
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="users-export-${new Date().toISOString().split("T")[0]}.csv"`
    );

    // Define CSV columns
    const columns = [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "ageRange", header: "Age Range" },
      { key: "latestScore", header: "Latest Quiz Score" },
      { key: "latestResult", header: "Latest Result" },
      { key: "lastQuizDate", header: "Last Quiz Date" },
      { key: "quizCount", header: "Number of Quizzes" },
    ];

    // Create streaming CSV writer
    const stringifier = stringify({
      header: true,
      columns,
      quoted: true, // quote all fields for safety
      quoted_string: true,
      cast: {
        string: (value) => value ?? "—",
      },
    });

    // Pipe CSV directly to response (low memory usage)
    stringifier.pipe(res);

    // Aggregate: one row per unique email, with latest data
    const aggregation = await GuestResponseModel.aggregate([
      {
        $group: {
          _id: "$userInfo.email",
          name: { $last: "$userInfo.name" },
          ageRange: { $last: "$userInfo.ageRange" },
          latestCreatedAt: { $max: "$createdAt" },
          latestResponses: { $last: "$responses" },
          quizCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          email: "$_id",
          name: { $ifNull: ["$name", "Guest"] },
          ageRange: { $ifNull: ["$ageRange", "—"] },
          latestScore: {
            $reduce: {
              input: "$latestResponses",
              initialValue: 0,
              in: { $add: ["$$value", { $ifNull: ["$$this.score", 0] }] },
            },
          },
          lastQuizDate: "$latestCreatedAt",
          quizCount: 1,
        },
      },
      { $sort: { lastQuizDate: -1 } }, // newest first
    ]);

    // Write rows
    for (const user of aggregation) {
      const result =
        user.latestScore >= 20
          ? "Heaven"
          : user.latestScore >= 10
            ? "In-Between"
            : "Hell";

      stringifier.write({
        name: user.name,
        email: user.email,
        ageRange: user.ageRange,
        latestScore: user.latestScore,
        latestResult: result,
        lastQuizDate: user.lastQuizDate.toISOString().split("T")[0],
        quizCount: user.quizCount,
      });
    }

    // End stream
    stringifier.end();
  } catch (err: any) {
    console.error("CSV export error:", err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Failed to generate export" });
    }
  }
};
