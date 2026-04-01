// src/middleware/auth.ts
import { NextFunction, Request, Response } from "express";

import { AUTH_COOKIE_NAME } from "@/constants";
import { AuthError, ForbiddenError } from "@/errors/auth";
import { verifyJWT } from "@/utils";
import { IJWTPayload } from "@/types"; // ← ADD THIS IMPORT

// Re-exports for easier imports elsewhere
export { AuthError } from "@/errors/auth";
export { ForbiddenError } from "@/errors/auth";
export { NotFoundError } from "@/errors/not-found";

declare global {
  namespace Express {
    interface Request {
      userID?: string;
      user?: {
        _id: string;
        role: string;
        email?: string;
        name?: string;
      };
    }
  }
}

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[AUTH_COOKIE_NAME];
  if (!token) {
    throw new AuthError("Authentication required");
  }

  try {
    const decoded = await verifyJWT<IJWTPayload>(token, true);

    const userData = decoded.user;

    if (!userData?._id || !userData?.role) {
      console.error("Invalid token payload:", decoded);
      throw new AuthError("Invalid token payload");
    }

    req.userID = userData._id;
    req.user = {
      _id: userData._id,
      role: userData.role,
      email: userData.email,
      name: userData.name,
    };

    next();
  } catch (error: any) {
    console.error("Authentication failed:", error.message);
    throw new AuthError("Invalid or expired session");
  }
};

// Admin protection middleware
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    console.error("requireAdmin: No req.user found");
    throw new AuthError("Authentication required");
  }

  if (req.user.role !== "admin") {
    console.error(`requireAdmin: User role is "${req.user.role}", not admin`);
    throw new ForbiddenError("Admin access only");
  }

  next();
};
