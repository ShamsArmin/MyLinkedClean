import { pgTable, text, varchar, timestamp, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Support contact messages table
export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  message: text("message").notNull(),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  status: varchar("status", { length: 20 }).notNull().default("open"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by", { length: 255 }),
  adminNotes: text("admin_notes"),
});

// Zod schemas
export const insertSupportMessageSchema = createInsertSchema(supportMessages).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
  resolvedBy: true,
  adminNotes: true,
});

export const updateSupportMessageSchema = createInsertSchema(supportMessages).partial().omit({
  id: true,
  createdAt: true,
});

export const selectSupportMessageSchema = createSelectSchema(supportMessages);

export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;
export type UpdateSupportMessage = z.infer<typeof updateSupportMessageSchema>;
export type SupportMessage = z.infer<typeof selectSupportMessageSchema>;