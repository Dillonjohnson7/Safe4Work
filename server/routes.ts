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
        // Good posts - No profanity
        {
          username,
          content: "Just tried the new coffee shop downtown! The atmosphere is amazing and their lattes are absolutely incredible. Going to make this my new morning spot! ✨☕️",
          category: "good",
          platform: "twitter",
          likes: 245,
          shares: 89,
        },
        {
          username,
          content: "Can't believe how packed the gym is today! Everyone keeping their new year resolutions I guess. Waiting 20 minutes for a treadmill... 🏃‍♂️",
          category: "good",
          platform: "twitter",
          likes: 178,
          shares: 45,
        },
        {
          username,
          content: "The new Spider-Man movie was absolutely mindblowing! Best one yet in my opinion. The visuals were stunning and that ending... wow! No spoilers but you need to see this! 🎬",
          category: "good",
          platform: "twitter",
          likes: 892,
          shares: 132,
        },

        // Bad posts - Mild profanity
        {
          username,
          content: "Damn traffic is insane today! Been stuck on the highway for an hour. This is what I get for leaving 10 minutes late... 🚗😤",
          category: "bad",
          platform: "twitter",
          likes: 56,
          shares: 12,
        },
        {
          username,
          content: "My neighbor's dog won't stop barking. It's 3am for hell's sake! Some people are so inconsiderate... 😤",
          category: "bad",
          platform: "twitter",
          likes: 89,
          shares: 3,
        },
        {
          username,
          content: "This airline service is crap! 3-hour delay and not even a freaking apology. Never flying with them again! ✈️😠",
          category: "bad",
          platform: "twitter",
          likes: 234,
          shares: 45,
        },

        // Ugly posts - Strong profanity
        {
          username,
          content: "F**king delivery driver left my food at the wrong apartment AGAIN! How hard is it to read the damn apartment number?! 🤬",
          category: "ugly",
          platform: "twitter",
          likes: 23,
          shares: 2,
        },
        {
          username,
          content: "This b**ch in front of me at Starbucks just ordered 10 different drinks and none of them were simple. Some of us have sh*t to do! ☕️😡",
          category: "ugly",
          platform: "twitter",
          likes: 67,
          shares: 15,
        },
        {
          username,
          content: "My roommate ate my leftover pizza, that motherf**ker! I was saving that all day. Time to find a new place cause I'm done with this bulls**t! 🍕",
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