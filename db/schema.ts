import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

// Users table definition
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  bio: text("bio"),
  theme: text("theme").default("default"),
  font: text("font").default("default"),
  viewMode: text("view_mode").default("grid"),
  isPublic: boolean("is_public").default(true),
  showClickStats: boolean("show_click_stats").default(true),
  showSocialScore: boolean("show_social_score").default(true),
  socialScore: integer("social_score").default(0),
  profileImage: text("profile_image"),
  pitchMode: text("pitch_mode").default("professional"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Links table definition
export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  platform: text("platform"),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  clickCount: integer("click_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
