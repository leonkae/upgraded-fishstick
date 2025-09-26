import { Router } from "express";
import { createResponse, getResponses } from "@/controllers/response";
import { authenticate } from "@/middleware/auth";

const responseRouter = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// responseRouter.post("/", authenticate, asyncHandler(createResponse));
// responseRouter.get("/", authenticate, asyncHandler(getResponses));

responseRouter.post("/", asyncHandler(createResponse));
responseRouter.get("/", asyncHandler(getResponses));

export { responseRouter };
