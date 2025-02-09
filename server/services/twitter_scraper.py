import json
import sys
from datetime import datetime, timezone
import pandas as pd
from bs4 import BeautifulSoup
import aiohttp
import asyncio

async def scrape_tweets(username, limit=5):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        url = f'https://nitter.net/{username}'

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status != 200:
                    return json.dumps({"error": "Failed to fetch user timeline"})

                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                tweets = []

                # Find tweet containers
                tweet_elements = soup.select('.timeline-item')[:limit]

                for tweet in tweet_elements:
                    try:
                        content = tweet.select_one('.tweet-content')
                        timestamp = tweet.select_one('.tweet-date')
                        stats = tweet.select_one('.tweet-stats')

                        if content and timestamp:
                            tweet_data = {
                                "content": content.get_text(strip=True),
                                "likes": int(stats.select_one('.icon-heart + span').get_text(strip=True) or "0") if stats else 0,
                                "shares": int(stats.select_one('.icon-retweet + span').get_text(strip=True) or "0") if stats else 0,
                                "timestamp": timestamp.get('title', datetime.now(timezone.utc).isoformat()),
                                "platform": "Twitter"
                            }
                            tweets.append(tweet_data)
                    except Exception as e:
                        print(f"Error parsing tweet: {str(e)}", file=sys.stderr)
                        continue

                return json.dumps(tweets)

    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Username not provided"}))
    else:
        username = sys.argv[1]
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 5

        # Run the async function
        result = asyncio.run(scrape_tweets(username, limit))
        print(result)