import React, { useState, useRef } from 'react';
import { Microscope, Play, RefreshCw, Database, Save, UploadCloud, FileText, Upload, Globe, AlertCircle, CalendarDays } from 'lucide-react'; 

// --- 1. REUSED LOGOS ---
const TEAM_LOGOS = { "Cardinals": "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png", "Falcons": "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png", "Ravens": "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png", "Bills": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png", "Panthers": "https://a.espncdn.com/i/teamlogos/nfl/500/car.png", "Bears": "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png", "Bengals": "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png", "Browns": "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png", "Cowboys": "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png", "Broncos": "https://a.espncdn.com/i/teamlogos/nfl/500/den.png", "Lions": "https://a.espncdn.com/i/teamlogos/nfl/500/det.png", "Packers": "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png", "Texans": "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png", "Colts": "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png", "Jaguars": "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png", "Chiefs": "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png", "Raiders": "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png", "Chargers": "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png", "Rams": "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png", "Dolphins": "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png", "Vikings": "https://a.espncdn.com/i/teamlogos/nfl/500/min.png", "Patriots": "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png", "Saints": "https://a.espncdn.com/i/teamlogos/nfl/500/no.png", "Giants": "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png", "Jets": "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png", "Eagles": "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png", "Steelers": "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png", "49ers": "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png", "Seahawks": "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", "Buccaneers": "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png", "Titans": "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png", "Commanders": "https://a.espncdn.com/i/teamlogos/nfl/500/was.png" };

// --- 2. REUSED HELPER ---
const groupGamesByWeek = (gamesList) => {
    if (!gamesList || gamesList.length === 0) return { current: [], future: [] };
    // We treat all scheduled games as 'current' for this dashboard view
    const sorted = [...gamesList].sort((a, b) => a.id - b.id);
    return { current: sorted, future: [] };
};

export default function DevLab({ games, onSimComplete, savedResults }) {
  const [isRunning, setIsRunning] = useState(false);
  const [simResults, setSimResults] = useState(savedResults || {});
  const [showImport, setShowImport] = useState(false);
  const [importMode, setImportMode] = useState('csv'); 
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  
  // Placeholders for manual import (disabled for now)
  const [offCsvText, setOffCsvText] = useState('');
  const [defCsvText, setDefCsvText] = useState('');
  const [simpleText, setSimpleText] = useState('');
  const offFileRef = useRef(null);
  const defFileRef = useRef(null);

  const [ratings, setRatings] = useState(() => {
      const saved = localStorage.getItem('platinum_rose_ratings');
      return saved ? JSON.parse(saved) : null;
  });

  const { current: currentGames } = groupGamesByWeek(games);

  // --- 3. REUSED AUTO-FETCHER (The Brains) ---
  const handleAutoFetch = async () => {
      setIsFetching(true); setFetchError(null);
      try {
          const targetUrl = 'https://github.com/nflverse/nflverse-data/releases/download/team_stats/stats_team_season.csv';
          const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(targetUrl);
          const response = await fetch(proxyUrl);
          if (!response.ok) throw new Error("Network response blocked. Try manual upload.");
          const text = await response.text();
          
          // Parse CSV Logic (Inlined from your old component)
          const lines = text.split('\n');
          const newRatings = {};
          const header = lines[0].split(',');
          
          const idxSeason = header.findIndex(h => h.includes('season'));
          const idxTeam = header.findIndex(h => h.includes('team'));
          const idxOff = header.findIndex(h => h.includes('offense_epa'));
          const idxDef = header.findIndex(h => h.includes('defense_epa'));
          const idxOffPass = header.findIndex(h => h === 'offense_pass_epa' || h.includes('pass_epa'));
          const idxOffRush = header.findIndex(h => h === 'offense_rush_epa' || h.includes('rush_epa'));
          const idxDefPass = header.findIndex(h => h === 'defense_pass_epa');
          const idxDefRush = header.findIndex(h => h === 'defense_rush_epa');

          let maxSeason = 0;
          lines.forEach((l, i) => { if(i!==0) { const c = l.split(','); if(c[idxSeason]) { const s = parseInt(c[idxSeason]); if(s > maxSeason) maxSeason = s; } } });
          
          lines.forEach((l, i) => { 
              if(i!==0) { 
                  const c = l.split(','); 
                  if(c.length < 5) return; 
                  const s = parseInt(c[idxSeason]); 
                  if(s === maxSeason) { 
                      const team = c[idxTeam].replace(/"/g, '').toLowerCase(); 
                      const off = parseFloat(c[idxOff]); 
                      const def = parseFloat(c[idxDef]);
                      const offPass = idxOffPass > -1 ? parseFloat(c[idxOffPass]) : off;
                      const offRush = idxOffRush > -1 ? parseFloat(c[idxOffRush]) : off;
                      const defPass = idxDefPass > -1 ? parseFloat(c[idxDefPass]) : def;
                      const defRush = idxDefRush > -1 ? parseFloat(c[idxDefRush]) : def;

                      if(team && !isNaN(off)) {
                          newRatings[team] = { off, def, offPass, offRush, defPass, defRush, tempo: 1.0 }; 
                      }
                  } 
              } 
          });
          setRatings(newRatings);
          localStorage.setItem('platinum_rose_ratings', JSON.stringify(newRatings));
          alert(`✅ Auto-fetched ${maxSeason} EPA (Splits Included) for ${Object.keys(newRatings).length} teams!`);
          setShowImport(false);
      } catch (err) { setFetchError(err.message); } finally { setIsFetching(false); }
  };

  const handleSaveData = () => {
      // Stubbed until we migrate lib/simulation.js
      alert("Please use 'Auto-Fetch EPA' for now. Manual import coming in next update.");
  };

  // --- 4. REUSED MONTE CARLO ENGINE ---
  const handleRunSims = () => {
      if (!ratings || Object.keys(ratings).length === 0) {
          alert("⚠️ No Data Loaded! Click 'Load Data' -> 'Auto-Fetch EPA'.");
          setShowImport(true);
          return;
      }

      setIsRunning(true);
      setTimeout(() => {
          const results = {};
          games.forEach(game => {
              const homeKey = game.home.toLowerCase().split(' ').pop();
              const visKey = game.visitor.toLowerCase().split(' ').pop();
              
              const normalize = (n) => n.toLowerCase().replace(/[^a-z]/g, '');
              const hR = ratings && Object.keys(ratings).find(k => normalize(k).includes(normalize(homeKey)) || normalize(game.home).includes(normalize(k)));
              const vR = ratings && Object.keys(ratings).find(k => normalize(k).includes(normalize(visKey)) || normalize(game.visitor).includes(normalize(k)));
              
              if (hR && vR) {
                  const homeRating = ratings[hR];
                  const visRating = ratings[vR];
                  const multiplier = 35; 
                  const homeProj = 21.5 + (homeRating.off * multiplier) + (visRating.def * multiplier) + 1.5; 
                  const visProj = 21.5 + (visRating.off * multiplier) + (homeRating.def * multiplier);
                  const hPassProj = 230 + ((homeRating.offPass || homeRating.off) * 120) + ((visRating.defPass || visRating.def) * 120);
                  const hRushProj = 115 + ((homeRating.offRush || homeRating.off) * 80) + ((visRating.defRush || visRating.def) * 80);
                  const vPassProj = 230 + ((visRating.offPass || visRating.off) * 120) + ((homeRating.defPass || homeRating.def) * 120);
                  const vRushProj = 115 + ((visRating.offRush || visRating.off) * 80) + ((homeRating.defRush || homeRating.def) * 80);

                  let homeWins = 0, homeCovers = 0, overs = 0;
                  const iterations = 5000;
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
                      stats: {
                          home: { pass: hPassProj.toFixed(0), rush: hRushProj.toFixed(0) },
                          visitor: { pass: vPassProj.toFixed(0), rush: vRushProj.toFixed(0) }
                      },
                      hasData: true
                  };
              } else {
                  results[game.id] = { hasData: false };
              }
          });
          setSimResults(results);
          if (onSimComplete) onSimComplete(results); 
          setIsRunning(false);
      }, 800);
  };

  const SimCard = ({ game, res }) => {
      if (!res) return null;
      if (!res.hasData) return (<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex flex-col items-center justify-center opacity-70"><div className="text-slate-500 font-bold mb-1">{game.visitor} @ {game.home}</div><div className="text-[10px] text-rose-400">Data Missing</div></div>);

      const spreadEdge = parseFloat(res.homeCoverPct) >= 53.0 ? game.home : parseFloat(res.visCoverPct) >= 53.0 ? game.visitor : null;
      const spreadVal = spreadEdge === game.home ? res.homeCoverPct : res.visCoverPct;
      const totalEdge = parseFloat(res.overPct) >= 53.0 ? 'OVER' : parseFloat(res.underPct) >= 53.0 ? 'UNDER' : null;
      const totalVal = totalEdge === 'OVER' ? res.overPct : res.underPct;

      return (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-sm hover:border-emerald-500/50 transition-colors relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Projection</span>
                  {spreadEdge && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">EDGE</span>}
              </div>
              <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-col items-center gap-1 w-1/3">
                      <div className="w-10 h-10 bg-slate-700/50 rounded-full p-1.5 flex items-center justify-center">
                          {TEAM_LOGOS[game.visitor] ? <img src={TEAM_LOGOS[game.visitor]} alt={game.visitor} className="w-full h-full object-contain" /> : <span className="text-xs font-bold">{game.visitor.substring(0,2)}</span>}
                      </div>
                      <div className="text-xs font-bold text-white text-center leading-tight">{game.visitor}</div>
                      <div className="text-sm font-mono text-emerald-300 font-bold">{res.projVis}</div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-1/3">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Proj Total</div>
                      <div className="text-lg font-black text-white">{res.projTotal}</div>
                      <div className="text-[9px] text-slate-500">Line: {game.total}</div>
                  </div>
                  <div className="flex flex-col items-center gap-1 w-1/3">
                      <div className="w-10 h-10 bg-slate-700/50 rounded-full p-1.5 flex items-center justify-center">
                          {TEAM_LOGOS[game.home] ? <img src={TEAM_LOGOS[game.home]} alt={game.home} className="w-full h-full object-contain" /> : <span className="text-xs font-bold">{game.home.substring(0,2)}</span>}
                      </div>
                      <div className="text-xs font-bold text-white text-center leading-tight">{game.home}</div>
                      <div className="text-sm font-mono text-emerald-300 font-bold">{res.projHome}</div>
                  </div>
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-700/50">
                  <div className="flex justify-between text-xs items-center">
                      <span className="text-slate-500">Spread {game.spread > 0 ? `+${game.spread}` : game.spread}</span>
                      <span className={`font-mono font-bold ${spreadEdge ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {spreadEdge ? `${spreadEdge} ${spreadVal}%` : 'No Edge'}
                      </span>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                      <span className="text-slate-500">Total {game.total}</span>
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
             <button onClick={() => setShowImport(!showImport)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-lg font-bold flex items-center gap-2 border border-slate-700 transition-all"><Database size={18} /> {ratings ? 'Update Data' : 'Load Data'}</button>
             <button onClick={handleRunSims} disabled={isRunning} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50">{isRunning ? <RefreshCw className="animate-spin" /> : <Play fill="currentColor" />}{isRunning ? "Running..." : "Simulate"}</button>
         </div>
      </div>
      {showImport && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                  <div className="flex gap-4">
                      <button onClick={handleAutoFetch} disabled={isFetching} className={`text-sm font-bold flex items-center gap-2 pb-2 border-b-2 transition-colors border-emerald-400 text-indigo-400 hover:text-white`}>{isFetching ? <RefreshCw size={16} className="animate-spin"/> : <Globe size={16} />} {isFetching ? "Fetching..." : "Auto-Fetch EPA (Start Here)"}</button>
                  </div>
                  <button onClick={() => setShowImport(false)} className="text-slate-400 hover:text-white text-xs font-bold">CLOSE</button>
              </div>
              {fetchError && <div className="mb-4 bg-rose-900/30 border border-rose-500/50 p-3 rounded flex items-start gap-3"><AlertCircle className="text-rose-400 shrink-0" size={18} /><div className="text-xs text-rose-200"><p className="font-bold">Auto-Fetch Failed</p><p>{fetchError}</p></div></div>}
          </div>
      )}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[60vh]">
         {Object.keys(simResults).length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full py-20 text-slate-600">
                 <Microscope size={64} className="opacity-20 mb-4" />
                 <p className="text-lg">Ready to Simulate</p>
                 <p className="text-sm">Click 'Load Data' -> 'Auto-Fetch' then 'Simulate'.</p>
             </div>
         ) : (
             <div className="flex flex-col gap-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {currentGames.map(game => <SimCard key={game.id} game={game} res={simResults[game.id]} />)}
                 </div>
             </div>
         )}
      </div>
    </div>
  );
}