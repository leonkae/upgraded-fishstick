import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import zlib from "zlib";
import { IAPIResponse, IJWTPayload, IJWTUser } from "@/types";
import { COOKIE_OPTIONS, JWT_SECRET } from "@/constants";

// =============================================
// Response Helper
// =============================================
export const respond = <T>(
  res: Response,
  data: T,
  status: number = 200,
  success: boolean = true
) => {
  const response: IAPIResponse<T> = { success, data };
  return res.status(status).json(response);
};

// =============================================
// JWT Compression Helpers
// =============================================
export const generateCompressedJWT = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    zlib.gzip(token, (err, compressedToken) => {
      if (err) return reject(err);
      resolve(compressedToken.toString("base64"));
    });
  });
};

export const decompressJWT = (compressedToken: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tokenBuffer = Buffer.from(compressedToken, "base64");
    zlib.gunzip(tokenBuffer, (err, decompressedToken) => {
      if (err) return reject(err);
      resolve(decompressedToken.toString());
    });
  });
};

// =============================================
// Generic JWT Functions (Fixed)
// =============================================

/**
 * Generate JWT token - works with any payload type
 */
export const generateJWT = async <T extends object = IJWTPayload>(
  payload: T,
  compressed: boolean = false
): Promise<string> => {
  // Ensure secret is treated as jwt.Secret
  const secret = JWT_SECRET as jwt.Secret;

  const token = jwt.sign(payload, secret, {
    expiresIn: "1d",
  });

  return compressed ? await generateCompressedJWT(token) : token;
};

/**
 * Verify JWT token - supports compressed tokens + better error handling
 */
export const verifyJWT = async <T extends object = IJWTPayload>(
  token: string,
  compressed: boolean = false
): Promise<T> => {
  try {
    const jwtToken = compressed ? await decompressJWT(token) : token;

    const secret = JWT_SECRET as jwt.Secret;

    const decoded = jwt.verify(jwtToken, secret) as T;

    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired. Please log in again.");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    if (error.name === "NotBeforeError") {
      throw new Error("Token not yet active");
    }

    console.error("JWT verification error:", error);
    throw new Error("Error verifying token");
  }
};

// =============================================
// Cookie Helpers
// =============================================
export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = COOKIE_OPTIONS
) => {
  res.cookie(name, value, options);
};

export const clearCookie = (
  res: Response,
  name: string,
  options: CookieOptions = COOKIE_OPTIONS
) => {
  const clearOptions = { ...options };
  delete clearOptions.maxAge;
  res.clearCookie(name, clearOptions);
};
