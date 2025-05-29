import { Request, Response } from "express";

export const createDonation = async (req: Request, res: Response) => {
  res.json({
    message: "Donation created successfully",
  });
};

export const getDonations = async (req: Request, res: Response) => {
  res.json({
    message: "Donations endpoint",
  });
};
