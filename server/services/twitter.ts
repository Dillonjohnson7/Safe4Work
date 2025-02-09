import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TwitterService {
  async getUserTweets(username: string): Promise<any[]> {
    try {
      console.log(`Fetching tweets for user: ${username}`);

      // Execute the Python script
      const scriptPath = path.join(__dirname, 'twitter_scraper.py');
      const { stdout, stderr } = await execAsync(`python3 ${scriptPath} ${username} 5`);

      if (stderr) {
        console.error('Python script error:', stderr);
        throw new Error('Failed to fetch tweets');
      }

      const result = JSON.parse(stdout);

      if (result.error) {
        throw new Error(result.error);
      }

      // Add categorization to each tweet
      return result.map((tweet: any) => ({
        ...tweet,
        category: this.categorizeContent(tweet.content)
      }));

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