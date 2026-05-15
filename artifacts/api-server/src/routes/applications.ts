import { Router } from "express";
import { db } from "@workspace/db";
import { applicationsTable, documentsTable, reviewsTable, sirReportsTable, notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

function generateAppNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `BSY/${year}/${rand}`;
}

function getCurrentFY() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

// Public track endpoint — no auth required
router.get("/applications/track/:appNumber", async (req, res) => {
  try {
    const appNumber = req.params.appNumber;
    const app = await db.query.applicationsTable.findFirst({
      where: eq(applicationsTable.applicationNumber, appNumber),
    });
    if (!app) return res.status(404).json({ error: "Application not found" });

    // Return a safe subset only
    return res.json({
      id: app.id,
      applicationNumber: app.applicationNumber,
      childName: app.childName,
      district: app.district,
      financialYear: app.financialYear,
      status: app.status,
      beneficiaryCategory: app.beneficiaryCategory,
      aadhaarSeeded: app.aadhaarSeeded,
      submittedAt: app.submittedAt?.toISOString() ?? null,
      createdAt: app.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error tracking application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// List applications
router.get("/applications", async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 20, 100);

    let applications = await db.query.applicationsTable.findMany({
      orderBy: [desc(applicationsTable.createdAt)],
    });

    if (status) {
      applications = applications.filter(a => a.status === status);
    }

    const total = applications.length;
    const paginated = applications.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      applications: paginated.map(a => ({
        ...a,
        annualIncome: parseFloat(a.annualIncome as string),
        submittedAt: a.submittedAt?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    req.log.error({ err }, "Error listing applications");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create application
router.post("/applications", async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const body = req.body;
    const [app] = await db.insert(applicationsTable).values({
      applicationNumber: generateAppNumber(),
      applicantId: userId,
      childName: body.childName,
      childDob: body.childDob,
      childGender: body.childGender,
      aadhaarNumber: body.aadhaarNumber,
      casteCategory: body.casteCategory,
      beneficiaryCategory: body.beneficiaryCategory,
      guardianName: body.guardianName,
      guardianMobile: body.guardianMobile,
      guardianRelationship: body.guardianRelationship,
      annualIncome: body.annualIncome.toString(),
      fatherStatus: body.fatherStatus,
      motherStatus: body.motherStatus,
      district: body.district,
      taluka: body.taluka,
      address: body.address,
      pincode: body.pincode,
      bankAccountNumber: body.bankAccountNumber,
      ifscCode: body.ifscCode,
      accountHolderName: body.accountHolderName,
      schoolName: body.schoolName,
      currentClass: body.currentClass,
      sansthaId: body.sansthaId,
      facilitatorType: body.facilitatorType,
      financialYear: getCurrentFY(),
      status: "draft",
      aadhaarSeeded: false,
    }).returning();

    return res.status(201).json({
      ...app,
      annualIncome: parseFloat(app.annualIncome as string),
      submittedAt: null,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error creating application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get application by ID
router.get("/applications/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const app = await db.query.applicationsTable.findFirst({ where: eq(applicationsTable.id, id) });
    if (!app) return res.status(404).json({ error: "Application not found" });

    return res.json({
      ...app,
      annualIncome: parseFloat(app.annualIncome as string),
      submittedAt: app.submittedAt?.toISOString() ?? null,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update application
router.patch("/applications/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    const updateData: Record<string, unknown> = {};

    if (body.childName) updateData.childName = body.childName;
    if (body.guardianName) updateData.guardianName = body.guardianName;
    if (body.address) updateData.address = body.address;
    if (body.annualIncome !== undefined) updateData.annualIncome = body.annualIncome.toString();
    if (body.bankAccountNumber) updateData.bankAccountNumber = body.bankAccountNumber;
    if (body.ifscCode) updateData.ifscCode = body.ifscCode;
    if (body.accountHolderName) updateData.accountHolderName = body.accountHolderName;
    if (body.schoolName !== undefined) updateData.schoolName = body.schoolName;
    if (body.currentClass !== undefined) updateData.currentClass = body.currentClass;

    const [app] = await db.update(applicationsTable).set(updateData).where(eq(applicationsTable.id, id)).returning();
    if (!app) return res.status(404).json({ error: "Application not found" });

    return res.json({
      ...app,
      annualIncome: parseFloat(app.annualIncome as string),
      submittedAt: app.submittedAt?.toISOString() ?? null,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error updating application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Submit application
router.post("/applications/:id/submit", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [app] = await db.update(applicationsTable)
      .set({ status: "submitted", submittedAt: new Date() })
      .where(eq(applicationsTable.id, id))
      .returning();

    if (!app) return res.status(404).json({ error: "Application not found" });

    return res.json({
      ...app,
      annualIncome: parseFloat(app.annualIncome as string),
      submittedAt: app.submittedAt?.toISOString() ?? null,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error submitting application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// List documents
router.get("/applications/:id/documents", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const docs = await db.query.documentsTable.findMany({
      where: eq(documentsTable.applicationId, id),
    });

    return res.json(docs.map(d => ({
      ...d,
      uploadedAt: d.uploadedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing documents");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Upload document
router.post("/applications/:id/documents", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { docType, fileUrl, fileName } = req.body;

    const [doc] = await db.insert(documentsTable).values({
      applicationId: id,
      docType,
      fileUrl,
      fileName,
      status: "pending",
    }).returning();

    return res.status(201).json({
      ...doc,
      uploadedAt: doc.uploadedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error uploading document");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GIMABA Review
router.post("/applications/:id/review", async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const id = parseInt(req.params.id);
    const { action, reason } = req.body;

    const statusMap: Record<string, string> = {
      approved: "under_review",
      rejected: "pending_documents",
      forwarded_to_po: "forwarded_to_po",
      requested_documents: "pending_documents",
    };

    await db.update(applicationsTable)
      .set({ status: statusMap[action] || "under_review" })
      .where(eq(applicationsTable.id, id));

    const [review] = await db.insert(reviewsTable).values({
      applicationId: id,
      reviewerId: userId,
      action,
      reason: reason || null,
    }).returning();

    return res.json({
      ...review,
      actionDate: review.actionDate.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error reviewing application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get SIR
router.get("/applications/:id/sir", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sir = await db.query.sirReportsTable.findFirst({
      where: eq(sirReportsTable.applicationId, id),
    });

    if (!sir) return res.status(404).json({ error: "SIR not found" });

    return res.json({
      ...sir,
      submittedAt: sir.submittedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting SIR");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Submit SIR
router.post("/applications/:id/sir", async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const id = parseInt(req.params.id);
    const { visitDate, geoLat, geoLng, photoUrls, recommendation, observations } = req.body;

    const [sir] = await db.insert(sirReportsTable).values({
      applicationId: id,
      poId: userId,
      visitDate,
      geoLat: geoLat ?? null,
      geoLng: geoLng ?? null,
      photoUrls: photoUrls || [],
      recommendation,
      observations,
    }).returning();

    await db.update(applicationsTable)
      .set({ status: "pwc_scheduled" })
      .where(eq(applicationsTable.id, id));

    return res.status(201).json({
      ...sir,
      submittedAt: sir.submittedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error submitting SIR");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
