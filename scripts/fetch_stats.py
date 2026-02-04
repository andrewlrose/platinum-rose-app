# scripts/fetch_stats.py
# Run: python scripts/fetch_stats.py
import json
import sys
import pandas as pd

SEASON = 2025

# Try to import the available functions from nfl_data_py
try:
    from nfl_data_py import import_pbp_data, import_seasonal_data
except Exception as e:
    print("ERROR: nfl_data_py import failed:", e)
    print("Available nfl_data_py functions may differ; run 'python -c \"import nfl_data_py; print([n for n in dir(nfl_data_py) if not n.startswith(\\'_')])\"' to inspect.")
    sys.exit(1)

def safe_mean(df, col):
    if col in df:
        return df[col].mean()
    return None

def main():
    print(f"Loading play-by-play for {SEASON} (may download/cache data on first run)...")
    pbp = import_pbp_data([SEASON])
    if pbp is None or len(pbp) == 0:
        print("No PBP data loaded. Exiting.")
        return

    # Keep only plays with EPA if present
    if 'epa' in pbp.columns:
        pbp = pbp[pbp['epa'].notna()]

    # Ensure key columns exist
    for col in ('posteam', 'defteam', 'play_type'):
        if col not in pbp.columns:
            print(f"Warning: expected column '{col}' not found in PBP. Script may produce incomplete results.")

    # Offensive EPA/play (per posteam)
    off = pbp.groupby('posteam').agg(off_epa_sum=('epa','sum'), off_plays=('epa','count'))
    off = off.assign(off_epa = off['off_epa_sum'] / off['off_plays'])

    # Defensive EPA per-play (mean EPA allowed)
    dfn = pbp.groupby('defteam').agg(def_epa=('epa','mean'))

    # Pass / rush splits
    pass_plays = pbp[pbp.get('play_type') == 'pass']
    rush_plays = pbp[pbp.get('play_type') == 'run']

    off_pass = pass_plays.groupby('posteam').agg(off_pass_epa=('epa','mean'))
    off_rush = rush_plays.groupby('posteam').agg(off_rush_epa=('epa','mean'))
    def_pass = pass_plays.groupby('defteam').agg(def_pass_epa=('epa','mean'))
    def_rush = rush_plays.groupby('defteam').agg(def_rush_epa=('epa','mean'))

    # Tempo ~ plays per game (approx using 17 games)
    plays = pbp.groupby('posteam').size().rename('plays')

    # Try to load seasonal team records (if function exists)
    records = pd.DataFrame()
    try:
        seasonal = import_seasonal_data([SEASON]) if 'import_seasonal_data' in globals() else None
        if seasonal is not None and not seasonal.empty:
            if 'team' in seasonal.columns:
                records = seasonal.set_index('team')
            elif 'team_abbr' in seasonal.columns:
                records = seasonal.set_index('team_abbr')
    except Exception:
        records = pd.DataFrame()

    teams = sorted(set(list(off.index) + list(dfn.index)))
    out = []
    for team in teams:
        row = {}
        row['team'] = team
        row['off_epa'] = float(off.loc[team]['off_epa']) if team in off.index else 0.0
        row['def_epa'] = float(dfn.loc[team]['def_epa']) if team in dfn.index else 0.0
        row['off_pass_epa'] = float(off_pass.loc[team]['off_pass_epa']) if team in off_pass.index else row['off_epa']
        row['off_rush_epa'] = float(off_rush.loc[team]['off_rush_epa']) if team in off_rush.index else row['off_epa']
        row['def_pass_epa'] = float(def_pass.loc[team]['def_pass_epa']) if team in def_pass.index else row['def_epa']
        row['def_rush_epa'] = float(def_rush.loc[team]['def_rush_epa']) if team in def_rush.index else row['def_epa']
        row['tempo'] = float(plays.loc[team]) / 17.0 if team in plays.index else None
        if not records.empty and team in records.index:
            rec = records.loc[team]
            # try several field names for wins/losses
            wins = rec.get('wins') or rec.get('W') or rec.get('wins_reg') or None
            losses = rec.get('losses') or rec.get('L') or rec.get('losses_reg') or None
            try:
                row['wins'] = int(wins) if wins is not None else None
                row['losses'] = int(losses) if losses is not None else None
            except Exception:
                pass
        out.append(row)

    # Write normalized JSON that DevLab expects
    with open('public/weekly_stats.json','w', encoding='utf-8') as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    print("Wrote public/weekly_stats.json with", len(out), "teams")

if __name__ == '__main__':
    main()