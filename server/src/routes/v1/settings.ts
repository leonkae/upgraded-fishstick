import express from "express";
import { getSettings, updateSettings } from "@/controllers/settings";

export const settingsRouter = express.Router();

settingsRouter.get("/", getSettings);
settingsRouter.put("/", updateSettings);
