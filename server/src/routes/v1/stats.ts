import express from "express";
import { getStats, exportUsersCsv } from "@/controllers/stats"; // adjust path if in different file

export const statsRouter = express.Router();

statsRouter.get("/", getStats);
statsRouter.get("/export-users", exportUsersCsv); // ← new route
