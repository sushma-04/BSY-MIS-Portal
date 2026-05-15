import { Router } from "express";
import { db } from "@workspace/db";
import { meetingsTable, applicationsTable, beneficiariesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

// List meetings
router.get("/meetings", async (req, res) => {
  try {
    const meetings = await db.query.meetingsTable.findMany({
      orderBy: [desc(meetingsTable.scheduledDate)],
    });

    return res.json(meetings.map(m => ({
      ...m,
      scheduledDate: m.scheduledDate.toISOString(),
      createdAt: m.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing meetings");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Schedule meeting
router.post("/meetings", async (req, res) => {
  try {
    const { applicationId, scheduledDate, mode, venueOrLink } = req.body;

    const [meeting] = await db.insert(meetingsTable).values({
      applicationId,
      scheduledDate: new Date(scheduledDate),
      mode,
      venueOrLink,
      status: "scheduled",
    }).returning();

    await db.update(applicationsTable)
      .set({ status: "pwc_scheduled" })
      .where(eq(applicationsTable.id, applicationId));

    return res.status(201).json({
      ...meeting,
      scheduledDate: meeting.scheduledDate.toISOString(),
      createdAt: meeting.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error scheduling meeting");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get meeting
router.get("/meetings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const meeting = await db.query.meetingsTable.findFirst({ where: eq(meetingsTable.id, id) });
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    return res.json({
      ...meeting,
      scheduledDate: meeting.scheduledDate.toISOString(),
      createdAt: meeting.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting meeting");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Record decision
router.post("/meetings/:id/decision", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { decision, decisionReason, minutes } = req.body;

    const [meeting] = await db.update(meetingsTable)
      .set({ decision, decisionReason, minutes: minutes ?? null, status: "completed" })
      .where(eq(meetingsTable.id, id))
      .returning();

    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // Update application status
    const newStatus = decision === "approved" ? "approved" : "rejected";
    await db.update(applicationsTable)
      .set({ status: newStatus })
      .where(eq(applicationsTable.id, meeting.applicationId));

    // If approved, create beneficiary
    if (decision === "approved") {
      const app = await db.query.applicationsTable.findFirst({
        where: eq(applicationsTable.id, meeting.applicationId),
      });
      if (app) {
        const monthlyAmount = app.beneficiaryCategory === "covid_orphan" || app.beneficiaryCategory === "orphan" ? "2500" : "2250";
        await db.insert(beneficiariesTable).values({
          applicationId: app.id,
          childName: app.childName,
          district: app.district,
          sansthaId: app.sansthaId ?? null,
          beneficiaryCategory: app.beneficiaryCategory,
          monthlyAmount,
          status: "active",
          aadhaarSeeded: app.aadhaarSeeded,
          kycDone: false,
          eligibilityRisk: false,
          renewalDue: false,
        });
      }
    }

    return res.json({
      ...meeting,
      scheduledDate: meeting.scheduledDate.toISOString(),
      createdAt: meeting.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error recording decision");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
