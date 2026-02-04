// Quick test script - paste in browser console while on Live Odds page
// Tests that API key is loaded and multi-sportsbook data is working

const testOddsAPI = async () => {
  console.log('🧪 Testing The-Odds-API Integration...\n');
  
  const apiKey = import.meta.env.VITE_ODDS_API_KEY;
  console.log('✅ API Key Found:', apiKey ? '✔️ YES' : '❌ NO');
  
  if (!apiKey) {
    console.error('❌ No API key found. Check your .env file');
    return;
  }
  
  try {
    const url = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?regions=us&markets=h2h,spreads,totals&bookmakers=draftkings,fanduel,betmgm,caesars,betonline&apiKey=${apiKey}&oddsFormat=american`;
    
    console.log('🔄 Fetching live odds from API...');
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`);
      const error = await response.json();
      console.error(error);
      return;
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched odds for ${data.length} games!`);
    console.log('\n📊 Sample Game Data:');
    
    if (data.length > 0) {
      const firstGame = data[0];
      console.log(`Game: ${firstGame.away_team} @ ${firstGame.home_team}`);
      console.log(`Time: ${firstGame.commence_time}`);
      console.log(`Bookmakers available: ${firstGame.bookmakers.length}`);
      console.log('\nSportsbooks in this game:');
      firstGame.bookmakers.forEach(book => {
        console.log(`  - ${book.key}: ${book.markets.length} markets`);
      });
    }
    
    console.log('\n✨ API Integration is working perfectly!');
    
  } catch (error) {
    console.error('❌ Fetch Error:', error.message);
  }
};

// Run the test
testOddsAPI();