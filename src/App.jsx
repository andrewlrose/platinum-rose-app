import React, { useState, useEffect } from 'react';
import { 
  Trophy, TrendingUp, Shield, Calendar, RefreshCw, 
  ChevronRight, Activity, Lock, Save 
} from 'lucide-react';

// --- 1. THE SCHEDULE (Week 17 Matchups) ---
// Since our Python script doesn't fetch the schedule yet, we define it here.
const WEEK_17_SCHEDULE = [
  { id: 1, home: 'CHI', visitor: 'SEA', spread: -2.5, total: 42.5, time: 'Thu 8:15 PM' },
  { id: 2, home: 'CIN', visitor: 'DEN', spread: -9.5, total: 43.5, time: 'Sat 1:00 PM' },
  { id: 3, home: 'BUF', visitor: 'NYJ', spread: -13.5, total: 44.5, time: 'Sun 1:00 PM' },
  { id: 4, home: 'CLE', visitor: 'MIA', spread: 3.5, total: 41.0, time: 'Sun 8:20 PM' },
  { id: 5, home: 'PHI', visitor: 'DAL', spread: -2.5, total: 48.0, time: 'Sun 4:25 PM' },
  { id: 6, home: 'NE', visitor: 'LAC', spread: -3.0, total: 40.5, time: 'Sun 1:00 PM' },
  { id: 7, home: 'NO', visitor: 'LV', spread: -5.5, total: 42.0, time: 'Sun 1:00 PM' },
  { id: 8, home: 'IND', visitor: 'TEN', spread: -4.0, total: 43.0, time: 'Sun 1:00 PM' },
  { id: 9, home: 'JAX', visitor: 'HOU', spread: 1.5, total: 45.0, time: 'Sun 1:00 PM' },
  { id: 10, home: 'LAR', visitor: 'ARI', spread: -6.5, total: 47.5, time: 'Sun 4:25 PM' },
  { id: 11, home: 'WAS', visitor: 'ATL', spread: -3.0, total: 46.0, time: 'Sun 1:00 PM' },
  { id: 12, home: 'TB', visitor: 'CAR', spread: -5.0, total: 41.5, time: 'Sun 1:00 PM' },
  { id: 13, home: 'MIN', visitor: 'GB', spread: 4.5, total: 45.5, time: 'Sun 8:20 PM' },
  { id: 14, home: 'SF', visitor: 'DET', spread: -4.5, total: 51.5, time: 'Mon 8:15 PM' },
  { id: 15, home: 'PIT', visitor: 'KC', spread: 3.5, total: 44.0, time: 'Wed 1:00 PM' },
  { id: 16, home: 'BAL', visitor: 'NYG', spread: -6.0, total: 43.0, time: 'Sun 1:00 PM' }
];

// --- 2. COMPONENTS (Built-in to avoid file errors) ---

const StatBadge = ({ label, value, goodCondition }) => {
  const isGood = goodCondition ? value > 0 : value < 0;
  const colorClass = isGood ? "text-green-400" : "text-rose-400";
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
      <span className={`font-mono font-bold text-sm ${colorClass}`}>
        {value ? parseFloat(value).toFixed(2) : '-'}
      </span>
    </div>
  );
};

const MatchupCard = ({ game, stats }) => {
  const homeStats = stats.find(s => s.team === game.home) || {};
  const visStats = stats.find(s => s.team === game.visitor) || {};

  // Simple "Edge" Calculation (Just for fun visuals)
  const homeEdge = (parseFloat(homeStats.off_epa) || 0) - (parseFloat(visStats.def_epa) || 0);
  const visEdge = (parseFloat(visStats.off_epa) || 0) - (parseFloat(homeStats.def_epa) || 0);

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-[#333] overflow-hidden shadow-lg hover:shadow-[#00d2be]/10 transition-all duration-300">
      
      {/* Header: Time & Line */}
      <div className="bg-[#252525] px-4 py-2 flex justify-between items-center border-b border-[#333]">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Calendar size={12} /> {game.time}
        </span>
        <span className="text-xs font-mono text-[#00d2be] bg-[#00d2be]/10 px-2 py-1 rounded">
          {game.home} {game.spread > 0 ? '+' : ''}{game.spread} • {game.total}u
        </span>
      </div>

      {/* Teams Grid */}
      <div className="p-4 grid grid-cols-2 gap-4 relative">
        
        {/* Visitor */}
        <div className="text-center relative z-10">
          <h3 className="text-2xl font-black text-gray-200">{game.visitor}</h3>
          <div className="mt-3 space-y-2">
            <StatBadge label="Off EPA" value={visStats.off_epa} goodCondition={true} />
            <StatBadge label="Def EPA" value={visStats.def_epa} goodCondition={false} />
            <StatBadge label="Success" value={visStats.off_success * 100} goodCondition={true} />
          </div>
        </div>

        {/* Home */}
        <div className="text-center relative z-10 border-l border-[#333]">
          <h3 className="text-2xl font-black text-gray-200">{game.home}</h3>
          <div className="mt-3 space-y-2">
            <StatBadge label="Off EPA" value={homeStats.off_epa} goodCondition={true} />
            <StatBadge label="Def EPA" value={homeStats.def_epa} goodCondition={false} />
            <StatBadge label="Success" value={homeStats.off_success * 100} goodCondition={true} />
          </div>
        </div>
        
        {/* VS Bubble */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#121212] border border-[#333] rounded-full w-8 h-8 flex items-center justify-center text-[10px] text-gray-500 z-20">
          VS
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#1a1a1a] px-4 py-3 border-t border-[#333] flex justify-between items-center">
        <div className="text-xs text-gray-500">
           Edge: <span className={homeEdge > visEdge ? "text-green-400" : "text-rose-400"}>
             {homeEdge > visEdge ? game.home : game.visitor}
           </span>
        </div>
        <button className="text-xs bg-[#333] hover:bg-[#00d2be] hover:text-black text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1">
          Analysis <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

// --- 3. MAIN APP ---

function App() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the EPA data from your GitHub
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-data/main/weekly_stats.json")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#00d2be]">
      <Activity className="animate-spin mr-2" /> Loading Platinum Rose...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans pb-20">
      
      {/* HEADER */}
      <header className="bg-[#181818] border-b border-[#333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00d2be] rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,210,190,0.3)]">
              <Trophy size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">PLATINUM ROSE</h1>
              <p className="text-xs text-[#00d2be] uppercase tracking-widest">Week 17 • Live Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="p-2 bg-[#252525] rounded hover:bg-[#333]"><RefreshCw size={18} /></button>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-[#00d2be]" /> Matchup Analysis
          </h2>
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-[#252525] rounded text-xs text-gray-400 border border-[#333]">
               Data Source: GitHub / nflfastR
             </span>
          </div>
        </div>

        {/* The Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {WEEK_17_SCHEDULE.map(game => (
            <MatchupCard key={game.id} game={game} stats={stats} />
          ))}
        </div>

      </main>
    </div>
  );
}

export default App;