import { TwitterApi } from "twitter-api-v2";

export class TwitterService {
  private client: TwitterApi;

  constructor() {
    // Use bearer token authentication for app-only context
    this.client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);
  }

  async getUserTweets(username: string): Promise<any[]> {
    try {
      // First get the user ID from username
      const user = await this.client.v2.userByUsername(username);
      if (!user.data) {
        throw new Error('User not found');
      }

      // Get user's tweets
      const tweets = await this.client.v2.userTimeline(user.data.id, {
        max_results: 100,
        "tweet.fields": ["created_at", "public_metrics"],
      });

      // Transform tweets to match our Post schema
      return tweets.data.data.map((tweet) => ({
        content: tweet.text,
        platform: "Twitter",
        likes: tweet.public_metrics?.like_count || 0,
        shares: tweet.public_metrics?.retweet_count || 0,
        timestamp: tweet.created_at,
        // For now, categorize based on simple criteria
        // This will be replaced with ML classification later
        category: this.categorizeContent(tweet.text),
      }));
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
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