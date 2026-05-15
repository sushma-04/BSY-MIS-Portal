import { Router } from "express";
import { db } from "@workspace/db";
import { schemesTable } from "@workspace/db";

const router = Router();

router.get("/schemes", async (req, res) => {
  try {
    const schemes = await db.query.schemesTable.findMany();
    return res.json(schemes.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing schemes");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
