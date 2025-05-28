import { Request, Response } from "express";

export const createQuestionnaire = (req: Request, res: Response) => {
  res.json({
    message: "Questionnaire created successfully",
  });
};

export const getQuestionnaire = (req: Request, res: Response) => {
  res.json({
    message: "Questionnaire endpoint",
  });
};

export const updateQuestionnaire = (req: Request, res: Response) => {
  res.json({
    message: "Questionnaire updated successfully",
  });
};

export const deleteQuestionnaire = (req: Request, res: Response) => {
  res.json({
    message: "Questionnaire deleted successfully",
  });
};
