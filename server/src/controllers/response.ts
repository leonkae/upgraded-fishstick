// server/src/controllers/response.ts
import { Request, Response } from "express";
import { GuestResponseModel } from "@/db/models/guest-response";
import { respond } from "@/utils";

export const createResponse = async (req: Request, res: Response) => {
  try {
    const { userInfo, responses } = req.body;

    console.log("Incoming payload:", JSON.stringify(req.body, null, 2));

    if (!userInfo || !responses) {
      return res.status(400).json({ message: "Missing userInfo or responses" });
    }

    // Save guest submission directly
    const guestResponse = await GuestResponseModel.create({
      userInfo,
      responses,
    });

    respond(
      res,
      {
        message: "Guest response saved successfully",
        data: guestResponse,
      },
      201
    );
  } catch (err: any) {
    console.error("Error in createResponse:", err.message, err.stack);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const getResponses = async (req: Request, res: Response) => {
  try {
    const responses = await GuestResponseModel.find().sort({ createdAt: -1 });
    respond(res, { message: "Guest responses retrieved", data: responses });
  } catch (err: any) {
    console.error("Error in getResponses:", err.message, err.stack);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
