import { chromium } from "playwright";

interface ScrapedTweet {
  content: string;
  likes: number;
  shares: number;
  timestamp: string;
}

export class TwitterScraper {
  private browser: any;
  private context: any;

  async init() {
    try {
      // Launch browser
      this.browser = await chromium.launch({
        chromiumSandbox: false // Required for Replit environment
      });
      this.context = await this.browser.newContext();
      console.log("Browser initialized successfully");
    } catch (error) {
      console.error("Failed to initialize browser:", error);
      throw error;
    }
  }

  async scrapeUserTweets(username: string, limit: number = 5): Promise<ScrapedTweet[]> {
    if (!this.browser) {
      await this.init();
    }

    try {
      const page = await this.context.newPage();
      const cleanUsername = username.replace(/^@/, '');
      console.log(`Scraping tweets for user: ${cleanUsername}`);

      // Navigate to user's profile
      await page.goto(`https://twitter.com/${cleanUsername}`, {
        waitUntil: 'networkidle'
      });

      // Wait for tweets to load
      await page.waitForSelector('article[data-testid="tweet"]', { timeout: 10000 });

      // Extract tweets
      const tweets = await page.$$eval('article[data-testid="tweet"]', (elements: any[], targetLimit: number) => {
        return elements.slice(0, targetLimit).map(tweet => {
          // Extract tweet text
          const contentElement = tweet.querySelector('[data-testid="tweetText"]');
          const content = contentElement ? contentElement.textContent : '';

          // Extract metrics
          const likesElement = tweet.querySelector('[data-testid="like"] span');
          const sharesElement = tweet.querySelector('[data-testid="retweet"] span');
          
          // Extract timestamp
          const timeElement = tweet.querySelector('time');
          const timestamp = timeElement ? timeElement.getAttribute('datetime') : new Date().toISOString();

          // Convert string numbers to integers (e.g., "1.5K" -> 1500)
          const parseMetric = (str: string) => {
            if (!str) return 0;
            const num = str.toLowerCase();
            if (num.includes('k')) {
              return Math.floor(parseFloat(num) * 1000);
            }
            if (num.includes('m')) {
              return Math.floor(parseFloat(num) * 1000000);
            }
            return parseInt(num) || 0;
          };

          return {
            content,
            likes: parseMetric(likesElement?.textContent || '0'),
            shares: parseMetric(sharesElement?.textContent || '0'),
            timestamp: timestamp || new Date().toISOString()
          };
        });
      }, limit);

      console.log(`Successfully scraped ${tweets.length} tweets`);
      return tweets;

    } catch (error: any) {
      console.error('Error scraping tweets:', error);
      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        throw new Error('Failed to connect to Twitter. Please check your internet connection.');
      }
      if (error.message.includes('timeout')) {
        throw new Error('Timed out while loading tweets. Please try again.');
      }
      throw new Error('Failed to fetch tweets. Please try again later.');
    } finally {
      // Clean up
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.context = null;
      }
    }
  }

  async categorizeContent(text: string): Promise<"good" | "bad" | "ugly"> {
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

// Create singleton instance
export const twitterScraper = new TwitterScraper();
