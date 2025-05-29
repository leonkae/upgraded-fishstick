import { createQuiz, getQuiz } from "@/controllers";
import { Router } from "express";

const quizRouter = Router();

quizRouter.post("/", createQuiz);
quizRouter.get("/", getQuiz);

export { quizRouter };
