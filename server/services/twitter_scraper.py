import json
import sys
from datetime import datetime, timezone

def get_mock_tweets():
    # Mock data for development purposes
    return [
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
            "content": "Some inappropriate language here that should be flagged as bad! damn.",
            "likes": 15,
            "shares": 3,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "platform": "Twitter"
        },
        {
            "content": "This post contains really inappropriate content and should be marked as ugly! sh*t",
            "likes": 8,
            "shares": 1,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "platform": "Twitter"
        }
    ]

if __name__ == "__main__":
    # Always return mock data for now
    print(json.dumps(get_mock_tweets()))