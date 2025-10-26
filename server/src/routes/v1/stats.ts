import express from "express";
import { getStats } from "@/controllers/stats";

export const statsRouter = express.Router();

statsRouter.get("/", getStats);
