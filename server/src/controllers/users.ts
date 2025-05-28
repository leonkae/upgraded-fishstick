import { Request, Response } from "express";

export const createUser = (req: Request, res: Response) => {
  res.json({
    message: "User created successfully",
  });
};
