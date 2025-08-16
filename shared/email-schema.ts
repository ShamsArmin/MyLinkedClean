import { pgTable, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Email templates table
export const emailTemplates = pgTable("email_templates", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content").notNull(),
  type: text("type").notNull(), // 'signup', 'password_reset', 'marketing', 'news', 'welcome', etc.
  isActive: boolean("is_active").notNull().default(true),
  variables: jsonb("variables").notNull().default('{}'), // Template variables like {{name}}, {{email}}
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Email logs table
export const emailLogs = pgTable("email_logs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  templateId: integer("template_id").references(() => emailTemplates.id),
  recipientEmail: text("recipient_email").notNull(),
  recipientName: text("recipient_name"),
  subject: text("subject").notNull(),
  status: text("status").notNull(), // 'sent', 'failed', 'pending'
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at").defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Email campaigns table
export const emailCampaigns = pgTable("email_campaigns", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  templateId: integer("template_id").references(() => emailTemplates.id),
  recipientCount: integer("recipient_count").notNull().default(0),
  sentCount: integer("sent_count").notNull().default(0),
  openCount: integer("open_count").notNull().default(0),
  clickCount: integer("click_count").notNull().default(0),
  status: text("status").notNull().default('draft'), // 'draft', 'sending', 'sent', 'cancelled'
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Zod schemas
export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const selectEmailTemplateSchema = createSelectSchema(emailTemplates);

export const insertEmailLogSchema = createInsertSchema(emailLogs).omit({
  id: true,
  createdAt: true
});

export const selectEmailLogSchema = createSelectSchema(emailLogs);

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const selectEmailCampaignSchema = createSelectSchema(emailCampaigns);

// Types
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;