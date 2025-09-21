// import { createQuiz, getQuiz } from "@/controllers";
import { createQuiz, getQuiz, updateQuiz, deleteQuiz } from "@/controllers";
import { Router } from "express";

const quizRouter = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

quizRouter.post("/", asyncHandler(createQuiz));
quizRouter.get("/", asyncHandler(getQuiz));
quizRouter.put("/:id", asyncHandler(updateQuiz));
quizRouter.delete("/:id", asyncHandler(deleteQuiz));

export { quizRouter };
