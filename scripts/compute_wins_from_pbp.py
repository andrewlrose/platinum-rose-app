# scripts/compute_wins_from_pbp.py
import json
from pathlib import Path

try:
    import nfl_data_py as ndp
except Exception as e:
    print("ERROR: nfl_data_py import failed:", e)
    raise SystemExit(1)

SEASON = 2025
SRC = Path("public/weekly_stats.json")

def find_score_cols(df):
    cols = set(df.columns.str.lower())
    home_candidates = ["total_home_score","home_team_score","home_score","score_home"]
    away_candidates = ["total_away_score","away_team_score","away_score","score_away"]
    home = next((c for c in home_candidates if c in cols), None)
    away = next((c for c in away_candidates if c in cols), None)
    return home, away

def main():
    if not SRC.exists():
        print("Missing", SRC)
        return

    print("Loading PBP for", SEASON)
    pbp = ndp.import_pbp_data([SEASON])
    if pbp is None or pbp.shape[0] == 0:
        print("PBP load returned empty. Aborting.")
        return

    # normalize column names to lower for checking
    pbp_cols = [c.lower() for c in pbp.columns]
    pbp.columns = pbp_cols

    home_col, away_col = find_score_cols(pbp)
    if not home_col or not away_col:
        print("Could not find home/away final-score columns in PBP. Available columns:")
        print(pbp.columns.tolist())
        return

    # For each game_id, take the last (max index) value of the score columns
    games = pbp.groupby("game_id").agg({home_col: "max", away_col: "max"}).reset_index()
    # Determine winner
    def winner(row):
        h = row[home_col]; a = row[away_col]
        if h is None or a is None: return None
        if h > a: return row.get("home_team") or None
        if a > h: return row.get("away_team") or None
        return "TIE"

    # attempt to find home/away team columns
    home_team_col = None
    away_team_col = None
    for c in ("home_team","home_abbr","home"):
        if c in pbp.columns: home_team_col = c; break
    for c in ("away_team","away_abbr","away"):
        if c in pbp.columns: away_team_col = c; break

    # if not in aggregated df, pull teams from first/last play per game
    teams = {}
    for gid, g in pbp.groupby("game_id"):
        last = g.iloc[-1]
        home_score = last.get(home_col)
        away_score = last.get(away_col)
        home_team = last.get(home_team_col) if home_team_col else last.get("home")
        away_team = last.get(away_team_col) if away_team_col else last.get("away")
        if home_team is None or away_team is None:
            # try posteam/defteam by inferring which is home via venue flag
            home_team = last.get("home_team") or last.get("home_team_abbr") or home_team
            away_team = last.get("away_team") or last.get("away_team_abbr") or away_team
        if home_team is None or away_team is None:
            continue
        # record winner
        if home_score is None or away_score is None:
            continue
        if home_score > away_score:
            teams.setdefault(home_team.upper(), {"wins":0,"losses":0})["wins"] += 1
            teams.setdefault(away_team.upper(), {"wins":0,"losses":0})["losses"] += 1
        elif away_score > home_score:
            teams.setdefault(away_team.upper(), {"wins":0,"losses":0})["wins"] += 1
            teams.setdefault(home_team.upper(), {"wins":0,"losses":0})["losses"] += 1
        else:
            # tie: count as half? choose to not increment
            pass

    print("Computed team W/L for", len(teams), "teams")

    # merge into weekly_stats.json
    data = json.loads(SRC.read_text(encoding="utf-8"))
    for entry in data:
        t = entry.get("team","").upper()
        rec = teams.get(t)
        if rec:
            entry["wins"] = rec.get("wins", entry.get("wins"))
            entry["losses"] = rec.get("losses", entry.get("losses"))

    SRC.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Merged wins/losses into", SRC)

if __name__ == "__main__":
    main()