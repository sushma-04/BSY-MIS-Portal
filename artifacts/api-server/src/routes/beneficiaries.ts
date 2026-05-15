import { Router } from "express";
import { db } from "@workspace/db";
import { beneficiariesTable, paymentsTable, sansthaTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

// List beneficiaries
router.get("/beneficiaries", async (req, res) => {
  try {
    const { sansthaId, aadhaarSeeded } = req.query;

    let results = await db.query.beneficiariesTable.findMany({
      orderBy: [desc(beneficiariesTable.createdAt)],
    });

    if (sansthaId) {
      results = results.filter(b => b.sansthaId === parseInt(sansthaId as string));
    }
    if (aadhaarSeeded !== undefined) {
      results = results.filter(b => b.aadhaarSeeded === (aadhaarSeeded === "true"));
    }

    // Fetch sanstha names
    const sansthas = await db.query.sansthaTable.findMany();
    const sansthaMap = new Map(sansthas.map(s => [s.id, s.name]));

    return res.json(results.map(b => ({
      ...b,
      monthlyAmount: parseFloat(b.monthlyAmount as string),
      sansthaName: b.sansthaId ? sansthaMap.get(b.sansthaId) ?? null : null,
      approvalDate: b.approvalDate.toISOString(),
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing beneficiaries");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get beneficiary
router.get("/beneficiaries/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const beneficiary = await db.query.beneficiariesTable.findFirst({
      where: eq(beneficiariesTable.id, id),
    });

    if (!beneficiary) return res.status(404).json({ error: "Beneficiary not found" });

    const sanstha = beneficiary.sansthaId
      ? await db.query.sansthaTable.findFirst({ where: eq(sansthaTable.id, beneficiary.sansthaId) })
      : null;

    return res.json({
      ...beneficiary,
      monthlyAmount: parseFloat(beneficiary.monthlyAmount as string),
      sansthaName: sanstha?.name ?? null,
      approvalDate: beneficiary.approvalDate.toISOString(),
      createdAt: beneficiary.createdAt.toISOString(),
      updatedAt: beneficiary.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting beneficiary");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get payment history for beneficiary
router.get("/beneficiaries/:id/payments", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const payments = await db.query.paymentsTable.findMany({
      where: eq(paymentsTable.beneficiaryId, id),
      orderBy: [desc(paymentsTable.paymentMonth)],
    });

    return res.json(payments.map(p => ({
      ...p,
      amount: parseFloat(p.amount as string),
      processedAt: p.processedAt?.toISOString() ?? null,
    })));
  } catch (err) {
    req.log.error({ err }, "Error getting payments");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
