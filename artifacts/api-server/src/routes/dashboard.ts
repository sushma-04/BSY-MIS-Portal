import { Router } from "express";
import { db } from "@workspace/db";
import {
  applicationsTable,
  beneficiariesTable,
  paymentsTable,
  reviewsTable,
  meetingsTable,
} from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";

const router = Router();

// Dashboard stats
router.get("/dashboard/stats", async (req, res) => {
  try {
    const apps = await db.query.applicationsTable.findMany();
    const beneficiaries = await db.query.beneficiariesTable.findMany();
    const payments = await db.query.paymentsTable.findMany();

    const totalApplications = apps.length;
    const pendingReview = apps.filter(a => a.status === "submitted" || a.status === "under_review").length;
    const approvedBeneficiaries = beneficiaries.filter(b => b.status === "active").length;
    const rejectedApplications = apps.filter(a => a.status === "rejected").length;
    const pendingSIR = apps.filter(a => a.status === "forwarded_to_po").length;
    const pwcScheduled = apps.filter(a => a.status === "pwc_scheduled").length;
    const paymentSuccessCount = payments.filter(p => p.status === "success").length;
    const paymentFailureCount = payments.filter(p => p.status === "failed").length;
    const aadhaarPendingCount = beneficiaries.filter(b => !b.aadhaarSeeded).length;
    const renewalDueCount = beneficiaries.filter(b => b.renewalDue).length;
    const totalDisbursed = payments
      .filter(p => p.status === "success")
      .reduce((sum, p) => sum + parseFloat(p.amount as string), 0);

    return res.json({
      totalApplications,
      pendingReview,
      approvedBeneficiaries,
      rejectedApplications,
      pendingSIR,
      pwcScheduled,
      paymentSuccessCount,
      paymentFailureCount,
      aadhaarPendingCount,
      renewalDueCount,
      totalDisbursed,
      districtTarget: 500,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting dashboard stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Recent activity
router.get("/dashboard/recent-activity", async (req, res) => {
  try {
    const reviews = await db.query.reviewsTable.findMany({
      orderBy: [desc(reviewsTable.actionDate)],
      limit: 5,
    });

    const apps = await db.query.applicationsTable.findMany({
      orderBy: [desc(applicationsTable.createdAt)],
      limit: 5,
    });

    const activities = [
      ...reviews.map(r => ({
        id: r.id,
        type: "review",
        description: `Application #${r.applicationId} was ${r.action.replace(/_/g, " ")}`,
        applicationId: r.applicationId,
        timestamp: r.actionDate.toISOString(),
      })),
      ...apps.map(a => ({
        id: a.id + 10000,
        type: "application",
        description: `New application submitted for ${a.childName}`,
        applicationId: a.id,
        timestamp: a.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    return res.json(activities);
  } catch (err) {
    req.log.error({ err }, "Error getting recent activity");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
