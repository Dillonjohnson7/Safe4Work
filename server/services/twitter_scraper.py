import twint
import pandas as pd
import json
from datetime import datetime, timezone
import sys

def scrape_tweets(username, limit=100):
    try:
        # Configure Twint
        c = twint.Config()
        c.Username = username
        c.Limit = limit
        c.Store_object = True
        c.Hide_output = True
        c.Stats = False
        
        # Run Twint
        twint.run.Search(c)
        
        # Get tweets from Twint output
        tweets = twint.output.tweets_list
        
        # Transform tweets to match our schema
        formatted_tweets = []
        for tweet in tweets:
            formatted_tweet = {
                "content": tweet.tweet,
                "likes": tweet.likes_count,
                "shares": tweet.retweets_count,
                "timestamp": datetime.strptime(tweet.datetime, "%Y-%m-%d %H:%M:%S %Z").isoformat(),
                "platform": "Twitter"
            }
            formatted_tweets.append(formatted_tweet)
            
        # Return as JSON string
        return json.dumps(formatted_tweets)
        
    except Exception as e:
        error_msg = {"error": str(e)}
        return json.dumps(error_msg)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Username not provided"}))
    else:
        username = sys.argv[1]
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 100
        print(scrape_tweets(username, limit))
