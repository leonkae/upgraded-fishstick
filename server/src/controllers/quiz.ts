import { Request, Response } from "express";

import { Option, Question } from "@/db/models";
import { withTransaction } from "@/utils/db";

export const createQuiz = async (req: Request, res: Response) => {
  // The quiz data will be an array of objects containing the questions and their options
  const { quizData } = req.body;

  const result = await withTransaction(async (session) => {
    const savedQuestions = [];

    for (const question of quizData) {
      const savedQuestion = await Question.create(
        [
          {
            text: question.text,
            order: question.order,
          },
        ],
        { session }
      ).then((docs) => docs[0]);

      if (Array.isArray(question.options)) {
        const options = question.options.map((option: any) => ({
          ...option,
          question: savedQuestion._id,
        }));

        await Option.insertMany(options, { session });
      }

      savedQuestions.push(savedQuestion);
    }

    return savedQuestions;
  });

  res.json({
    message: "Quiz created successfully",
    data: result,
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
