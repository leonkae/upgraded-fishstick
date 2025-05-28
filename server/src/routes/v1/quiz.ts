import { Router } from "express";

const questionnaireRouter = Router();

questionnaireRouter.get("/", (req, res) => {
  res.json({
    message: "Questionnaire endpoint",
  });
});

export { questionnaireRouter };
