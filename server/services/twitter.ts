import { twitterScraper } from "./scraper";

export class TwitterService {
  async getUserTweets(username: string): Promise<any[]> {
    try {
      console.log(`Fetching tweets for user: ${username}`);
      const tweets = await twitterScraper.scrapeUserTweets(username);

      // Transform tweets to match our Post schema
      return await Promise.all(tweets.map(async (tweet) => ({
        ...tweet,
        platform: "Twitter",
        category: await twitterScraper.categorizeContent(tweet.content)
      })));

    } catch (error: any) {
      console.error('Error fetching tweets:', error);
      throw new Error(error.message || 'Failed to fetch tweets. Please try again later.');
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