import { pgTable, text, serial, timestamp, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").notNull().unique(),
  applicantId: integer("applicant_id").notNull(),
  childName: text("child_name").notNull(),
  childDob: text("child_dob").notNull(),
  childGender: text("child_gender").notNull(),
  aadhaarNumber: text("aadhaar_number").notNull(),
  casteCategory: text("caste_category").notNull(),
  religion: text("religion"),
  beneficiaryCategory: text("beneficiary_category").notNull(),
  guardianName: text("guardian_name").notNull(),
  guardianMobile: text("guardian_mobile").notNull(),
  guardianRelationship: text("guardian_relationship"),
  guardianAadhaar: text("guardian_aadhaar"),
  guardianOccupation: text("guardian_occupation"),
  annualIncome: numeric("annual_income", { precision: 12, scale: 2 }).notNull(),
  fatherName: text("father_name"),
  fatherStatus: text("father_status").notNull(),
  motherName: text("mother_name"),
  motherStatus: text("mother_status").notNull(),
  district: text("district").notNull(),
  taluka: text("taluka").notNull(),
  address: text("address").notNull(),
  village: text("village"),
  gramPanchayat: text("gram_panchayat"),
  pincode: text("pincode").notNull(),
  schoolName: text("school_name"),
  currentClass: text("current_class"),
  schoolBoard: text("school_board"),
  bankAccountNumber: text("bank_account_number").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  bankName: text("bank_name"),
  accountHolderName: text("account_holder_name").notNull(),
  sansthaId: integer("sanstha_id"),
  facilitatorType: text("facilitator_type"),
  financialYear: text("financial_year").notNull(),
  status: text("status").notNull().default("draft"),
  aadhaarSeeded: boolean("aadhaar_seeded").notNull().default(false),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
