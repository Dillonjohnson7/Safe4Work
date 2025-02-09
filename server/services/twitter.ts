import { TwitterApi } from "twitter-api-v2";

export class TwitterService {
  private client: TwitterApi;
  private rateLimitRetries: number = 3;
  private baseDelay: number = 1000; // 1 second

  constructor() {
    if (!process.env.TWITTER_BEARER_TOKEN) {
      throw new Error("TWITTER_BEARER_TOKEN must be set");
    }
    this.client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
  }

  private async handleRateLimit(retryCount: number): Promise<void> {
    if (retryCount >= this.rateLimitRetries) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    // Exponential backoff with jitter
    const delay = this.baseDelay * Math.pow(2, retryCount) * (0.5 + Math.random());
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async getUserTweets(username: string): Promise<any[]> {
    let retryCount = 0;

    while (true) {
      try {
        // Remove @ if present and ensure username is valid
        const cleanUsername = username.replace(/^@/, '');

        // First get the user ID from username
        const user = await this.client.v2.userByUsername(cleanUsername);
        if (!user.data) {
          throw new Error('User not found. Please check the username and try again.');
        }

        // Get user's tweets with full metrics
        const tweets = await this.client.v2.userTimeline(user.data.id, {
          max_results: 30, // Reduced from 100 to avoid rate limits
          "tweet.fields": ["created_at", "public_metrics"],
        });

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

        // Handle rate limiting
        if (error.code === 429) {
          await this.handleRateLimit(retryCount);
          retryCount++;
          continue;
        }

        // Handle user not found
        if (error.code === 404 || error.message.includes('User not found')) {
          throw new Error('User not found. Please check the username and try again.');
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