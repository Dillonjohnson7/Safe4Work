import json
import sys
from datetime import datetime, timezone
import pandas as pd
from bs4 import BeautifulSoup
import aiohttp
import asyncio
import random

NITTER_INSTANCES = [
    'https://nitter.net',
    'https://nitter.cz',
    'https://nitter.unixfox.eu'
]

async def scrape_tweets(username, limit=5):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
        }

        errors = []
        for base_url in NITTER_INSTANCES:
            try:
                url = f'{base_url}/{username}'
                print(f"Trying to fetch from: {url}", file=sys.stderr)

                async with aiohttp.ClientSession() as session:
                    async with session.get(url, headers=headers, timeout=10) as response:
                        if response.status != 200:
                            print(f"Failed to fetch from {url}: {response.status}", file=sys.stderr)
                            errors.append(f"HTTP {response.status} from {base_url}")
                            continue

                        html = await response.text()
                        if not html or len(html) < 100:  # Basic check for valid response
                            print(f"Invalid response from {url}", file=sys.stderr)
                            continue

                        soup = BeautifulSoup(html, 'html.parser')
                        tweets = []

                        # Find tweet containers
                        timeline = soup.find('div', class_='timeline')
                        if not timeline:
                            print(f"No timeline found on {url}", file=sys.stderr)
                            continue

                        tweet_elements = timeline.find_all('div', class_='timeline-item', limit=limit)
                        if not tweet_elements:
                            print(f"No tweets found on {url}", file=sys.stderr)
                            continue

                        for tweet in tweet_elements:
                            try:
                                content = tweet.find('div', class_='tweet-content')
                                timestamp = tweet.find('span', class_='tweet-date')
                                stats = tweet.find('div', class_='tweet-stats')

                                if content and timestamp:
                                    likes = 0
                                    shares = 0

                                    if stats:
                                        likes_elem = stats.find('span', class_='icon-heart').find_next_sibling('span')
                                        shares_elem = stats.find('span', class_='icon-retweet').find_next_sibling('span')

                                        if likes_elem:
                                            likes = int(likes_elem.get_text(strip=True).replace(',', '') or "0")
                                        if shares_elem:
                                            shares = int(shares_elem.get_text(strip=True).replace(',', '') or "0")

                                    tweet_data = {
                                        "content": content.get_text(strip=True),
                                        "likes": likes,
                                        "shares": shares,
                                        "timestamp": datetime.now(timezone.utc).isoformat(),
                                        "platform": "Twitter"
                                    }
                                    tweets.append(tweet_data)
                            except Exception as e:
                                print(f"Error parsing tweet: {str(e)}", file=sys.stderr)
                                continue

                        if tweets:  # If we successfully got tweets, return them
                            return json.dumps(tweets)

            except aiohttp.ClientError as e:
                print(f"Connection error with {base_url}: {str(e)}", file=sys.stderr)
                errors.append(f"Connection error with {base_url}: {str(e)}")
                continue
            except Exception as e:
                print(f"Unexpected error with {base_url}: {str(e)}", file=sys.stderr)
                errors.append(f"Error: {str(e)}")
                continue

        # If we get here, all instances failed
        error_msg = "All fetch attempts failed: " + "; ".join(errors)
        print(error_msg, file=sys.stderr)
        return json.dumps({"error": error_msg})

    except Exception as e:
        error_msg = f"Fatal error: {str(e)}"
        print(error_msg, file=sys.stderr)
        return json.dumps({"error": error_msg})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Username not provided"}))
    else:
        username = sys.argv[1]
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 5
        result = asyncio.run(scrape_tweets(username, limit))
        print(result)