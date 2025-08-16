import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db";
import { users, links } from "../shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Middleware to ensure JSON body is parsed
router.use((req, res, next) => {
  if (!req.is("application/json")) {
    return res.status(400).json({ message: "Invalid content type. Expected application/json." });
  }
  next();
});

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

// DELETE /api/profile - delete logged-in user's account and links
router.delete("/profile", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: number } | undefined;
    if (!user?.id) {
      return res.status(400).json({ message: "No valid user in session" });
    }
    const userId = user.id;

    // 1) Delete only from the two known tables
    await db.delete(links).where(eq(links.userId, userId)).execute();
    await db.delete(users).where(eq(users.id, userId)).execute();

    // 2) Destroy the session so the cookie is invalidated
    req.session.destroy(err => {
      if (err) console.error("Session destroy error:", err);
    });

    return res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    console.error("DELETE /profile error:", err);
    return res.status(500).json({ message: "Failed to delete account" });
  }
});

export { router as userRoutes };
