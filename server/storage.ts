import { posts, type Post, type InsertPost } from "@shared/schema";

export interface IStorage {
  getPostsByUsername(username: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
}

export class MemStorage implements IStorage {
  private posts: Map<number, Post>;
  private currentId: number;

  constructor() {
    this.posts = new Map();
    this.currentId = 1;
  }

  async getPostsByUsername(username: string): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(
      (post) => post.username === username
    );
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentId++;
    const post: Post = {
      ...insertPost,
      id,
      timestamp: new Date()
    };
    this.posts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();
