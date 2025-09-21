import { Request, Response } from "express";

import { Question, Option } from "@/db/models";
import { withTransaction } from "@/utils/db";
import { respond } from "@/utils";

export const createQuiz = async (req: Request, res: Response) => {
  // Accept either:
  // - { quizData: [ { text, order, options: [{ text, value }] }, ... ] }  (bulk)
  // - { text, order, options: [{ text, value }] } (single)
  const { quizData, text, order, options } = req.body;

  if (Array.isArray(quizData)) {
    const savedQuestions = await withTransaction(async (session) => {
      const saved = [];
      for (const q of quizData) {
        const savedQ = await Question.create(
          [{ text: q.text, order: q.order ?? 0 }],
          { session }
        ).then((docs) => docs[0]);

        if (Array.isArray(q.options)) {
          const opts = q.options.map((o: any) => ({
            label: o.label,
            score: o.score,
            question: savedQ._id,
          }));
          await Option.insertMany(opts, { session });
        }

        saved.push(
          await Question.findById(savedQ._id).populate("options").lean()
        );
      }
      return saved;
    });

    return respond(
      res,
      { message: "Quiz created (bulk)", quiz: savedQuestions },
      201
    );
  }

  // single question
  const saved = await withTransaction(async (session) => {
    const savedQ = await Question.create([{ text, order: order ?? 0 }], {
      session,
    }).then((docs) => docs[0]);

    if (Array.isArray(options)) {
      const opts = options.map((o: any) => ({
        label: o.label,
        score: o.score,
        question: savedQ._id,
      }));
      await Option.insertMany(opts, { session });
    }

    const populated = await Question.findById(savedQ._id).populate("options");
    return populated;
  });

  return respond(res, { message: "Question created", question: saved }, 201);
};

export const getQuiz = async (req: Request, res: Response) => {
  const quiz = await Question.find().sort({ order: 1 }).populate("options");
  respond(res, {
    message: "Quiz retrieved successfully",
    quiz,
  });
};

export const updateQuiz = async (req: Request, res: Response) => {
  const { text, order, status, options } = req.body;
  const { id } = req.params;

  const updated = await withTransaction(async (session) => {
    const q = await Question.findByIdAndUpdate(
      id,
      { text, order, status },
      { new: true, session }
    );

    if (!q) throw new Error("Question not found");

    if (Array.isArray(options)) {
      // Replace options for simplicity
      await Option.deleteMany({ question: q._id }, { session });
      const optionDocs = options.map((o: any) => ({
        label: o.label,
        score: o.score,
        question: q._id,
      }));
      await Option.insertMany(optionDocs, { session });
    }

    return await Question.findById(q._id).populate("options");
  });

  respond(res, { message: "Question updated", question: updated });
};

export const deleteQuiz = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Option.deleteMany({ question: id });
  await Question.findByIdAndDelete(id);
  res.status(204).end();
};
