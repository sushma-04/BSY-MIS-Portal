import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

// List notifications
router.get("/notifications", async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const notifications = await db.query.notificationsTable.findMany({
      where: eq(notificationsTable.userId, userId),
      orderBy: [desc(notificationsTable.createdAt)],
    });

    return res.json(notifications.map(n => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing notifications");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Mark notification as read
router.post("/notifications/:id/read", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [notification] = await db.update(notificationsTable)
      .set({ isRead: true })
      .where(eq(notificationsTable.id, id))
      .returning();

    if (!notification) return res.status(404).json({ error: "Notification not found" });

    return res.json({
      ...notification,
      createdAt: notification.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error marking notification read");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
