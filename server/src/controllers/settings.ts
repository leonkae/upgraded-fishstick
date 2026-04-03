import { Request, Response } from "express";
import { Setting } from "@/db/models/settings";

export const getSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settings = await Setting.findOne();

    // Instead of 404, return default values to keep the frontend happy
    if (!settings) {
      res.json({
        success: true,
        data: {
          appName: "The Future of Man",
          appDescription: "A fun and introspective quiz.",
          shareImage:
            "https://images.pexels.com/photos/3776808/pexels-photo-3776808.jpeg",
        },
      });
      return;
    }

    res.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting(data);
    } else {
      Object.assign(settings, data);
    }

    await settings.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
