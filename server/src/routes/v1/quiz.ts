import { createQuiz } from "@/controllers";
import { Router } from "express";

const quizRouter = Router();

quizRouter.post("/", createQuiz);

export { quizRouter };
