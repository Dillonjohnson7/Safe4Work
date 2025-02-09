import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { twitterService } from "./services/twitter";

export function registerRoutes(app: Express): Server {
  app.get("/api/posts/:username", async (req, res) => {
    const { username } = req.params;
    try {
      // First try to get cached posts from database
      let posts = await storage.getPostsByUsername(username);

      // If no posts exist, fetch from Twitter and store them
      if (posts.length === 0) {
        const twitterPosts = await twitterService.getUserTweets(username);
        // Store tweets in database
        for (const post of twitterPosts) {
          await storage.createPost({
            username,
            ...post
          });
        }
        posts = await storage.getPostsByUsername(username);
      }

      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}