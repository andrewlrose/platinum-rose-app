import React, { useState, useEffect, useRef } from 'react';
import { Microscope, Play, RefreshCw, Database, Globe, AlertCircle, Activity } from 'lucide-react'; 

// --- 1. ROBUST LOGO MAP (Fixed) ---
const TEAM_LOGOS = {
  "ARI": "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png", "ATL": "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png", "BAL": "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png", "BUF": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png", "CAR": "https://a.espncdn.com/i/teamlogos/nfl/500/car.png", "CHI": "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png", "CIN": "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png", "CLE": "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png", "DAL": "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png", "DEN": "https://a.espncdn.com/i/teamlogos/nfl/500/den.png", "DET": "https://a.espncdn.com/i/teamlogos/nfl/500/det.png", "GB":  "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png", "HOU": "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png", "IND": "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png", "JAX": "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png", "KC":  "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png", "LAC": "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png", "LAR": "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png", "LV":  "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png", "MIA": "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png", "MIN": "https://a.espncdn.com/i/teamlogos/nfl/500/min.png", "NE":  "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png", "NO":  "https://a.espncdn.com/i/teamlogos/nfl/500/no.png", "NYG": "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png", "NYJ": "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png", "PHI": "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png", "PIT": "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png", "SEA": "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", "SF":  "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png", "TB":  "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png", "TEN": "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png", "WAS": "https://a.espncdn.com/i/teamlogos/nfl/500/was.png", "WSH": "https://a.espncdn.com/i/teamlogos/nfl/500/was.png",
  "Cardinals": "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png", "Falcons": "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png", "Ravens": "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png", "Bills": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png", "Panthers": "https://a.espncdn.com/i/teamlogos/nfl/500/car.png", "Bears": "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png", "Bengals": "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png", "Browns": "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png", "Cowboys": "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png", "Broncos": "https://a.espncdn.com/i/teamlogos/nfl/500/den.png", "Lions": "https://a.espncdn.com/i/teamlogos/nfl/500/det.png", "Packers": "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png", "Texans": "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png", "Colts": "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png", "Jaguars": "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png", "Chiefs": "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png", "Raiders": "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png", "Chargers": "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png", "Rams": "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png", "Dolphins": "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png", "Vikings": "https://a.espncdn.com/i/teamlogos/nfl/500/min.png", "Patriots": "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png", "Saints": "https://a.espncdn.com/i/teamlogos/nfl/500/no.png", "Giants": "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png", "Jets": "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png", "Eagles": "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png", "Steelers": "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png", "49ers": "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png", "Seahawks": "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", "Buccaneers": "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png", "Titans": "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png", "Commanders": "https://a.espncdn.com/i/teamlogos/nfl/500/was.png", "Washington": "https://a.espncdn.com/i/teamlogos/nfl/500/was.png"
};

const groupGamesByWeek = (gamesList) => {
    if (!gamesList || gamesList.length === 0) return { current: [], future: [] };
    const sorted = [...gamesList].sort((a, b) => a.id - b.id);
    return { current: sorted, future: [] };
};

export default function DevLab({ games, stats, onSimComplete, savedResults }) {
  const [isRunning, setIsRunning] = useState(false);
  const [simResults, setSimResults] = useState(savedResults || {});
  const [ratings, setRatings] = useState({});

  const { current: currentGames } = groupGamesByWeek(games);

  // --- AUTOMATICALLY LOAD STATS FROM APP.JSX ---
  useEffect(() => {
    if (stats && stats.length > 0) {
        const processedRatings = {};
        stats.forEach(teamStat => {
            if (teamStat.team) {
                processedRatings[teamStat.team] = {
                    off: parseFloat(teamStat.off_epa || 0),
                    def: parseFloat(teamStat.def_epa || 0),
                    offPass: parseFloat(teamStat.off_pass_epa || teamStat.off_epa || 0),
                    offRush: parseFloat(teamStat.off_rush_epa || teamStat.off_epa || 0),
                    defPass: parseFloat(teamStat.def_pass_epa || teamStat.def_epa || 0),
                    defRush: parseFloat(teamStat.def_rush_epa || teamStat.def_epa || 0),
                    tempo: 1.0
                };
            }
        });
        setRatings(processedRatings);
    }
  }, [stats]);

  // --- MONTE CARLO ENGINE ---
  const handleRunSims = () => {
      if (!ratings || Object.keys(ratings).length === 0) {
          alert("⚠️ No Data Loaded! Waiting for stats engine...");
          return;
      }

      setIsRunning(true);
      setTimeout(() => {
          const results = {};
          games.forEach(game => {
              const homeKey = game.home;
              const visKey = game.visitor;
              const hR = ratings[homeKey];
              const vR = ratings[visKey];
              
              if (hR && vR) {
                  const multiplier = 35; 
                  const homeProj = 21.5 + (hR.off * multiplier) + (vR.def * multiplier) + 1.5; 
                  const visProj = 21.5 + (vR.off * multiplier) + (hR.def * multiplier);
                  
                  // Props Projections
                  const hPassProj = 230 + (hR.offPass * 120) + (vR.defPass * 120);
                  const hRushProj = 115 + (hR.offRush * 80) + (vR.defRush * 80);
                  const vPassProj = 230 + (vR.offPass * 120) + (hR.defPass * 120);
                  const vRushProj = 115 + (vR.offRush * 80) + (hR.defRush * 80);

                  let homeWins = 0, homeCovers = 0, overs = 0;
                  const iterations = 2000; 
                  const stdDev = 13.5; 

                  for(let i=0; i<iterations; i++) {
                      const u1 = Math.random(); const u2 = Math.random();
                      const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
                      const z2 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
                      const hScore = homeProj + (z1 * stdDev);
                      const vScore = visProj + (z2 * stdDev);
                      if (hScore > vScore) homeWins++;
                      if ((hScore - vScore) > (game.spread * -1)) homeCovers++;
                      if ((hScore + vScore) > game.total) overs++;
                  }

                  results[game.id] = {
                      homeWinPct: ((homeWins/iterations)*100).toFixed(1),
                      homeCoverPct: ((homeCovers/iterations)*100).toFixed(1),
                      visCoverPct: (100 - (homeCovers/iterations)*100).toFixed(1),
                      overPct: ((overs/iterations)*100).toFixed(1),
                      underPct: (100 - (overs/iterations)*100).toFixed(1),
                      projHome: homeProj.toFixed(1),
                      projVis: visProj.toFixed(1),
                      projTotal: (homeProj + visProj).toFixed(1),
                      // Pass raw stats for verification
                      rawStats: { home: hR, visitor: vR },
                      hasData: true
                  };
              } else {
                  results[game.id] = { hasData: false };
              }
          });
          setSimResults(results);
          if (onSimComplete) onSimComplete(results); 
          setIsRunning(false);
      }, 500);
  };

  const SimCard = ({ game, res }) => {
      if (!res) return null;
      if (!res.hasData) return (<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex flex-col items-center justify-center opacity-70"><div className="text-slate-500 font-bold mb-1">{game.visitor} @ {game.home}</div><div className="text-[10px] text-rose-400">Data Missing</div></div>);

      const spreadEdge = parseFloat(res.homeCoverPct) >= 55.0 ? game.home : parseFloat(res.visCoverPct) >= 55.0 ? game.visitor : null;
      const spreadVal = spreadEdge === game.home ? res.homeCoverPct : res.visCoverPct;
      const totalEdge = parseFloat(res.overPct) >= 55.0 ? 'OVER' : parseFloat(res.underPct) >= 55.0 ? 'UNDER' : null;
      const totalVal = totalEdge === 'OVER' ? res.overPct : res.underPct;

      // 🔥 VERIFICATION HELPERS
      const vOff = res.rawStats?.visitor?.off.toFixed(2);
      const vDef = res.rawStats?.visitor?.def.toFixed(2);
      const hOff = res.rawStats?.home?.off.toFixed(2);
      const hDef = res.rawStats?.home?.def.toFixed(2);

      return (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all relative overflow-hidden group">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1"><Activity size={10} /> AI Projection</span>
                  {spreadEdge && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">EDGE FOUND</span>}
              </div>

              {/* Matchup */}
              <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col items-center gap-1 w-1/3">
                      <div className="w-12 h-12 bg-slate-800 rounded-full p-2 flex items-center justify-center border border-slate-700">
                          {TEAM_LOGOS[game.visitor] ? <img src={TEAM_LOGOS[game.visitor]} alt={game.visitor} className="w-full h-full object-contain" /> : <span className="text-xs font-bold">{game.visitor.substring(0,2)}</span>}
                      </div>
                      <div className="text-sm font-black text-white">{res.projVis}</div>
                      {/* VERIFICATION DATA */}
                      <div className="text-[9px] text-slate-500 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          EPA: <span className={vOff > 0 ? "text-emerald-400" : "text-rose-400"}>{vOff}</span> / <span className={vDef < 0 ? "text-emerald-400" : "text-rose-400"}>{vDef}</span>
                      </div>
                  </div>

                  <div className="flex flex-col items-center justify-center w-1/3">
                      <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Total</div>
                      <div className="text-2xl font-black text-white tracking-tighter">{res.projTotal}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Line: {game.total}</div>
                  </div>

                  <div className="flex flex-col items-center gap-1 w-1/3">
                      <div className="w-12 h-12 bg-slate-800 rounded-full p-2 flex items-center justify-center border border-slate-700">
                          {TEAM_LOGOS[game.home] ? <img src={TEAM_LOGOS[game.home]} alt={game.home} className="w-full h-full object-contain" /> : <span className="text-xs font-bold">{game.home.substring(0,2)}</span>}
                      </div>
                      <div className="text-sm font-black text-white">{res.projHome}</div>
                      {/* VERIFICATION DATA */}
                      <div className="text-[9px] text-slate-500 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          EPA: <span className={hOff > 0 ? "text-emerald-400" : "text-rose-400"}>{hOff}</span> / <span className={hDef < 0 ? "text-emerald-400" : "text-rose-400"}>{hDef}</span>
                      </div>
                  </div>
              </div>

              {/* Edges */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs items-center bg-slate-800/30 p-1.5 rounded">
                      <span className="text-slate-400 font-medium">Spread {game.spread > 0 ? `+${game.spread}` : game.spread}</span>
                      <span className={`font-mono font-bold ${spreadEdge ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {spreadEdge ? `${spreadEdge} ${spreadVal}%` : 'No Edge'}
                      </span>
                  </div>
                  <div className="flex justify-between text-xs items-center bg-slate-800/30 p-1.5 rounded">
                      <span className="text-slate-400 font-medium">Total {game.total}</span>
                      <span className={`font-mono font-bold ${totalEdge ? 'text-purple-400' : 'text-slate-500'}`}>
                          {totalEdge ? `${totalEdge} ${totalVal}%` : 'No Edge'}
                      </span>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
         <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Microscope className="text-emerald-400" /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">AI Dev Lab</span></h2>
             <p className="text-slate-400 text-sm mt-1">Monte Carlo Engine • Totals, Spreads & Player Props • {Object.keys(ratings || {}).length} Teams Loaded</p>
         </div>
         <div className="flex gap-3">
             <button onClick={handleRunSims} disabled={isRunning} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50">{isRunning ? <RefreshCw className="animate-spin" /> : <Play fill="currentColor" />}{isRunning ? "Running..." : "Run Simulation"}</button>
         </div>
      </div>
      
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-6 min-h-[60vh]">
         {Object.keys(simResults).length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full py-20 text-slate-700">
                 <Microscope size={64} className="opacity-20 mb-4" />
                 <p className="text-lg font-bold text-slate-600">Ready to Simulate</p>
                 <p className="text-sm">Data loaded successfully. Click 'Run Simulation' to start.</p>
             </div>
         ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {currentGames.map(game => <SimCard key={game.id} game={game} res={simResults[game.id]} />)}
             </div>
         )}
      </div>
    </div>
  );
}