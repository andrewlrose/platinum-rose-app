# scripts/inspect_nfl_data.py
import traceback
import pandas as pd
import nfl_data_py as ndp

YEARS = [2025]
candidates = [
    "import_seasonal_data",
    "import_seasonal_pfr",
    "import_weekly_data",
    "import_weekly_pfr",
    "import_win_totals",
    "import_team_desc",
    "import_seasonal_rosters",
]

def try_call(fn_name):
    fn = getattr(ndp, fn_name, None)
    if not fn:
        print(f"- {fn_name}: not available")
        return
    print(f"\n- Trying {fn_name}() ...")
    try:
        df = fn(YEARS)
        if df is None:
            print(f"  {fn_name} returned None")
            return
        print(f"  Loaded {len(df)} rows, columns: {list(df.columns)}")
        print("  Sample rows:")
        print(df.head(3).to_dict(orient='records'))
        # quick search for wins/loss-like columns
        wins_cols = [c for c in df.columns if 'win' in c.lower() or c.lower()=='w']
        loss_cols = [c for c in df.columns if 'loss' in c.lower() or c.lower()=='l']
        print("  Potential wins cols:", wins_cols)
        print("  Potential losses cols:", loss_cols)
    except Exception as e:
        print(f"  ERROR calling {fn_name}: {type(e).__name__}: {e}")
        traceback.print_exc(limit=1)

def main():
    print("nfl_data_py inspect — attempting several import_* functions")
    for cand in candidates:
        try_call(cand)
    print("\nDone.")

if __name__ == '__main__':
    main()