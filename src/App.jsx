import React, { useState, useEffect } from 'react';
import { Trophy, Activity, List, Trash2, DollarSign } from 'lucide-react';

// --- IMPORTS: Modular Components ---
import { WEEK_17_SCHEDULE } from './lib/constants';
import Dashboard from './components/dashboard/Dashboard';
import MatchupWizardModal from './components/modals/MatchupWizardModal';

function App() {
  // --- STATE MANAGEMENT ---
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'mycard'
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
    
    // Prevent duplicate bets (optional logic)
    const newBet = {
      id: Date.now(),
      game: `${game.visitor} @ ${game.home}`,
      selection,
      type,
      line,
      odds: -110 // Default odds
    };
    
    setMyBets([newBet, ...myBets]);
    setSelectedGame(null); // Close the Wizard after placing a bet
  };

  const removeBet = (id) => {
    setMyBets(myBets.filter(b => b.id !== id));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-[#00d2be] font-mono">
      Loading Data Engine...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans pb-20 selection:bg-[#00d2be] selection:text-black">
      
      {/* --- HEADER --- */}
      <header className="bg-[#181818] border-b border-[#333] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00d2be] rounded flex items-center justify-center shadow-lg shadow-[#00d2be]/20">
              <Trophy size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">PLATINUM ROSE</h1>
              <p className="text-xs text-[#00d2be] uppercase tracking-widest">Week 17 • Live</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex bg-[#252525] rounded p-1">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'dashboard' ? 'bg-[#333] text-white shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Activity size={16}/> Board
            </button>
            <button 
              onClick={() => setActiveTab('mycard')} 
              className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'mycard' ? 'bg-[#333] text-white shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <List size={16}/> My Card 
              {myBets.length > 0 && (
                <span className="bg-[#00d2be] text-black text-[10px] px-1.5 rounded-full min-w-[1.2rem] text-center">
                  {myBets.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* VIEW 1: THE DASHBOARD GRID */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            schedule={WEEK_17_SCHEDULE} 
            stats={stats} 
            onGameClick={setSelectedGame} 
          />
        )}

        {/* VIEW 2: MY BETTING CARD */}
        {activeTab === 'mycard' && (
          <div className="max-w-3xl mx-auto bg-[#1e1e1e] rounded-xl border border-[#333] p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <List className="text-[#00d2be]"/> Your Active Bets
            </h2>
            
            {myBets.length === 0 ? (
              <div className="text-center py-10 text-gray-500 border border-dashed border-[#333] rounded-lg">
                <DollarSign size={40} className="mx-auto mb-3 opacity-20"/>
                <p>No bets placed yet.</p>
                <p className="text-sm mt-1">Go to the Board and use the Wizard to add picks.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myBets.map(bet => (
                  <div key={bet.id} className="bg-[#252525] p-4 rounded-lg border border-[#333] flex justify-between items-center group hover:border-[#00d2be]/30 transition-colors">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                         <span>{bet.game}</span>
                         <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                         <span className="uppercase">{bet.type}</span>
                      </div>
                      <div className="text-lg font-bold text-white flex items-center gap-2">
                        {bet.selection} 
                        <span className="text-[#00d2be] font-mono bg-[#00d2be]/10 px-1.5 rounded text-base">
                          {bet.line > 0 ? `+${bet.line}` : bet.line}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeBet(bet.id)} 
                      className="p-2 hover:bg-rose-900/20 hover:text-rose-400 text-gray-600 rounded transition-colors"
                      title="Remove Bet"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODAL LAYER --- */}
      {/* We use the "Boolean trick" (!!selectedGame) to determine isOpen */}
      <MatchupWizardModal 
        isOpen={!!selectedGame}
        game={selectedGame} 
        stats={stats} 
        onClose={() => setSelectedGame(null)} 
        onBet={(id, type, sel, line) => {
          handleBet(id, type, sel, line);
          // Note: We close the modal after placing a bet to give feedback
          // If you want to place multiple bets, comment out the line below
          setSelectedGame(null); 
        }}
      />

    </div>
  );
}

export default App;