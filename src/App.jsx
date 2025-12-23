import React, { useState, useEffect } from 'react';

// --- IMPORTS ---
import { WEEK_17_SCHEDULE, INITIAL_EXPERTS } from './lib/constants';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Standings from './components/dashboard/Standings';
import MatchupWizardModal from './components/modals/MatchupWizardModal';
import MyCardModal from './components/modals/MyCardModal';
import DevLab from './components/dev-lab/DevLab';
import SplitsModal from './components/modals/SplitsModal'; 
import WongTeaserModal from './components/modals/WongTeaserModal';
import PulseModal from './components/modals/PulseModal';       // 🔥 NEW
import ContestLinesModal from './components/modals/ContestLinesModal'; // 🔥 NEW

function App() {
  const [stats, setStats] = useState([]);
  const [splits, setSplits] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedGame, setSelectedGame] = useState(null);
  
  // --- MODAL STATES ---
  const [showSplits, setShowSplits] = useState(false);
  const [showTeasers, setShowTeasers] = useState(false);
  const [showPulse, setShowPulse] = useState(false);     // 🔥 NEW: Pulse Modal State
  const [showContest, setShowContest] = useState(false); // 🔥 NEW: Contest Modal State

  const [myBets, setMyBets] = useState([]);
  const [simResults, setSimResults] = useState({});
  const [contestLines, setContestLines] = useState({}); // 🔥 NEW: Store Contest Lines

  // --- DATA FETCHING ---
  useEffect(() => {
    Promise.all([
        fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-data/main/weekly_stats.json").then(r => r.json()),
        fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-app/main/betting_splits.json").then(r => r.json()).catch(() => ({}))
    ]).then(([statsData, splitsData]) => {
        setStats(statsData);
        setSplits(splitsData || {});
        setLoading(false);
    }).catch(err => console.error("Error loading data:", err));
  }, []);

  // --- MERGE DATA INTO SCHEDULE ---
  // Now injects Pulse data (splits) AND Contest Lines into every game object
  const gamesWithSplits = WEEK_17_SCHEDULE.map(game => {
      const gameData = splits[game.id] || splits[String(game.id)];
      return {
          ...game,
          splits: gameData?.splits || null,
          contestSpread: contestLines[game.id] || null // 🔥 NEW: Flow contest lines to cards
      };
  });

  const handleBet = (gameId, type, selection, line) => {
    const game = WEEK_17_SCHEDULE.find(g => g.id === gameId);
    const newBet = { id: Date.now(), game: `${game.visitor} @ ${game.home}`, gameId, selection, type, line, odds: -110, status: 'OPEN' };
    setMyBets([newBet, ...myBets]);
    setSelectedGame(null);
  };
  const removeBet = (id) => setMyBets(myBets.filter(b => b.id !== id));
  const handleLockBets = (betIds) => setMyBets(prev => prev.map(bet => (betIds.includes(bet.id) ? { ...bet, status: 'PLACED' } : bet)));

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-[#00d2be] font-mono">Loading Data Engine...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans pb-20 selection:bg-[#00d2be] selection:text-black">
      
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={myBets.length} 
        onSyncOdds={() => console.log("Sync")}
        
        // --- WIRING THE BUTTONS ---
        onOpenSplits={() => setShowPulse(true)}     // 🔥 "Pulse" button now opens PulseModal
        onOpenTeasers={() => setShowTeasers(true)}
        onOpenContest={() => setShowContest(true)}  // 🔥 New Button Action
        
        // --- DATA BUTTONS ---
        onLoad={() => alert("Load Data functionality coming soon!")} 
        onSave={() => alert("Save Picks functionality coming soon!")} 
        onReset={() => { if(window.confirm("Reset all picks?")) setMyBets([]); }}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
            <div className="animate-in fade-in zoom-in duration-300">
                <Dashboard 
                    schedule={gamesWithSplits} 
                    stats={stats} 
                    simResults={simResults}
                    onGameClick={setSelectedGame} 
                />
            </div>
        )}
        {activeTab === 'standings' && <Standings experts={INITIAL_EXPERTS} />}
        {activeTab === 'mycard' && <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300"><MyCardModal bets={myBets} onRemoveBet={removeBet} onLockBets={handleLockBets} onClearCard={() => setMyBets([])} /></div>}
        {activeTab === 'devlab' && (
            <DevLab 
                games={WEEK_17_SCHEDULE} 
                stats={stats} 
                savedResults={simResults} 
                onSimComplete={setSimResults} 
            />
        )}
      </main>

      {/* --- MODALS --- */}
      <MatchupWizardModal isOpen={!!selectedGame} game={selectedGame} stats={stats} onClose={() => setSelectedGame(null)} onBet={(id, type, sel, line) => { handleBet(id, type, sel, line); setSelectedGame(null); }} />
      
      {/* 🔥 NEW MODALS WIRED UP */}
      <PulseModal 
        isOpen={showPulse} 
        onClose={() => setShowPulse(false)} 
        games={gamesWithSplits} 
      />

      <ContestLinesModal 
        isOpen={showContest} 
        onClose={() => setShowContest(false)} 
        games={gamesWithSplits}
        onUpdateContestLines={setContestLines}
      />

      <WongTeaserModal 
        isOpen={showTeasers} 
        onClose={() => setShowTeasers(false)} 
        games={gamesWithSplits} 
      />
      
      {/* Legacy Modal (Optional, kept to prevent errors if referenced elsewhere) */}
      <SplitsModal 
        isOpen={showSplits} 
        onClose={() => setShowSplits(false)} 
        games={gamesWithSplits} 
      />

    </div>
  );
}

export default App;