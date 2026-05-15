import { pgTable, text, serial, timestamp, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const beneficiariesTable = pgTable("beneficiaries", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  childName: text("child_name").notNull(),
  district: text("district").notNull(),
  approvalDate: timestamp("approval_date", { withTimezone: true }).notNull().defaultNow(),
  sansthaId: integer("sanstha_id"),
  beneficiaryCategory: text("beneficiary_category").notNull(),
  monthlyAmount: numeric("monthly_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"),
  aadhaarSeeded: boolean("aadhaar_seeded").notNull().default(false),
  kycDone: boolean("kyc_done").notNull().default(false),
  eligibilityRisk: boolean("eligibility_risk").notNull().default(false),
  renewalDue: boolean("renewal_due").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBeneficiarySchema = createInsertSchema(beneficiariesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export type Beneficiary = typeof beneficiariesTable.$inferSelect;
