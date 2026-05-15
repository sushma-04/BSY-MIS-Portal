import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, otpCodesTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";

const router = Router();

// Send OTP
router.post("/auth/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: "Valid 10-digit mobile number required" });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate old OTPs
    await db.update(otpCodesTable).set({ used: true }).where(eq(otpCodesTable.mobile, mobile));

    await db.insert(otpCodesTable).values({ mobile, code, used: false, expiresAt });

    req.log.info({ mobile }, "OTP sent");
    // In production this would send SMS; for dev we return the OTP
    return res.json({ message: "OTP sent successfully", expiresIn: 600, otp: code });
  } catch (err) {
    req.log.error({ err }, "Error sending OTP");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Verify OTP and login (or auto-register)
router.post("/auth/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ error: "Mobile and OTP required" });
    }

    const otpRecord = await db.query.otpCodesTable.findFirst({
      where: and(
        eq(otpCodesTable.mobile, mobile),
        eq(otpCodesTable.code, otp),
        eq(otpCodesTable.used, false),
        gt(otpCodesTable.expiresAt, new Date())
      ),
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await db.update(otpCodesTable).set({ used: true }).where(eq(otpCodesTable.id, otpRecord.id));

    let user = await db.query.usersTable.findFirst({ where: eq(usersTable.mobile, mobile) });
    if (!user) {
      const [newUser] = await db.insert(usersTable).values({
        mobile,
        name: `User ${mobile.slice(-4)}`,
        role: "applicant",
        status: "active",
      }).returning();
      user = newUser;
    }

    (req.session as any).userId = user.id;

    return res.json({
      user: {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        role: user.role,
        district: user.district,
        sansthaId: user.sansthaId,
        status: user.status,
        createdAt: user.createdAt,
      },
      token: `session-${user.id}`,
      message: "Login successful",
    });
  } catch (err) {
    req.log.error({ err }, "Error verifying OTP");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Register applicant
router.post("/auth/register", async (req, res) => {
  try {
    const { mobile, name, otp } = req.body;
    if (!mobile || !name || !otp) {
      return res.status(400).json({ error: "Mobile, name, and OTP required" });
    }

    const otpRecord = await db.query.otpCodesTable.findFirst({
      where: and(
        eq(otpCodesTable.mobile, mobile),
        eq(otpCodesTable.code, otp),
        eq(otpCodesTable.used, false),
        gt(otpCodesTable.expiresAt, new Date())
      ),
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await db.update(otpCodesTable).set({ used: true }).where(eq(otpCodesTable.id, otpRecord.id));

    const existing = await db.query.usersTable.findFirst({ where: eq(usersTable.mobile, mobile) });
    if (existing) {
      (req.session as any).userId = existing.id;
      return res.status(201).json({
        user: { id: existing.id, mobile: existing.mobile, name: existing.name, role: existing.role, district: existing.district, sansthaId: existing.sansthaId, status: existing.status, createdAt: existing.createdAt },
        token: `session-${existing.id}`,
        message: "Already registered, logged in",
      });
    }

    const [user] = await db.insert(usersTable).values({ mobile, name, role: "applicant", status: "active" }).returning();
    (req.session as any).userId = user.id;

    return res.status(201).json({
      user: { id: user.id, mobile: user.mobile, name: user.name, role: user.role, district: user.district, sansthaId: user.sansthaId, status: user.status, createdAt: user.createdAt },
      token: `session-${user.id}`,
      message: "Registration successful",
    });
  } catch (err) {
    req.log.error({ err }, "Error registering");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Staff login
router.post("/auth/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await db.query.usersTable.findFirst({
      where: and(eq(usersTable.mobile, username), eq(usersTable.role, role || "gimaba")),
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    (req.session as any).userId = user.id;

    return res.json({
      user: { id: user.id, mobile: user.mobile, name: user.name, role: user.role, district: user.district, sansthaId: user.sansthaId, status: user.status, createdAt: user.createdAt },
      token: `session-${user.id}`,
      message: "Login successful",
    });
  } catch (err) {
    req.log.error({ err }, "Error in staff login");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Logout
router.post("/auth/logout", (req, res) => {
  (req.session as any).userId = null;
  return res.json({ message: "Logged out successfully" });
});

// Get current user
router.get("/auth/me", async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user.id,
      mobile: user.mobile,
      name: user.name,
      role: user.role,
      district: user.district,
      sansthaId: user.sansthaId,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting current user");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
