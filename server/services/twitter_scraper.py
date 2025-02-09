import json
import sys
from datetime import datetime, timezone
from bs4 import BeautifulSoup
import aiohttp
import asyncio

async def get_mock_tweets(username):
    # Mock data for development purposes
    mock_tweets = [
        {
            "content": "Just finished an exciting project presentation! #coding #tech",
            "likes": 42,
            "shares": 12,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "platform": "Twitter"
        },
        {
            "content": "Great team meeting today. Love collaborating with smart people!",
            "likes": 28,
            "shares": 5,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "platform": "Twitter"
        },
        {
            "content": "Check out my new blog post about web development best practices",
            "likes": 35,
            "shares": 15,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "platform": "Twitter"
        }
    ]
    return mock_tweets

async def scrape_tweets(username, limit=5):
    try:
        print(f"Starting tweet scraping for user: {username}", file=sys.stderr)

        # For development, return mock data
        tweets = await get_mock_tweets(username)
        if tweets:
            return json.dumps(tweets)

        return json.dumps({"error": "Failed to fetch tweets"})

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