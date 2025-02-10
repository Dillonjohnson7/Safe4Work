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

  app.post("/api/posts/sample/:username", async (req, res) => {
    const { username } = req.params;
    try {
      const samplePosts = [
        // Good posts - No profanity at all
        {
          username,
          content: "This project deadline is really stressing me out. Need to focus and get it done!",
          category: "good",
          platform: "twitter",
          likes: 245,
          shares: 89,
        },
        {
          username,
          content: "The customer service today was terrible. Had to wait 2 hours for a response!",
          category: "good",
          platform: "twitter",
          likes: 178,
          shares: 45,
        },
        {
          username,
          content: "Cannot believe my coworker took credit for my work again. So frustrated right now!",
          category: "good",
          platform: "twitter",
          likes: 892,
          shares: 132,
        },

        // Bad posts - Mild profanity only
        {
          username,
          content: "Damn this project deadline! Why do they keep changing the requirements? This is such crap!",
          category: "bad",
          platform: "twitter",
          likes: 56,
          shares: 12,
        },
        {
          username,
          content: "What the hell is wrong with customer service? 2 hours of my time wasted!",
          category: "bad",
          platform: "twitter",
          likes: 89,
          shares: 3,
        },
        {
          username,
          content: "My coworker is being a total ass taking credit for my work again. Pissed off!",
          category: "bad",
          platform: "twitter",
          likes: 234,
          shares: 45,
        },

        // Ugly posts - Heavy profanity
        {
          username,
          content: "F**k this bulls**t project! These a**holes keep changing the f**king requirements!",
          category: "ugly",
          platform: "twitter",
          likes: 23,
          shares: 2,
        },
        {
          username,
          content: "This f**king customer service is complete s**t! Wasted my whole f**king day!",
          category: "ugly",
          platform: "twitter",
          likes: 67,
          shares: 15,
        },
        {
          username,
          content: "That b**tard coworker stealing my f**king work again! I'm so f**king done with this s**t!",
          category: "ugly",
          platform: "twitter",
          likes: 156,
          shares: 34,
        }
      ];

      // Create all sample posts
      for (const post of samplePosts) {
        await storage.createPost(post);
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