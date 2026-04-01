// src/routes/v1/admin.ts
import { Router } from "express";
import { authenticate, requireAdmin } from "@/middleware/auth";

const adminRouter = Router();

// Apply protection to every route inside admin
adminRouter.use(authenticate, requireAdmin);

// Example route
adminRouter.get("/dashboard", (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    userID: req.userID,
    userRole: req.user?.role,
    user: req.user,
  });
});

// Add more admin routes here later...
// adminRouter.get("/users", ...);
// adminRouter.get("/analytics", ...);

export { adminRouter };
