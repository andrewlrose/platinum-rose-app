import nfl_data_py as ndp
df = ndp.import_seasonal_data([2025])
print("COLUMNS:", df.columns.tolist())
print("SAMPLE ROWS:")
for r in df.head(5).to_dict(orient='records'):
    print(r)
# show likely win/loss columns
wins = [c for c in df.columns if 'win' in c.lower() or c.lower() == 'w']
losses = [c for c in df.columns if 'loss' in c.lower() or c.lower() == 'l']
print("POTENTIAL win columns:", wins)
print("POTENTIAL loss columns:", losses)