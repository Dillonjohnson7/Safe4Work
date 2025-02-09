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
      const samplePosts = [
        // Good posts
        {
          username,
          content: "Excited to share our latest research on sustainable technology! Check out the whitepaper in bio. #Innovation #Sustainability",
          category: "good",
          platform: "twitter",
          likes: 245,
          shares: 89,
        },
        {
          username,
          content: "Just published a new article on LinkedIn about leadership lessons learned throughout my career. Grateful for all the mentors who helped shape my journey.",
          category: "good",
          platform: "facebook",
          likes: 178,
          shares: 45,
        },
        {
          username,
          content: "TIL: The most efficient way to implement binary search in production systems. Here's my analysis with benchmarks and code examples.",
          category: "good",
          platform: "reddit",
          likes: 892,
          shares: 132,
        },

        // Bad posts
        {
          username,
          content: "This meeting could've been an email... 🙄 #CorporateLife",
          category: "bad",
          platform: "twitter",
          likes: 56,
          shares: 12,
        },
        {
          username,
          content: "Taking a 'sick day' to go to the beach. Don't tell my boss! 🏖️ #MentalHealthDay",
          category: "bad",
          platform: "facebook",
          likes: 89,
          shares: 3,
        },
        {
          username,
          content: "Why do recruiters keep ghosting after interviews? So unprofessional...",
          category: "bad",
          platform: "reddit",
          likes: 234,
          shares: 45,
        },

        // Ugly posts
        {
          username,
          content: "My boss is the worst! Can't believe they rejected my proposal without even reading it. Time to update that resume... 🤬",
          category: "ugly",
          platform: "twitter",
          likes: 23,
          shares: 2,
        },
        {
          username,
          content: "Had way too many drinks at the company party last night... Those karaoke videos are going to haunt me forever 🍺🎤 #OfficePartyFail",
          category: "ugly",
          platform: "facebook",
          likes: 67,
          shares: 15,
        },
        {
          username,
          content: "Just got passed over for promotion again. Pretty sure it's because I'm not part of the boss's favorite clique. This company's toxic AF.",
          category: "ugly",
          platform: "reddit",
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