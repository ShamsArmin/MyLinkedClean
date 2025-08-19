import { Router, Request, Response } from "express";
import { db } from "../db"; // adjust path if needed
import { links } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * GET /api/links
 * Fetch all links for the authenticated user
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // 🔑 make sure auth middleware sets this
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const userLinks = await db.select().from(links).where(eq(links.userId, userId));
    res.json(userLinks);
  } catch (err: any) {
    console.error("Error fetching links:", err);
    res.status(500).json({ error: "Failed to fetch links" });
  }
});

/**
 * POST /api/links
 * Create a new link
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { platform, title, url, description, color, featured } = req.body;

    const [newLink] = await db
      .insert(links)
      .values({
        userId,
        platform,
        title,
        url,
        description,
        color,
        featured: featured ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json(newLink);
  } catch (err: any) {
    console.error("Error creating link:", err);
    res.status(500).json({ error: "Failed to create link" });
  }
});

/**
 * PUT /api/links/:id
 * Update an existing link
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const linkId = Number(req.params.id);
    const { platform, title, url, description, color, featured, order } = req.body;

    const [updated] = await db
      .update(links)
      .set({
        platform,
        title,
        url,
        description,
        color,
        featured,
        order,
        updatedAt: new Date(),
      })
      .where(eq(links.id, linkId))
      .returning();

    if (!updated) return res.status(404).json({ error: "Link not found" });

    res.json(updated);
  } catch (err: any) {
    console.error("Error updating link:", err);
    res.status(500).json({ error: "Failed to update link" });
  }
});

/**
 * DELETE /api/links/:id
 * Delete a link
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const linkId = Number(req.params.id);

    const [deleted] = await db
      .delete(links)
      .where(eq(links.id, linkId))
      .returning();

    if (!deleted) return res.status(404).json({ error: "Link not found" });

    res.status(204).send(); // ✅ no JSON, just success
  } catch (err: any) {
    console.error("Error deleting link:", err);
    res.status(500).json({ error: "Failed to delete link" });
  }
});

export default router;
