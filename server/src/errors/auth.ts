// src/errors/auth.ts
export class AuthError extends Error {
  statusCode = 401;
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthError";
  }
}

// src/errors/forbidden.ts  (or inside index.ts)
export class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message: string = "Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }
}

// Then in src/errors/index.ts
