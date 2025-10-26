import { Request, Response } from "express";
import { Setting } from "@/db/models/settings";

export const getSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settings = await Setting.findOne();
    if (!settings) {
      res.status(404).json({ success: false, message: "Settings not found" });
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
