import requests
import pandas as pd
import json
import re
from datetime import datetime

# --- CONFIGURATION ---
URL = "https://data.vsin.com/nfl/betting-splits/"

# ROBUST MAPPING: Matches IDs to [Abbr, City, Mascot]
# This ensures we catch the team no matter how VSiN writes it.
TEAM_MAPPING = {
    1:  ["WAS", "WASHINGTON", "COMMANDERS"],
    1:  ["DAL", "DALLAS", "COWBOYS"], # Note: Handle sharing ID below
    2:  ["MIN", "MINNESOTA", "VIKINGS"],
    2:  ["DET", "DETROIT", "LIONS"],
    3:  ["KC", "KANSAS", "CHIEFS"],
    3:  ["DEN", "DENVER", "BRONCOS"],
    4:  ["LAC", "CHARGERS", "LOS ANGELES CHARGERS"],
    4:  ["HOU", "HOUSTON", "TEXANS"],
    5:  ["GB", "GREEN BAY", "PACKERS"],
    5:  ["BAL", "BALTIMORE", "RAVENS"],
    6:  ["CAR", "CAROLINA", "PANTHERS"],
    6:  ["SEA", "SEATTLE", "SEAHAWKS"],
    7:  ["CIN", "CINCINNATI", "BENGALS"],
    7:  ["ARI", "ARIZONA", "CARDINALS"],
    8:  ["CLE", "CLEVELAND", "BROWNS"],
    8:  ["PIT", "PITTSBURGH", "STEELERS"],
    9:  ["IND", "INDIANAPOLIS", "COLTS"],
    9:  ["JAX", "JACKSONVILLE", "JAGUARS"],
    10: ["MIA", "MIAMI", "DOLPHINS"],
    10: ["TB", "TAMPA", "BUCCANEERS"],
    11: ["NYJ", "JETS"],
    11: ["NE", "NEW ENGLAND", "PATRIOTS"],
    12: ["TEN", "TENNESSEE", "TITANS"],
    12: ["NO", "NEW ORLEANS", "SAINTS"],
    13: ["LV", "LAS VEGAS", "RAIDERS"],
    13: ["NYG", "GIANTS"],
    14: ["BUF", "BUFFALO", "BILLS"],
    14: ["PHI", "PHILADELPHIA", "EAGLES"],
    15: ["SF", "SAN FRANCISCO", "49ERS"],
    15: ["CHI", "CHICAGO", "BEARS"],
    16: ["ATL", "ATLANTA", "FALCONS"],
    16: ["LAR", "RAMS"]
}

# RE-ORGANIZE MAPPING FOR LOOKUP
# Creates a massive list: "COWBOYS" -> 1, "DALLAS" -> 1, "DAL" -> 1
LOOKUP_TABLE = {}
for game_id, identifiers in TEAM_MAPPING.items():
    # We cheat a bit: We assign these keywords to the Game ID.
    # Since we defined them in pairs above, we need to manually map them correctly below.
    # actually, let's use a simpler explicit map to be safe.
    pass

# EXPLICIT MAP (The safest way)
FULL_MAP = {
    "WAS": 1, "WASHINGTON": 1, "COMMANDERS": 1,
    "DAL": 1, "DALLAS": 1, "COWBOYS": 1,
    "MIN": 2, "MINNESOTA": 2, "VIKINGS": 2,
    "DET": 2, "DETROIT": 2, "LIONS": 2,
    "KC": 3, "KANSAS": 3, "CHIEFS": 3,
    "DEN": 3, "DENVER": 3, "BRONCOS": 3,
    "LAC": 4, "CHARGERS": 4,
    "HOU": 4, "HOUSTON": 4, "TEXANS": 4,
    "GB": 5, "GREEN": 5, "PACKERS": 5,
    "BAL": 5, "BALTIMORE": 5, "RAVENS": 5,
    "CAR": 6, "CAROLINA": 6, "PANTHERS": 6,
    "SEA": 6, "SEATTLE": 6, "SEAHAWKS": 6,
    "CIN": 7, "CINCINNATI": 7, "BENGALS": 7,
    "ARI": 7, "ARIZONA": 7, "CARDINALS": 7,
    "CLE": 8, "CLEVELAND": 8, "BROWNS": 8,
    "PIT": 8, "PITTSBURGH": 8, "STEELERS": 8,
    "IND": 9, "INDIANAPOLIS": 9, "COLTS": 9,
    "JAX": 9, "JACKSONVILLE": 9, "JAGUARS": 9,
    "MIA": 10, "MIAMI": 10, "DOLPHINS": 10,
    "TB": 10, "TAMPA": 10, "BUCCANEERS": 10,
    "NYJ": 11, "JETS": 11,
    "NE": 11, "ENGLAND": 11, "PATRIOTS": 11,
    "TEN": 12, "TENNESSEE": 12, "TITANS": 12,
    "NO": 12, "ORLEANS": 12, "SAINTS": 12,
    "LV": 13, "VEGAS": 13, "RAIDERS": 13,
    "NYG": 13, "GIANTS": 13,
    "BUF": 14, "BUFFALO": 14, "BILLS": 14,
    "PHI": 14, "PHILADELPHIA": 14, "EAGLES": 14,
    "SF": 15, "FRANCISCO": 15, "49ERS": 15,
    "CHI": 15, "CHICAGO": 15, "BEARS": 15,
    "ATL": 16, "ATLANTA": 16, "FALCONS": 16,
    "LAR": 16, "RAMS": 16
}

def clean_pct(val):
    if not val: return 50
    try:
        # Removes % and converts to int
        return int(str(val).replace('%', '').strip())
    except:
        return 50

def scrape_real_data():
    print(f"🚀 Launching Scraper against {URL}...")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
        tables = pd.read_html(response.text)
        
        if not tables:
            print("❌ No tables found.")
            return {}
            
        print(f"✅ Found {len(tables)} tables. Parsing...")
        df = tables[0]
        
        # DEBUG: Print first few rows to logs so we can see what VSiN calls the teams
        print("--- RAW DATA SAMPLE ---")
        print(df.head()) 
        print("-----------------------")

        processed_data = {}
        
        for index, row in df.iterrows():
            try:
                # Convert entire row to uppercase string to search for team names
                row_str = str(row.values).upper()
                
                found_id = None
                for keyword, g_id in FULL_MAP.items():
                    if keyword in row_str:
                        found_id = g_id
                        break
                
                if not found_id:
                    continue
                
                # Deduplicate: If we already have this game, skip
                if found_id in processed_data:
                    continue

                # VSiN Column Structure (Index-based):
                # 3: Spread Bets%, 4: Spread Handle%
                # 6: Total Bets%, 7: Total Handle%
                # 9: ML Bets%, 10: ML Handle%
                
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
                print(f"🔹 Matched Game {found_id} using row data.")
                
            except Exception as e:
                print(f"⚠️ Row error: {e}")
                continue

        print(f"💾 Scraped {len(processed_data)} games.")
        return processed_data

    except Exception as e:
        print(f"❌ CRITICAL ERROR: {e}")
        return {}

def save_json(data):
    file_path = 'betting_splits.json'
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    real_data = scrape_real_data()
    if real_data:
        save_json(real_data)