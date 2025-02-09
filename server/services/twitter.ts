import { TwitterApi } from "twitter-api-v2";

export class TwitterService {
  private client: TwitterApi;
  private rateLimitRetries: number = 3;
  private baseDelay: number = 1000; // 1 second
  private userCache: Map<string, any> = new Map(); // Cache for user lookups

  constructor() {
    if (!process.env.TWITTER_BEARER_TOKEN) {
      throw new Error("TWITTER_BEARER_TOKEN must be set");
    }

    // Initialize with app-only auth
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    this.client = client.readOnly;

    // Log successful initialization
    console.log("Twitter client initialized successfully");
  }

  private async handleRateLimit(error: any, retryCount: number): Promise<void> {
    // Log rate limit info
    if (error.rateLimit) {
      console.log('Rate limit info:', {
        limit: error.rateLimit.limit,
        remaining: error.rateLimit.remaining,
        reset: error.rateLimit.reset,
      });
    }

    if (retryCount >= this.rateLimitRetries) {
      const resetTime = error.rateLimit?.reset 
        ? new Date(error.rateLimit.reset * 1000).toLocaleTimeString()
        : 'a few minutes';
      throw new Error(`Twitter API rate limit reached. Please try again after ${resetTime}. Current access level only allows ${error.rateLimit?.limit || 3} requests per window.`);
    }

    // Exponential backoff with jitter
    const delay = this.baseDelay * Math.pow(2, retryCount) * (0.5 + Math.random());
    console.log(`Waiting ${delay}ms before retry ${retryCount + 1}`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async getUserTweets(username: string): Promise<any[]> {
    let retryCount = 0;

    while (true) {
      try {
        // Remove @ if present and ensure username is valid
        const cleanUsername = username.replace(/^@/, '');
        console.log(`Fetching tweets for user: ${cleanUsername}`);

        // First get the user ID from username
        let user = this.userCache.get(cleanUsername);
        if (!user) {
          const userResponse = await this.client.v2.userByUsername(cleanUsername);
          if (!userResponse.data) {
            throw new Error('User not found. Please check the username and try again.');
          }
          user = userResponse.data;
          this.userCache.set(cleanUsername, user);
        }

        console.log(`Found user ID: ${user.id}`);

        // Get user's tweets with full metrics
        const tweets = await this.client.v2.userTimeline(user.id, {
          max_results: 5, // Further reduced to avoid rate limits during testing
          "tweet.fields": ["created_at", "public_metrics"],
        });

        console.log(`Retrieved ${tweets.data.data.length} tweets`);

        // Transform tweets to match our Post schema
        return tweets.data.data.map((tweet) => ({
          content: tweet.text,
          platform: "Twitter",
          likes: tweet.public_metrics?.like_count || 0,
          shares: tweet.public_metrics?.retweet_count || 0,
          timestamp: new Date(tweet.created_at!).toISOString(),
          category: this.categorizeContent(tweet.text),
        }));

      } catch (error: any) {
        console.error('Error fetching tweets:', error);

        // Log detailed error information
        if (error.data) {
          console.error('Twitter API Error Details:', error.data);
        }

        // Handle rate limiting
        if (error.code === 429) {
          await this.handleRateLimit(error, retryCount);
          retryCount++;
          continue;
        }

        // Handle user not found
        if (error.code === 404 || error.message.includes('User not found')) {
          throw new Error('User not found. Please check the username and try again.');
        }

        // Handle authentication errors
        if (error.code === 401 || error.code === 403) {
          console.error('Authentication error:', error);
          throw new Error('Please ensure you have provided valid Twitter API credentials with Elevated access level.');
        }

        // Handle other errors
        throw new Error('Failed to fetch Twitter data. Please try again later.');
      }
    }
  }

  private categorizeContent(text: string): "good" | "bad" | "ugly" {
    // Simple categorization based on basic word lists
    // This will be replaced with ML classification
    const profanityList = ["damn", "hell", "crap"];
    const severeList = ["fuck", "shit", "ass"];

    const lowerText = text.toLowerCase();

    if (severeList.some(word => lowerText.includes(word))) {
      return "ugly";
    } else if (profanityList.some(word => lowerText.includes(word))) {
      return "bad";
    }
    return "good";
  }
}

export const twitterService = new TwitterService();