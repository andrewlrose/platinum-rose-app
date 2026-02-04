# 🚀 Live Odds Integration Setup Guide

## Overview
Your NFL Dashboard is configured to pull real-time odds from The-Odds-API, supporting line shopping across 8+ major sportsbooks.

---

## Step-by-Step Setup

### 1️⃣ Get Your API Key

1. **Sign up** at [the-odds-api.com](https://the-odds-api.com)
2. **Choose a plan:**
   - **Free Tier**: 500 requests/month (plenty for testing)
   - **Starter**: $10/month, 10,000 requests
   - **Pro**: $30/month, 50,000 requests

3. **Copy your API key** from the dashboard

---

### 2️⃣ Configure Your Environment

1. **Create `.env` file** in your project root:
   ```bash
   # In the NFL_Dashboard folder
   # Copy the example file
   cp .env.example .env
   ```

2. **Add your API key** to `.env`:
   ```env
   VITE_ODDS_API_KEY=your_actual_api_key_here
   ```

3. **Restart your dev server** (required for Vite to pick up new env variables):
   ```bash
   npm run dev
   ```

---

### 3️⃣ Verify It's Working

1. Navigate to the **Live Odds** tab
2. Click **Refresh Odds** button
3. Check the browser console (F12) for:
   ```
   ✅ Success! Fetched odds for X games from multiple books.
   ```

If you see an API error, double-check:
- API key is correct in `.env`
- File is named `.env` (not `.env.txt` or `.env.example`)
- Dev server was restarted after adding the key

---

## Supported Sportsbooks

The system automatically pulls odds from:

| Sportsbook   | Book Key      | API Support |
|-------------|---------------|-------------|
| DraftKings  | `draftkings`  | ✅ Full     |
| FanDuel     | `fanduel`     | ✅ Full     |
| BetMGM      | `betmgm`      | ✅ Full     |
| Caesars     | `caesars`     | ✅ Full     |
| BetOnline   | `betonline`   | ✅ Full     |
| Bookmaker   | `bookmaker`   | ✅ Full     |
| PointsBet   | `pointsbet`   | ✅ Full     |
| Unibet      | `unibet`      | ✅ Full     |

---

## Features Enabled with Real Data

### ✅ Currently Active
- **Multi-book odds comparison** - See all books side-by-side
- **Best odds highlighting** - Auto-finds best prices
- **Your bet comparison** - Compare your bets vs market
- **Game filtering** - Search and filter by team/status
- **Auto-refresh** - Updates every 2 minutes

### 🔄 Auto-Activated with API Key
- **Line movement tracking** - Stored in localStorage
- **Movement alerts** - Detects significant shifts
- **Best odds calculator** - Finds optimal bet placement
- **Arbitrage detection** - Identifies guaranteed profit opportunities

### 🚀 Coming Soon (With API Key)
- **Historical line charts** - Visualize movement over time
- **Steam move detection** - Sharp money indicators  
- **Push notifications** - Line movement alerts
- **Bet recommendation engine** - AI-powered suggestions

---

## API Usage Tips

### Request Limits
- Each page load uses **1 API request**
- Auto-refresh every 2 minutes = **30 requests/hour**
- Free tier (500/month) = ~16 hours of continuous use

### Optimize Your Usage
1. **Disable auto-refresh** when not actively monitoring
2. **Use manual refresh** only when needed
3. **Focus on specific games** with filters
4. **Cache data** (already implemented in localStorage)

### Monitor Your Usage
Check your dashboard at [the-odds-api.com/dashboard](https://the-odds-api.com/dashboard) to track:
- Requests used today
- Remaining monthly quota
- Request history

---

## Troubleshooting

### "No API Key Found" Warning
- ✅ Create `.env` file in project root
- ✅ Add `VITE_ODDS_API_KEY=your_key`
- ✅ Restart dev server

### "API Error: 401"
- ❌ Invalid API key
- ✅ Double-check key in `.env`
- ✅ Verify no extra spaces or quotes

### "API Error: 429"
- ❌ Quota exceeded
- ✅ Check usage at the-odds-api.com
- ✅ Upgrade plan or wait for monthly reset

### Mock Data Still Showing
- ✅ Verify `.env` file exists and has correct key
- ✅ Restart server (`Ctrl+C` then `npm run dev`)
- ✅ Check console for API success message

---

## Development Mode

### Testing Without API Key
The system gracefully falls back to mock data when no API key is present, allowing you to:
- Test UI/UX without consuming API requests
- Develop features offline
- Demo the system to stakeholders

### Switching Between Mock and Real
**Mock Mode** (no API key):
```env
# Leave .env empty or don't create it
```

**Real Mode** (with API key):
```env
VITE_ODDS_API_KEY=your_actual_key
```

---

## Next Steps

Once your API key is configured, you can:

1. **Customize refresh interval** (currently 2 minutes)
2. **Add more sportsbooks** to the comparison
3. **Set up line movement alerts** via browser notifications
4. **Enable arbitrage auto-detection** for profitable opportunities
5. **Integrate with your betting workflow** for automated suggestions

---

## Support

- **API Documentation**: [the-odds-api.com/docs](https://the-odds-api.com/docs)
- **Discord Support**: [Join The Odds API Community](https://discord.gg/EQVvnZq)
- **Issue Tracker**: Check console logs (F12) for detailed error messages

---

**🎯 Pro Tip**: Start with the free tier to test everything, then upgrade once you understand your usage patterns. The 500 free requests per month is usually enough for serious handicapping if you use manual refresh instead of auto-refresh.