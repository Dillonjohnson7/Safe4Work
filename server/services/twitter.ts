import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { twitterScraper } from './scraper';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TwitterService {
  async getUserTweets(username: string): Promise<any[]> {
    try {
      console.log(`Fetching tweets for user: ${username}`);

      // Initialize scraper if needed
      await twitterScraper.init();

      // Get tweets using Playwright-based scraper
      const tweets = await twitterScraper.scrapeUserTweets(username, 5);

      // Add categorization to each tweet
      return tweets.map((tweet: any) => ({
        ...tweet,
        category: this.categorizeContent(tweet.content)
      }));

    } catch (error: any) {
      console.error('Error fetching tweets:', error);
      throw new Error(error.message || 'Failed to fetch tweets. Please try again later.');
    }
  }

  private categorizeContent(text: string): "good" | "bad" | "ugly" {
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