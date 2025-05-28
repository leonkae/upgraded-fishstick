import { Request, Response } from "express";

export const createQuiz = (req: Request, res: Response) => {
  res.json({
    message: "Quiz created successfully",
  });
};

export const getQuiz = (req: Request, res: Response) => {
  res.json({
    message: "Quiz endpoint",
  });
};

export const updateQuiz = (req: Request, res: Response) => {
  res.json({
    message: "Quiz updated successfully",
  });
};

export const deleteQuiz = (req: Request, res: Response) => {
  res.json({
    message: "Quiz deleted successfully",
  });
};
