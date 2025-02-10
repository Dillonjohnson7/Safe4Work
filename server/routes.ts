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
        // Good posts - Completely clean, professional content
        {
          username,
          content: "Excited to announce my new role as Senior Developer at TechCorp! Looking forward to this amazing opportunity. #NewBeginnings",
          category: "good",
          platform: "twitter",
          likes: 245,
          shares: 89,
        },
        {
          username,
          content: "Just completed a great webinar on AI ethics in technology. Fascinating discussions about responsible innovation! #TechEthics",
          category: "good",
          platform: "twitter",
          likes: 178,
          shares: 45,
        },
        {
          username,
          content: "Proud to have contributed to our team's successful project launch today. Teamwork makes the dream work! 🚀",
          category: "good",
          platform: "twitter",
          likes: 892,
          shares: 132,
        },

        // Bad posts - Mild profanity and unprofessional content
        {
          username,
          content: "Damn this client is driving me crazy! Why can't people read the freaking documentation? 🤬",
          category: "bad",
          platform: "twitter",
          likes: 56,
          shares: 12,
        },
        {
          username,
          content: "These idiots at tech support don't know what the hell they're doing. Been on hold for 2 hours! #BadService",
          category: "bad",
          platform: "twitter",
          likes: 89,
          shares: 3,
        },
        {
          username,
          content: "My boss is such a pain in the ass! Making us work overtime again. This crap needs to stop. 😤",
          category: "bad",
          platform: "twitter",
          likes: 234,
          shares: 45,
        },

        // Ugly posts - Strong profanity and highly inappropriate content
        {
          username,
          content: "F**k this job and f**k this company! Everyone here is full of sh*t! Quitting this b*tch tomorrow! 🖕",
          category: "ugly",
          platform: "twitter",
          likes: 23,
          shares: 2,
        },
        {
          username,
          content: "These stupid a** customers can kiss my f**king a**! I'm so done with this bulls**t! 🤬",
          category: "ugly",
          platform: "twitter",
          likes: 67,
          shares: 15,
        },
        {
          username,
          content: "My coworker is a worthless piece of sh*t! Hope you get f**king fired you lazy b*stard! 😡",
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