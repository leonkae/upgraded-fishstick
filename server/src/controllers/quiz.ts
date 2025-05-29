import { Request, Response } from "express";

import { Option, Question } from "@/db/models";
import { withTransaction } from "@/utils/db";
import { respond } from "@/utils";

export const createQuiz = async (req: Request, res: Response) => {
  // The quiz data will be an array of objects containing the questions and their options
  const { quizData } = req.body;

  const quiz = await withTransaction(async (session) => {
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

  respond(
    res,
    {
      message: "Quiz created successfully",
      quiz,
    },
    201
  );
};

export const getQuiz = async (req: Request, res: Response) => {
  const quiz = await Question.find().populate("options", ["label", "score"]);

  respond(res, {
    message: "Quiz retrieved successfully",
    quiz,
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
