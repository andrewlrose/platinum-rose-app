import requests
import json
import os
import re
from datetime import datetime

# --- CONFIGURATION ---
# Map Team Names (from Web) to your App's Game IDs (from constants.js)
# YOU MUST UPDATE THIS WEEKLY TO MATCH YOUR SCHEDULE IDs!
WEEK_17_MAPPING = {
    "WAS": 1, "DAL": 1,
    "MIN": 2, "DET": 2,
    "KC": 3, "DEN": 3,
    "LAC": 4, "HOU": 4,
    "GB": 5, "BAL": 5,
    "CAR": 6, "SEA": 6,
    "CIN": 7, "ARI": 7,
    "CLE": 8, "PIT": 8,
    "IND": 9, "JAX": 9,
    "MIA": 10, "TB": 10,
    "NYJ": 11, "NE": 11,
    "TEN": 12, "NO": 12,
    "LV": 13, "NYG": 13,
    "BUF": 14, "PHI": 14,
    "SF": 15, "CHI": 15,
    "ATL": 16, "LAR": 16
}

def clean_percentage(text):
    """Converts '84%' string to integer 84."""
    try:
        return int(text.replace('%', '').strip())
    except:
        return 50 # Default neutral if error

def scrape_vsin_data():
    print("🏈 Starting Scraper...")
    
    # NOTE: Since we can't easily scrape VSiN (protected), 
    # we will GENERATE realistic mock data for now to prove the pipeline works.
    # In a real production app, you would use 'BeautifulSoup' here.
    
    data = {}
    
    # Iterate through games and generate data structure
    for team, game_id in WEEK_17_MAPPING.items():
        if game_id not in data:
            # Create entry
            data[game_id] = {
                "id": game_id,
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "splits": {
                    "ats": {
                        "visitorTicket": 50, "homeTicket": 50,
                        "visitorMoney": 50, "homeMoney": 50
                    },
                    "total": {
                        "overTicket": 50, "underTicket": 50,
                        "overMoney": 50, "underMoney": 50
                    },
                    "ml": {
                        "visitorTicket": 50, "homeTicket": 50,
                        "visitorMoney": 50, "homeMoney": 50
                    }
                }
            }
            
    # Add some "Sharp Money" examples to test your UI (e.g. Game 1)
    # 80% Money on Home, but only 40% Tickets (Sharp Action)
    data[1]["splits"]["ats"] = { "visitorTicket": 60, "homeTicket": 40, "visitorMoney": 20, "homeMoney": 80 }
    
    # Add Public Fade example (Game 3)
    data[3]["splits"]["ats"] = { "visitorTicket": 85, "homeTicket": 15, "visitorMoney": 40, "homeMoney": 60 }

    print(f"✅ Generated Splits for {len(data)} games.")
    return data

def save_json(data):
    # Save to the root or public folder where App.jsx fetches it
    file_path = 'betting_splits.json'
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"💾 Saved to {file_path}")

if __name__ == "__main__":
    splits_data = scrape_vsin_data()
    save_json(splits_data)