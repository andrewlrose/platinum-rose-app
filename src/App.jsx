import React, { useState, useEffect } from 'react';

// --- IMPORTS: Modular Components ---
import { WEEK_17_SCHEDULE, INITIAL_EXPERTS } from './lib/constants';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Standings from './components/dashboard/Standings';
import MatchupWizardModal from './components/modals/MatchupWizardModal';
import MyCardModal from './components/modals/MyCardModal';
import DevLab from './components/dev-lab/DevLab'; // <--- NEW IMPORT

function App() {
  // --- STATE MANAGEMENT ---
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [selectedGame, setSelectedGame] = useState(null);
  const [myBets, setMyBets] = useState([]);
  const [simResults, setSimResults] = useState({}); // <--- NEW STATE

  // --- DATA FETCHING ---
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-data/main/weekly_stats.json")
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  const handleBet = (gameId, type, selection, line) => {
    const game = WEEK_17_SCHEDULE.find(g => g.id === gameId);
    const newBet = {
      id: Date.now(),
      game: `${game.visitor} @ ${game.home}`,
      gameId: gameId,
      selection, type, line, odds: -110, status: 'OPEN'
    };
    setMyBets([newBet, ...myBets]);
    setSelectedGame(null);
  };

  const removeBet = (id) => setMyBets(myBets.filter(b => b.id !== id));
  
  const handleLockBets = (betIds) => {
    setMyBets(prev => prev.map(bet => {
        if (betIds.includes(bet.id)) return { ...bet, status: 'PLACED' };
        return bet;
    }));
  };

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-[#00d2be] font-mono">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans pb-20 selection:bg-[#00d2be] selection:text-black">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} cartCount={myBets.length} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <div className="animate-in fade-in zoom-in duration-300"><Dashboard schedule={WEEK_17_SCHEDULE} stats={stats} onGameClick={setSelectedGame} /></div>}
        {activeTab === 'standings' && <Standings experts={INITIAL_EXPERTS} />}
        {activeTab === 'mycard' && <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300"><MyCardModal bets={myBets} onRemoveBet={removeBet} onLockBets={handleLockBets} onClearCard={() => setMyBets([])} /></div>}
        
        {/* VIEW 4: DEV LAB (NEW) */}
        {activeTab === 'devlab' && (
          <DevLab 
            games={WEEK_17_SCHEDULE} 
            savedResults={simResults}
            onSimComplete={setSimResults}
          />
        )}
      </main>

      <MatchupWizardModal isOpen={!!selectedGame} game={selectedGame} stats={stats} onClose={() => setSelectedGame(null)} onBet={(id, type, sel, line) => { handleBet(id, type, sel, line); setSelectedGame(null); }} />
    </div>
  );
}

export default App;