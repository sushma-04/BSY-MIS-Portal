import { Router } from "express";
import { db } from "@workspace/db";
import { sansthaTable, beneficiariesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

// List sansthas
router.get("/sanstha", async (req, res) => {
  try {
    const sansthas = await db.query.sansthaTable.findMany({
      orderBy: [desc(sansthaTable.createdAt)],
    });

    return res.json(sansthas.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing sansthas");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get sanstha
router.get("/sanstha/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sanstha = await db.query.sansthaTable.findFirst({ where: eq(sansthaTable.id, id) });
    if (!sanstha) return res.status(404).json({ error: "Sanstha not found" });

    return res.json({
      ...sanstha,
      createdAt: sanstha.createdAt.toISOString(),
      updatedAt: sanstha.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting sanstha");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get sanstha students
router.get("/sanstha/:id/students", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const students = await db.query.beneficiariesTable.findMany({
      where: eq(beneficiariesTable.sansthaId, id),
    });

    return res.json(students.map(b => ({
      ...b,
      monthlyAmount: parseFloat(b.monthlyAmount as string),
      sansthaName: null,
      approvalDate: b.approvalDate.toISOString(),
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Error getting students");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
