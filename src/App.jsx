import React, { useState, useEffect } from 'react';

// --- IMPORTS: Modular Components ---
import { WEEK_17_SCHEDULE, INITIAL_EXPERTS } from './lib/constants';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Standings from './components/dashboard/Standings';
import MatchupWizardModal from './components/modals/MatchupWizardModal';
import MyCardModal from './components/modals/MyCardModal';

function App() {
  // --- STATE MANAGEMENT ---
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'mycard', 'standings', 'devlab'
  const [selectedGame, setSelectedGame] = useState(null);  // Triggers the Wizard Modal
  const [myBets, setMyBets] = useState([]);

  // --- DATA FETCHING (From GitHub) ---
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-data/main/weekly_stats.json")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  // --- BETTING LOGIC ---
  const handleBet = (gameId, type, selection, line) => {
    const game = WEEK_17_SCHEDULE.find(g => g.id === gameId);
    
    const newBet = {
      id: Date.now(),
      game: `${game.visitor} @ ${game.home}`,
      gameId: gameId,
      selection,
      type, // 'spread' or 'total'
      line,
      odds: -110, // Default odds
      status: 'OPEN' // New bets start as OPEN
    };
    
    setMyBets([newBet, ...myBets]);
    setSelectedGame(null); // Close the Wizard after placing a bet
  };

  const removeBet = (id) => {
    setMyBets(myBets.filter(b => b.id !== id));
  };

  // Handler: Locks selected bets (moves them to "Placed")
  const handleLockBets = (betIds) => {
    setMyBets(prev => prev.map(bet => {
        if (betIds.includes(bet.id)) {
            return { ...bet, status: 'PLACED' };
        }
        return bet;
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-[#00d2be] font-mono">
      Loading Data Engine...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans pb-20 selection:bg-[#00d2be] selection:text-black">
      
      {/* --- HEADER --- */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={myBets.length}
        // Placeholders for future tools
        onSyncOdds={() => console.log("Sync triggered")}
        onReset={() => console.log("Reset triggered")}
        onSaveFile={() => console.log("Save triggered")}
      />

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* VIEW 1: THE DASHBOARD GRID */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <Dashboard 
              schedule={WEEK_17_SCHEDULE} 
              stats={stats} 
              onGameClick={setSelectedGame} 
            />
          </div>
        )}

        {/* VIEW 2: EXPERT STANDINGS */}
        {activeTab === 'standings' && (
          <Standings experts={INITIAL_EXPERTS} />
        )}

        {/* VIEW 3: MY BETTING CARD */}
        {activeTab === 'mycard' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <MyCardModal 
              bets={myBets} 
              onRemoveBet={removeBet} 
              onLockBets={handleLockBets}
              onClearCard={() => setMyBets([])}
              onCreateParlay={(ids, odds, type) => alert("Parlay logic coming soon!")}
            />
          </div>
        )}

        {/* VIEW 4: DEV LAB (Placeholder) */}
        {activeTab === 'devlab' && (
          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-[#333] rounded-xl bg-[#121212]">
             <h2 className="text-2xl text-gray-500 font-bold mb-2">AI Developer Lab</h2>
             <p className="text-gray-600">Coming in next update...</p>
          </div>
        )}

      </main>

      {/* --- MODAL LAYER --- */}
      <MatchupWizardModal 
        isOpen={!!selectedGame}
        game={selectedGame} 
        stats={stats} 
        onClose={() => setSelectedGame(null)} 
        onBet={(id, type, sel, line) => {
          handleBet(id, type, sel, line);
          setSelectedGame(null); 
        }}
      />

    </div>
  );
}

export default App;