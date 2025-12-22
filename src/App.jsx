import React, { useState, useEffect } from 'react';
import { 
  Trophy, TrendingUp, Shield, Search, ArrowUpDown, 
  Menu, RefreshCw, Calendar, Activity, Lock
} from 'lucide-react';

// --- UTILITY COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-[#1e1e1e] rounded-xl p-6 shadow-lg border border-[#333] ${className}`}>
    {children}
  </div>
);

const StatBar = ({ value, max, color, inverse = false }) => {
  // Normalize value to 0-100 scale based on max range
  // Inverse is for stats where "Lower is Better" (like Defense EPA)
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="w-full bg-[#333] h-2 rounded-full mt-2 overflow-hidden">
      <div 
        style={{ 
          width: `${percentage}%`, 
          backgroundColor: color 
        }} 
        className="h-full rounded-full transition-all duration-500" 
      />
    </div>
  );
};

const Badge = ({ children, color }) => (
  <span style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}40` }} 
    className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
    {children}
  </span>
);

// --- MAIN APP COMPONENT ---

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'off_epa', direction: 'desc' });
  const [activeTab, setActiveTab] = useState('overview'); // overview, offense, defense
  const [lastUpdated, setLastUpdated] = useState(null);

  // --- 1. DATA FETCHING (The New "Robot" Connection) ---
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-data/main/weekly_stats.json")
      .then(res => res.json())
      .then(data => {
        // Transform the flat JSON into the shape our app expects
        // (If your JSON structure changes, we update this transformer)
        setGames(data);
        setLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch(err => {
        console.error("Data Load Error:", err);
        setLoading(false);
      });
  }, []);

  // --- 2. SORTING ENGINE ---
  const sortedData = [...games].sort((a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    // Handle numeric conversion safely
    if (!isNaN(parseFloat(aVal))) aVal = parseFloat(aVal);
    if (!isNaN(parseFloat(bVal))) bVal = parseFloat(bVal);

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(team => 
    team.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'desc';
    // If selecting Defense EPA, default to ascending (because lower is better)
    if (key.includes('def_epa')) direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    } else if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // --- 3. RENDER HELPERS ---
  
  // Helper to color code EPA numbers
  const getEpaColor = (value, isDefense = false) => {
    const num = parseFloat(value);
    // For Defense: Negative is Good (Green), Positive is Bad (Red)
    if (isDefense) return num < 0 ? '#4caf50' : '#ff5252';
    // For Offense: Positive is Good (Green), Negative is Bad (Red)
    return num > 0 ? '#4caf50' : '#ff5252';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#00d2be]">
      <Activity className="animate-spin mr-3" /> Initializing Platinum Rose...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans selection:bg-[#00d2be] selection:text-black pb-20">
      
      {/* --- HEADER --- */}
      <header className="bg-[#181818] border-b border-[#333] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00d2be] to-[#00756a] rounded-lg flex items-center justify-center shadow-lg shadow-[#00d2be]/20">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                PLATINUM ROSE
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <span>WEEK 17</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="flex items-center gap-1 text-[#00d2be]">
                  <Activity size={10} /> LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Find Team..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#252525] border border-[#333] text-sm rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:border-[#00d2be] focus:ring-1 focus:ring-[#00d2be] transition-all"
              />
            </div>
            <button className="p-2 hover:bg-[#333] rounded-full transition-colors text-gray-400 hover:text-white">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['overview', 'offense', 'defense'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${
                activeTab === tab 
                  ? 'bg-[#00d2be] text-black shadow-lg shadow-[#00d2be]/20 transform scale-105' 
                  : 'bg-[#1e1e1e] text-gray-500 hover:bg-[#2a2a2a] hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- DATA TABLE CARD --- */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#252525] text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => requestSort('team')}>
                    Team <ArrowUpDown size={12} className="inline ml-1" />
                  </th>
                  
                  {/* DYNAMIC COLUMNS BASED ON TAB */}
                  {(activeTab === 'overview' || activeTab === 'offense') && (
                    <>
                      <th className="p-4 cursor-pointer hover:text-[#00d2be]" onClick={() => requestSort('off_epa')}>
                        Off EPA <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-4 cursor-pointer hover:text-[#00d2be]" onClick={() => requestSort('off_success')}>
                        Success Rate <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                    </>
                  )}
                  
                  {(activeTab === 'overview' || activeTab === 'defense') && (
                    <>
                      <th className="p-4 cursor-pointer hover:text-[#ff5252]" onClick={() => requestSort('def_epa')}>
                        Def EPA <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-4 cursor-pointer hover:text-[#ff5252]" onClick={() => requestSort('def_pass_epa')}>
                         Pass Def <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#2a2a2a]">
                {filteredData.map((team, idx) => (
                  <tr key={idx} className="hover:bg-[#2a2a2a] transition-colors group">
                    
                    {/* Team Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="font-black text-xl text-white tracking-tight">{team.team}</div>
                      </div>
                    </td>

                    {/* OFFENSE STATS */}
                    {(activeTab === 'overview' || activeTab === 'offense') && (
                      <>
                        <td className="p-4 font-mono">
                          <div style={{ color: getEpaColor(team.off_epa) }} className="font-bold text-lg">
                            {parseFloat(team.off_epa).toFixed(3)}
                          </div>
                          {/* Visual Bar for EPA */}
                          <div className="w-24 opacity-50 group-hover:opacity-100 transition-opacity">
                            <StatBar value={parseFloat(team.off_epa) + 0.3} max={0.6} color={getEpaColor(team.off_epa)} />
                          </div>
                        </td>
                        <td className="p-4 font-mono text-gray-300">
                          {(parseFloat(team.off_success) * 100).toFixed(1)}%
                        </td>
                      </>
                    )}

                    {/* DEFENSE STATS */}
                    {(activeTab === 'overview' || activeTab === 'defense') && (
                      <>
                        <td className="p-4 font-mono">
                          <div style={{ color: getEpaColor(team.def_epa, true) }} className="font-bold text-lg">
                            {parseFloat(team.def_epa).toFixed(3)}
                          </div>
                        </td>
                         <td className="p-4 font-mono text-gray-300">
                            {parseFloat(team.def_pass_epa).toFixed(3)}
                        </td>
                      </>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>Platinum Rose System v2.1 • Data updated: {lastUpdated}</p>
          <p className="mt-2 text-xs">Generated by Python • Hosted on GitHub • Powered by React</p>
        </div>

      </main>
    </div>
  );
}

export default App;