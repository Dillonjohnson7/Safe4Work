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
        try {
          const twitterPosts = await twitterService.getUserTweets(username);

          // Store tweets in database
          for (const post of twitterPosts) {
            await storage.createPost({
              username,
              content: post.content,
              category: post.category,
              platform: post.platform,
              likes: post.likes,
              shares: post.shares,
              timestamp: new Date() // Use current timestamp for consistency
            });
          }

          // Fetch the stored posts
          posts = await storage.getPostsByUsername(username);
        } catch (twitterError: any) {
          console.error("Twitter service error:", twitterError);
          throw new Error(twitterError.message || "Failed to fetch tweets");
        }
      }

      res.json(posts);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      const statusCode = error.message.includes('User not found') ? 404 : 500;
      res.status(statusCode).json({ 
        error: error.message || "Failed to fetch posts" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}