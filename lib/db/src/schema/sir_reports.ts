import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sirReportsTable = pgTable("sir_reports", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  poId: integer("po_id").notNull(),
  visitDate: text("visit_date").notNull(),
  geoLat: real("geo_lat"),
  geoLng: real("geo_lng"),
  photoUrls: text("photo_urls").array().notNull().default([]),
  recommendation: text("recommendation").notNull(),
  observations: text("observations").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSirReportSchema = createInsertSchema(sirReportsTable).omit({ id: true, createdAt: true, submittedAt: true });
export type InsertSirReport = z.infer<typeof insertSirReportSchema>;
export type SirReport = typeof sirReportsTable.$inferSelect;
