# scripts/normalize_stats.py
import json
import shutil
from pathlib import Path

# try importing nfl_data_py for records
try:
    from nfl_data_py import import_seasonal_data
except Exception:
    import_seasonal_data = None

SEASON = 2025
SRC = Path("public/weekly_stats.json")
BACKUP = Path("public/weekly_stats.json.bak")

# minimal mapping to match dashboard abbreviations
ABBR_MAP = {
    "LA": "LAR",   # LA -> Los Angeles Rams (LAR). Keep LAC for Chargers.
    "WAS": "WAS",  # explicit but kept for clarity
    # add more mappings here if you find mismatches later
}

def load_json(p):
    return json.loads(p.read_text(encoding="utf-8"))

def save_json(p, data):
    p.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

def get_records():
    if not import_seasonal_data:
        return {}
    try:
        df = import_seasonal_data([SEASON])
    except Exception:
        return {}
    # Try to index by common keys
    possible_team_cols = [c for c in ["team", "team_abbr", "team_name", "team_code"] if c in df.columns]
    if not possible_team_cols:
        # try to infer any column with all-strings and unique-ish
        possible_team_cols = [c for c in df.columns if df[c].dtype == object]
        if not possible_team_cols:
            return {}
    team_col = possible_team_cols[0]
    records = {}
    for _, r in df.iterrows():
        key = str(r.get(team_col)).upper()
        # try multiple field names for wins/losses
        wins = None
        losses = None
        for k in ("W","wins","wins_reg","wins_season","w"):
            if k in df.columns:
                wins = r.get(k)
                break
        for k in ("L","losses","losses_reg","losses_season","l"):
            if k in df.columns:
                losses = r.get(k)
                break
        # fallback parse from 'record' if present like "12-5"
        if (wins is None or losses is None) and "record" in df.columns:
            rec = str(r.get("record",""))
            if "-" in rec:
                try:
                    a,b = rec.split("-",1)
                    wins = int(a); losses = int(b)
                except:
                    pass
        records[key] = {"wins": int(wins) if wins is not None and str(wins).isdigit() else None,
                        "losses": int(losses) if losses is not None and str(losses).isdigit() else None}
    return records

def normalize_team(t):
    if not t: return t
    t = t.strip().upper()
    return ABBR_MAP.get(t, t)

def main():
    if not SRC.exists():
        print("ERROR: source file not found:", SRC)
        return
    print("Backing up original to", BACKUP)
    shutil.copy2(SRC, BACKUP)

    data = load_json(SRC)
    if not isinstance(data, list):
        print("Unexpected JSON shape, expected list.")
        return

    records = get_records()
    if records:
        print("Loaded seasonal records for merging:", len(records), "teams")
    else:
        print("No seasonal records available (continuing without wins/losses)")

    seen = set()
    out = []
    for entry in data:
        team_raw = entry.get("team")
        team = normalize_team(team_raw)
        if team in seen:
            # merge if duplicate team keys exist in source
            idx = next(i for i,v in enumerate(out) if v.get("team")==team)
            out_entry = out[idx]
            # merge numeric fields prefer non-null
            for k,v in entry.items():
                if k=="team": continue
                if out_entry.get(k) is None and v is not None:
                    out_entry[k] = v
            continue
        seen.add(team)
        entry["team"] = team
        # attach wins/losses from records if available
        rec = records.get(team) or records.get(team.upper())
        if rec and (rec.get("wins") is not None or rec.get("losses") is not None):
            entry["wins"] = rec.get("wins")
            entry["losses"] = rec.get("losses")
        out.append(entry)

    save_json(SRC, out)
    print("Wrote normalized file with", len(out), "teams to", SRC)

if __name__ == "__main__":
    main()