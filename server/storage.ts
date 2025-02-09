import { posts, type Post, type InsertPost } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPostsByUsername(username: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
}

export class DatabaseStorage implements IStorage {
  async getPostsByUsername(username: string): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.username, username));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }
}

export const storage = new DatabaseStorage();