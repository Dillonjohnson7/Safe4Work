import { pgTable, text, serial, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 10 }).notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  likes: integer("likes").notNull(),
  shares: integer("shares").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts).pick({
  username: true,
  content: true,
  category: true,
  platform: true,
  likes: true,
  shares: true
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
