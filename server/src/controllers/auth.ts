// src/controllers/auth.ts
import { Request, Response } from "express";
import { compare } from "bcrypt";
import crypto from "crypto";

import { clearCookie, generateJWT, respond, setCookie } from "@/utils";
import { BadRequestError } from "@/errors/bad-request";
import { AuthError } from "@/errors/auth";
import { AUTH_COOKIE_NAME, FRONTEND_URL } from "@/constants";
import { Email } from "@/providers/Email";
import { Token, User } from "@/db/models";
import { IJWTPayload } from "@/types";
export const register = async (req: Request, res: Response) => {
  // TODO: Use a timebound token (JWT) instead of a static token
  // generate a verification token
  const token = crypto.randomBytes(32).toString("hex");

  const user = await User.create(req.body);

  const tokenDoc = await Token.create({
    token,
    user: user._id,
    type: "email",
  });

  const email = new Email(req.body.email);

  const emailResponse = await email.sendEmailVerification(
    `${FRONTEND_URL}/auth/verify-email?token=${token}&email=${user.email}`
  );

  console.log({ emailResponse });

  if (!emailResponse || emailResponse.error) {
    // Delete the user and token if the email is not sent
    await User.findByIdAndDelete(user._id);
    await Token.findByIdAndDelete(tokenDoc._id);
    throw new BadRequestError(
      "Verification email not sent. Please register again."
    );
  }

  respond(
    res,
    {
      message:
        "Registration successful. Check your email for verification link.",
    },
    201
  );
};

export const verifyEmail = async (req: Request, res: Response) => {
  // Get the token and email from the query body
  const { token, email: userEmail } = req.body;

  // Find the details of the token
  const tokenDetails = await Token.findOne({
    token,
    type: "email",
    status: "active",
  });

  if (!tokenDetails) {
    throw new BadRequestError("Invalid token");
  }

  // Find the user through the user id in token and update the emailVerifiedOn field
  const updatedUser = await User.findByIdAndUpdate(tokenDetails.user, {
    emailVerifiedOn: new Date(),
  });

  if (!updatedUser) {
    throw new BadRequestError("Invalid token");
  }

  // Set the token status to inactive
  tokenDetails.status = "inactive";

  await tokenDetails.save();

  // Send a welcome email to the user
  const email = new Email(updatedUser.email);

  email.sendWelcomeEmail();

  respond(res, {
    message: "Email verified successfully",
  });
};

// FIXED LOGIN FUNCTION - Compatible with your current User model
export const login = async (req: Request, res: Response) => {
  console.log("=== LOGIN CONTROLLER STARTED ===");
  console.log("Body received:", JSON.stringify(req.body, null, 2));

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password" // in case you have select: false on password in schema
    );

    console.log("User found:", !!user);
    if (user) {
      console.log("→ Role:", user.role);
      console.log("→ Email in DB:", user.email);
    }

    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await compare(password, user.password);

    if (!passwordsMatch) {
      console.log("❌ Password does not match for user:", normalizedEmail);
      throw new BadRequestError("Invalid credentials");
    }

    // ==================== FIXED JWT PAYLOAD ====================
    const jwtPayload: IJWTPayload = {
      user: {
        _id: user._id.toString(),
        role: user.role || "user", // Make sure role is included
        email: user.email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      },
    };

    const token = await generateJWT(jwtPayload, true); // true = compressed

    setCookie(res, AUTH_COOKIE_NAME!, token);

    // Remove sensitive data before sending to client
    const { password: _, __v, ...safeUserData } = user.toObject();

    console.log("✅ Login successful for:", normalizedEmail);
    console.log("→ User role in token:", jwtPayload.user.role);

    respond(res, {
      message: "Login successful",
      user: safeUserData,
    });
  } catch (error: any) {
    console.error("❌ Login controller error:", error.message || error);
    throw error;
  }
};

// src/controllers/auth.ts → currentUser function

export const currentUser = async (req: Request, res: Response) => {
  try {
    if (!req.userID) {
      throw new AuthError("Authentication required");
    }

    const user = await User.findById(req.userID).select("-password -__v");

    if (!user) {
      throw new AuthError("User not found");
    }

    respond(res, {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role, // ← Make sure role is included
        name: `${user.firstName} ${user.lastName}`.trim(),
      },
    });
  } catch (error: any) {
    throw error;
  }
};

export const logout = async (req: Request, res: Response) => {
  clearCookie(res, AUTH_COOKIE_NAME!);

  respond(res, {
    message: "Logout successful",
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email: userEmail } = req.body;

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const token = crypto.randomBytes(32).toString("hex");

  await Token.create({
    token,
    user: user._id,
    type: "password",
  });

  const email = new Email(user.email);

  const resetLink = `${FRONTEND_URL}/auth/reset-password?token=${token}&email=${user.email}`;

  email.sendResetPasswordEmail(resetLink);

  respond(res, {
    message: "A reset password link has been sent to your email",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { password, token, email } = req.body;

  const tokenDetails = await Token.findOne({
    token,
    type: "password",
    status: "active",
  }).populate<{
    user: {
      _id: string;
      email: string;
    };
  }>("user", ["email"]);

  if (!tokenDetails || tokenDetails.user.email !== email) {
    throw new BadRequestError("Invalid token");
  }

  await User.findOneAndUpdate(
    {
      email,
    },
    {
      password,
    }
  );

  tokenDetails.status = "inactive";

  await tokenDetails.save();

  const sendEmail = new Email(email);

  sendEmail.sendPasswordChangedEmail();

  respond(res, {
    message: "Password reset successfully",
  });
};
