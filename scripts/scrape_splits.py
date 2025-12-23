import requests
import pandas as pd
import json
import re
from datetime import datetime
import time

# --- CONFIGURATION ---
# The VSiN raw data page (often easier to scrape than the main site)
URL = "https://data.vsin.com/nfl/betting-splits/"

# MAPPING: Standardize VSiN team names to YOUR App's IDs
# You must check this if VSiN uses different abbreviations (e.g. "WAS" vs "WSH")
TEAM_TO_GAME_ID = {
    "WAS": 1, "DAL": 1,
    "MIN": 2, "DET": 2,
    "KC": 3,  "DEN": 3,
    "LAC": 4, "HOU": 4,
    "GB": 5,  "BAL": 5,
    "CAR": 6, "SEA": 6,
    "CIN": 7, "ARI": 7,
    "CLE": 8, "PIT": 8,
    "IND": 9, "JAX": 9,
    "MIA": 10,"TB": 10,
    "NYJ": 11,"NE": 11,
    "TEN": 12,"NO": 12,
    "LV": 13, "NYG": 13,
    "BUF": 14,"PHI": 14,
    "SF": 15, "CHI": 15,
    "ATL": 16,"LAR": 16
}

def clean_pct(val):
    """Converts '84%' -> 84, and handles errors."""
    if not val: return 50
    try:
        return int(str(val).replace('%', '').strip())
    except:
        return 50

def scrape_real_data():
    print(f"🚀 Launching Scraper against {URL}...")
    
    # 1. Fetch the raw HTML tables using Pandas (easiest method)
    # We use a User-Agent so VSiN doesn't block the 'robot'
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
        
        # Pandas reads all <table> tags on the page
        tables = pd.read_html(response.text)
        
        if not tables:
            print("❌ No tables found on page.")
            return {}
            
        print(f"✅ Found {len(tables)} tables. Parsing data...")
        
        # The main splits table is usually the first big one
        df = tables[0]
        
        # VSiN tables usually have columns like: [Date, Game, Spread Bets, Spread Handle, ...]
        # We need to map these columns dynamically
        
        processed_data = {}
        
        # Iterate over rows
        for index, row in df.iterrows():
            try:
                # 2. Identify the Game
                # VSiN usually puts "Team A vs Team B" or "Team A @ Team B" in a column
                # We simply search the row string for known team names
                row_str = str(row.values).upper()
                
                found_id = None
                for team_code, g_id in TEAM_TO_GAME_ID.items():
                    if team_code in row_str:
                        found_id = g_id
                        break
                
                if not found_id:
                    continue
                
                # If we already processed this game, skip (VSiN sometimes lists same game twice)
                if found_id in processed_data:
                    continue

                # 3. Extract Splits (This relies on column order remaining stable)
                # Usually: Spread Tickets | Spread Money | Total Tickets | Total Money | ML Tickets | ML Money
                # We will try to parse by column indices. 
                # WARNING: If VSiN changes column order, this needs adjustment.
                
                # Mock-up of expected columns based on standard VSiN layout:
                # [0] Date/Time
                # [1] Matchup
                # [2] Spread Lines
                # [3] Spread Bets % (Ticket)
                # [4] Spread Handle % (Money)
                # [5] Total Lines
                # [6] Total Bets %
                # [7] Total Handle %
                # [8] ML Lines
                # [9] ML Bets %
                # [10] ML Handle %
                
                # Helper to grab data safely
                def get_val(idx):
                    if idx < len(row): return clean_pct(row[idx])
                    return 50

                splits_entry = {
                    "ats": {
                        "visitorTicket": get_val(3), "homeTicket": 100 - get_val(3),
                        "visitorMoney": get_val(4),  "homeMoney": 100 - get_val(4)
                    },
                    "total": {
                        "overTicket": get_val(6), "underTicket": 100 - get_val(6),
                        "overMoney": get_val(7),  "underMoney": 100 - get_val(7)
                    },
                    "ml": {
                        "visitorTicket": get_val(9), "homeTicket": 100 - get_val(9),
                        "visitorMoney": get_val(10), "homeMoney": 100 - get_val(10)
                    }
                }
                
                processed_data[found_id] = {
                    "id": found_id,
                    "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "splits": splits_entry
                }
                
            except Exception as e:
                print(f"⚠️ Error parsing row {index}: {e}")
                continue

        print(f"💾 Successfully scraped {len(processed_data)} games.")
        return processed_data

    except Exception as e:
        print(f"❌ CRITICAL ERROR: {e}")
        # Fallback to mock data if scrape fails entirely so app doesn't crash
        return {}

def save_json(data):
    file_path = 'betting_splits.json'
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"📝 Saved to {file_path}")

if __name__ == "__main__":
    real_data = scrape_real_data()
    if real_data:
        save_json(real_data)
    else:
        print("⚠️ No data scraped. Retaining old file.")
        
        
        