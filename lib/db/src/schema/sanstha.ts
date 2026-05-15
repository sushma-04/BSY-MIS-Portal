import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sansthaTable = pgTable("sanstha", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  district: text("district").notNull(),
  maxStudents: integer("max_students").notNull().default(200),
  enrolledCount: integer("enrolled_count").notNull().default(0),
  contactPerson: text("contact_person").notNull(),
  mobile: text("mobile").notNull(),
  bankAccount: text("bank_account"),
  ifscCode: text("ifsc_code"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSansthaSchema = createInsertSchema(sansthaTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSanstha = z.infer<typeof insertSansthaSchema>;
export type Sanstha = typeof sansthaTable.$inferSelect;
