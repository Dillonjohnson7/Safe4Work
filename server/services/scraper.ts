import { chromium } from "playwright";

interface ScrapedTweet {
  content: string;
  likes: number;
  shares: number;
  timestamp: string;
  platform: string;
}

export class TwitterScraper {
  private browser: any;
  private context: any;

  async init() {
    try {
      this.browser = await chromium.launch({
        executablePath: '/nix/store/x205pbkd5xh5g4iv0g58xjla55has3cx-chromium-108.0.5359.94/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--single-process'
        ]
      });
      this.context = await this.browser.newContext();
      console.log("Browser initialized successfully");
    } catch (error) {
      console.error("Failed to initialize browser:", error);
      throw new Error("Failed to initialize browser. Please try again later.");
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
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Handle login wall if it appears
      const loginWall = await page.$('[data-testid="loginButton"]');
      if (loginWall) {
        console.log("Login wall detected, using alternative scraping method");
        // Use Nitter as a fallback
        await page.goto(`https://nitter.net/${cleanUsername}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
      }

      // Wait for tweets to load
      await page.waitForSelector('[data-testid="tweet"]', { timeout: 10000 })
        .catch(() => {
          throw new Error("Could not find any tweets. The account might be private or doesn't exist.");
        });

      // Extract tweets
      const tweets = await page.$$eval('[data-testid="tweet"]', (elements: any[], targetLimit: number) => {
        return elements.slice(0, targetLimit).map(tweet => {
          // Extract tweet text
          const contentElement = tweet.querySelector('[data-testid="tweetText"]');
          const content = contentElement ? contentElement.textContent.trim() : '';

          // Extract metrics
          const likesElement = tweet.querySelector('[data-testid="like"] span');
          const sharesElement = tweet.querySelector('[data-testid="retweet"] span');
          const timeElement = tweet.querySelector('time');

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
            timestamp: timeElement?.getAttribute('datetime') || new Date().toISOString(),
            platform: "Twitter"
          };
        });
      }, limit);

      if (tweets.length === 0) {
        throw new Error("No tweets found for this user.");
      }

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
      throw error;
    } finally {
      try {
        if (this.browser) {
          await this.browser.close();
          this.browser = null;
          this.context = null;
        }
      } catch (error) {
        console.error('Error closing browser:', error);
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

export const twitterScraper = new TwitterScraper();