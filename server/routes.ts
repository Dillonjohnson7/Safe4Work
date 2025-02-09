import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  app.get("/api/posts/:username", async (req, res) => {
    const { username } = req.params;
    try {
      const posts = await storage.getPostsByUsername(username);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // Add sample posts for testing
  app.post("/api/posts/sample/:username", async (req, res) => {
    const { username } = req.params;
    try {
      const categories = ["good", "bad", "ugly"] as const;
      const platforms = ["Twitter", "LinkedIn", "Facebook", "Instagram"];

      for (let i = 0; i < 30; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        await storage.createPost({
          username,
          content: `Sample ${category} post for ${username} - ${i}`,
          category,
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          likes: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
        });
      }

      const posts = await storage.getPostsByUsername(username);
      res.json(posts);
    } catch (error) {
      console.error("Error creating sample posts:", error);
      res.status(500).json({ error: "Failed to create sample posts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}