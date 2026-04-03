// src/routes/v1/settings.ts
import express from "express";
import { getSettings, updateSettings } from "@/controllers/settings";

export const settingsRouter = express.Router();

settingsRouter.get("/", getSettings);
settingsRouter.put("/", updateSettings);
