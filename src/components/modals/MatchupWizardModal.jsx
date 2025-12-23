import React, { useState, useEffect, useMemo } from 'react';
import { X, Trophy, Activity, TrendingUp, Shield, Zap, Target, DollarSign, ChevronRight } from 'lucide-react';

// --- SHARED LOGOS (Ensure consistency) ---
const TEAM_LOGOS = {
  "ARI": "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png", "ATL": "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png", "BAL": "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png", "BUF": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png", "CAR": "https://a.espncdn.com/i/teamlogos/nfl/500/car.png", "CHI": "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png", "CIN": "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png", "CLE": "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png", "DAL": "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png", "DEN": "https://a.espncdn.com/i/teamlogos/nfl/500/den.png", "DET": "https://a.espncdn.com/i/teamlogos/nfl/500/det.png", "GB":  "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png", "HOU": "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png", "IND": "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png", "JAX": "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png", "KC":  "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png", "LAC": "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png", "LAR": "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png", "LV":  "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png", "MIA": "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png", "MIN": "https://a.espncdn.com/i/teamlogos/nfl/500/min.png", "NE":  "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png", "NO":  "https://a.espncdn.com/i/teamlogos/nfl/500/no.png", "NYG": "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png", "NYJ": "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png", "PHI": "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png", "PIT": "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png", "SEA": "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", "SF":  "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png", "TB":  "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png", "TEN": "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png", "WAS": "https://a.espncdn.com/i/teamlogos/nfl/500/was.png", "WSH": "https://a.espncdn.com/i/teamlogos/nfl/500/was.png",
  "Cardinals": "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png", "Falcons": "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png", "Ravens": "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png", "Bills": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png", "Panthers": "https://a.espncdn.com/i/teamlogos/nfl/500/car.png", "Bears": "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png", "Bengals": "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png", "Browns": "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png", "Cowboys": "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png", "Broncos": "https://a.espncdn.com/i/teamlogos/nfl/500/den.png", "Lions": "https://a.espncdn.com/i/teamlogos/nfl/500/det.png", "Packers": "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png", "Texans": "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png", "Colts": "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png", "Jaguars": "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png", "Chiefs": "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png", "Raiders": "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png", "Chargers": "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png", "Rams": "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png", "Dolphins": "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png", "Vikings": "https://a.espncdn.com/i/teamlogos/nfl/500/min.png", "Patriots": "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png", "Saints": "https://a.espncdn.com/i/teamlogos/nfl/500/no.png", "Giants": "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png", "Jets": "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png", "Eagles": "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png", "Steelers": "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png", "49ers": "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png", "Seahawks": "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", "Buccaneers": "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png", "Titans": "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png", "Commanders": "https://a.espncdn.com/i/teamlogos/nfl/500/was.png", "Washington": "https://a.espncdn.com/i/teamlogos/nfl/500/was.png"
};

export default function MatchupWizardModal({ isOpen, onClose, game, onBet, stats }) {
  const [selectedBet, setSelectedBet] = useState(null);
  
  // --- 1. CALCULATE LEAGUE RANKS ---
  const ranks = useMemo(() => {
    if (!stats || stats.length === 0) return {};
    const processed = stats.map(s => ({
        team: s.team,
        off: parseFloat(s.off_epa || 0),
        def: parseFloat(s.def_epa || 0)
    }));
    // Sort Highest to Lowest for Offense
    const offSorted = [...processed].sort((a,b) => b.off - a.off);
    // Sort Lowest to Highest for Defense (lower EPA is better for defense)
    const defSorted = [...processed].sort((a,b) => a.def - b.def);
    
    const rankMap = {};
    processed.forEach(t => {
        rankMap[t.team] = {
            off: offSorted.findIndex(x => x.team === t.team) + 1,
            def: defSorted.findIndex(x => x.team === t.team) + 1
        };
    });
    return rankMap;
  }, [stats]);

  if (!isOpen || !game) return null;

  // --- 2. MINI SIMULATION FOR CONTEXT ---
  const hRank = ranks[game.home] || { off: '-', def: '-' };
  const vRank = ranks[game.visitor] || { off: '-', def: '-' };
  
  // Rough projection logic (mirrors DevLab)
  const homeEPA = stats.find(s => s.team === game.home)?.off_epa || 0;
  const visEPA = stats.find(s => s.team === game.visitor)?.off_epa || 0;
  const projHome = 21 + (homeEPA * 30); 
  const projVis = 21 + (visEPA * 30);
  const projSpread = (projVis - projHome).toFixed(1);
  
  // Determine Edge
  const edgeDiff = Math.abs(projSpread - game.spread);
  const hasEdge = edgeDiff > 2.0;
  const edgeSide = hasEdge ? (projSpread < game.spread ? game.home : game.visitor) : null;

  const BetButton = ({ type, label, value, edge }) => {
      const isSelected = selectedBet === type;
      return (
          <button 
            onClick={() => setSelectedBet(type)}
            className={`relative w-full p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                isSelected 
                ? 'bg-emerald-900/40 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' 
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
            }`}
          >
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</span>
              <span className="text-lg font-black text-white">{value > 0 && type !== 'total' ? `+${value}` : value}</span>
              {edge && <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-lg animate-pulse">AI EDGE</div>}
          </button>
      );
  };

  const RankBadge = ({ rank, type }) => {
      let color = "bg-slate-800 text-slate-400";
      if (rank <= 5) color = "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      else if (rank >= 25) color = "bg-rose-500/20 text-rose-400 border-rose-500/50";
      
      return (
          <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border border-transparent ${color}`}>
              <span className="text-[8px] font-bold uppercase">{type}</span>
              <span className="text-sm font-black">#{rank}</span>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="relative bg-slate-950 p-6 border-b border-slate-800">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                <X size={18} />
            </button>
            
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full p-3 mb-2 shadow-lg ring-1 ring-white/10">
                        <img src={TEAM_LOGOS[game.visitor]} alt={game.visitor} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight">{Math.round(projVis)}</div>
                    <div className="text-[10px] font-mono text-emerald-400">Proj. Score</div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Matchup Analysis</div>
                    <div className="text-3xl font-thin text-slate-700">@</div>
                    {hasEdge && (
                        <div className="mt-2 px-3 py-1 bg-purple-900/30 border border-purple-500/50 rounded-full text-purple-300 text-[10px] font-bold flex items-center gap-1">
                            <Zap size={10} className="fill-purple-300" />
                            Model Likes {edgeSide}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full p-3 mb-2 shadow-lg ring-1 ring-white/10">
                        <img src={TEAM_LOGOS[game.home]} alt={game.home} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight">{Math.round(projHome)}</div>
                    <div className="text-[10px] font-mono text-emerald-400">Proj. Score</div>
                </div>
            </div>
        </div>

        {/* STATS COMPARISON */}
        <div className="p-4 grid grid-cols-2 gap-4 bg-slate-900/50">
            <div className="space-y-3">
                <div className="text-xs font-bold text-slate-500 text-center uppercase">Offense Ranks</div>
                <div className="flex justify-between px-4">
                    <RankBadge rank={vRank.off} type="VIS" />
                    <div className="flex items-center text-slate-700"><TrendingUp size={16} /></div>
                    <RankBadge rank={hRank.off} type="HOME" />
                </div>
            </div>
            <div className="space-y-3 border-l border-slate-800">
                <div className="text-xs font-bold text-slate-500 text-center uppercase">Defense Ranks</div>
                <div className="flex justify-between px-4">
                    <RankBadge rank={vRank.def} type="VIS" />
                    <div className="flex items-center text-slate-700"><Shield size={16} /></div>
                    <RankBadge rank={hRank.def} type="HOME" />
                </div>
            </div>
        </div>

        {/* BETTING BOARD */}
        <div className="p-6 space-y-4">
            <div className="text-sm font-bold text-white flex items-center gap-2">
                <Target size={16} className="text-emerald-400" />
                Select Your Wager
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                <BetButton type="vis_spread" label={`${game.visitor} Spread`} value={game.spread * -1} edge={edgeSide === game.visitor} />
                <BetButton type="total_over" label={`Over ${game.total}`} value="O" />
                <BetButton type="home_spread" label={`${game.home} Spread`} value={game.spread} edge={edgeSide === game.home} />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                <BetButton type="vis_ml" label={`${game.visitor} ML`} value={game.visitor_ml} />
                <BetButton type="total_under" label={`Under ${game.total}`} value="U" />
                <BetButton type="home_ml" label={`${game.home} ML`} value={game.home_ml} />
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-4 mt-2 border-t border-slate-800 flex gap-3">
                <button 
                    onClick={() => {
                        if(selectedBet) {
                            onBet(game.id, 'spread', selectedBet, -110);
                            onClose();
                        }
                    }}
                    disabled={!selectedBet}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                >
                    <DollarSign size={18} />
                    {selectedBet ? 'CONFIRM BET' : 'Select a Play'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}