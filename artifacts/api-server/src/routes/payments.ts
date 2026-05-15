import { Router } from "express";
import { db } from "@workspace/db";
import { paymentsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router = Router();

// List all payments
router.get("/payments", async (req, res) => {
  try {
    const { status, month } = req.query;
    let payments = await db.query.paymentsTable.findMany({
      orderBy: [desc(paymentsTable.paymentMonth)],
    });

    if (status) payments = payments.filter(p => p.status === status);
    if (month) payments = payments.filter(p => p.paymentMonth === month);

    return res.json(payments.map(p => ({
      ...p,
      amount: parseFloat(p.amount as string),
      processedAt: p.processedAt?.toISOString() ?? null,
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing payments");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
