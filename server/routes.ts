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
        // Good posts - No profanity, clean language
        {
          username,
          content: "Just got a new bike! Can't wait to try it out on the trails this weekend. Perfect weather for outdoor adventures! 🚲",
          category: "good",
          platform: "twitter",
          likes: 245,
          shares: 89,
        },
        {
          username,
          content: "Made homemade pasta for the first time! The sauce turned out amazing. Cooking is becoming my new favorite hobby 🍝",
          category: "good",
          platform: "twitter",
          likes: 178,
          shares: 45,
        },
        {
          username,
          content: "Really enjoyed the sunset at the beach today. Nature never fails to amaze me with its beautiful colors! 🌅",
          category: "good",
          platform: "twitter",
          likes: 892,
          shares: 132,
        },

        // Bad posts - Mild profanity
        {
          username,
          content: "Damn this traffic! Been stuck here for an hour, gonna be late for the meeting again... 🚗😤",
          category: "bad",
          platform: "twitter",
          likes: 56,
          shares: 12,
        },
        {
          username,
          content: "What the hell is wrong with this weather? Was sunny 5 minutes ago, now it's pouring! 🌧️",
          category: "bad",
          platform: "twitter",
          likes: 89,
          shares: 3,
        },
        {
          username,
          content: "This movie is absolute crap. Wasted 2 hours of my life I'll never get back. Don't bother watching it! 🎬👎",
          category: "bad",
          platform: "twitter",
          likes: 234,
          shares: 45,
        },

        // Ugly posts - Strong profanity
        {
          username,
          content: "F**king hate it when people don't use their turn signals! Learn to drive you piece of s**t! 🚙😡",
          category: "ugly",
          platform: "twitter",
          likes: 23,
          shares: 2,
        },
        {
          username,
          content: "This b**ch at the store just cut in line and had the nerve to tell ME to calm down! 🤬",
          category: "ugly",
          platform: "twitter",
          likes: 67,
          shares: 15,
        },
        {
          username,
          content: "My a**hole neighbor's dog won't shut the f**k up at 3am! I'm gonna lose my s**t! 🐕😤",
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