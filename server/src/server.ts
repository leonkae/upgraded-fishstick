import "express-async-errors";
import express from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

import { v1Router } from "@/routes/v1";
import { FRONTEND_URL, ISPROD, PORT } from "@/constants";
import { errorHandler } from "@/middleware";
import { NotFoundError } from "@/errors/not-found";
import { connectToDatabase } from "@/db/config";
import cookieParser from "cookie-parser";
import { quizRouter } from "./routes/v1/quiz";

// CONFIGURATION
connectToDatabase();

const app = express();

// MIDDLEWARE

// Helmet helps secure the application by setting various HTTP headers
app.use(helmet());
app.use(cookieParser());
app.use(compression());

// Cors
// Allow requests from the frontend
app.use(
  cors({
    origin: ISPROD ? FRONTEND_URL : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Morgan
app.use(morgan("dev"));

// Parse incoming requests with JSON payloads
app.use(express.json());

// ROUTES

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Silence is golden",
  });
});

// Version 1 API routes
app.use("/api/v1", v1Router);

// Catch all route. If a request reaches this point, it means the requested route does not exist.
app.all("*", async () => {
  throw new NotFoundError();
});

// Error handler
// Catches all errors thrown anywhere in the application, and sends a response to the client.
// This middleware along with the express-async-errors rids us of the need to use try-catch blocks in our application.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on PORT " + PORT);
});
