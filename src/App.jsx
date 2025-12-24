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
import PulseModal from './components/modals/PulseModal';
import ContestLinesModal from './components/modals/ContestLinesModal'; 
import AudioUploadModal from './components/modals/AudioUploadModal';
import ReviewPicksModal from './components/modals/ReviewPicksModal';
import BulkImportModal from './components/modals/BulkImportModal'; 
import ExpertManagerModal from './components/modals/ExpertManagerModal'; 

// --- TEAM ALIAS DICTIONARY ---
const TEAM_ALIASES = {
    "cardinals": "cardinals", "arizona": "cardinals", "cards": "cardinals",
    "falcons": "falcons", "atlanta": "falcons",
    "ravens": "ravens", "baltimore": "ravens",
    "bills": "bills", "buffalo": "bills",
    "panthers": "panthers", "carolina": "panthers",
    "bears": "bears", "chicago": "bears",
    "bengals": "bengals", "cincinnati": "bengals", "cincy": "bengals",
    "browns": "browns", "cleveland": "browns",
    "cowboys": "cowboys", "dallas": "cowboys",
    "broncos": "broncos", "denver": "broncos",
    "lions": "lions", "detroit": "lions",
    "packers": "packers", "green bay": "packers",
    "texans": "texans", "houston": "texans",
    "colts": "colts", "indianapolis": "colts", "indy": "colts",
    "jaguars": "jaguars", "jacksonville": "jaguars", "jags": "jaguars",
    "chiefs": "chiefs", "kansas city": "chiefs", "kc": "chiefs",
    "raiders": "raiders", "las vegas": "raiders", "vegas": "raiders",
    "chargers": "chargers", "los angeles chargers": "chargers", "la chargers": "chargers", "bolts": "chargers",
    "rams": "rams", "los angeles rams": "rams", "la rams": "rams",
    "dolphins": "dolphins", "miami": "dolphins", "fins": "dolphins",
    "vikings": "vikings", "minnesota": "vikings", "minny": "vikings",
    "patriots": "patriots", "new england": "patriots", "pats": "patriots",
    "saints": "saints", "new orleans": "saints",
    "giants": "giants", "ny giants": "giants", "new york giants": "giants", "gmen": "giants",
    "jets": "jets", "ny jets": "jets", "new york jets": "jets", "gang green": "jets",
    "eagles": "eagles", "philadelphia": "eagles", "philly": "eagles",
    "steelers": "steelers", "pittsburgh": "steelers",
    "49ers": "49ers", "san francisco": "49ers", "niners": "49ers", "sf": "49ers",
    "seahawks": "seahawks", "seattle": "seahawks",
    "buccaneers": "buccaneers", "tampa bay": "buccaneers", "tampa": "buccaneers", "bucs": "buccaneers",
    "titans": "titans", "tennessee": "titans",
    "commanders": "commanders", "washington": "commanders", "commies": "commanders"
};

function App() {
  const [stats, setStats] = useState([]);
  const [splits, setSplits] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedGame, setSelectedGame] = useState(null);
  
  // --- MODAL STATES ---
  const [showSplits, setShowSplits] = useState(false);
  const [showTeasers, setShowTeasers] = useState(false);
  const [showPulse, setShowPulse] = useState(false);     
  const [showContest, setShowContest] = useState(false); 
  const [showAudio, setShowAudio] = useState(false);     
  const [showReview, setShowReview] = useState(false);   
  const [showImport, setShowImport] = useState(false);   
  const [showExpertMgr, setShowExpertMgr] = useState(false); 

  const [myBets, setMyBets] = useState([]);
  const [simResults, setSimResults] = useState({});
  const [contestLines, setContestLines] = useState({}); 
  const [expertConsensus, setExpertConsensus] = useState({}); 
  const [stagedPicks, setStagedPicks] = useState([]); 

  // --- DATA FETCHING ---
  useEffect(() => {
    // 🔥 DIAGNOSTIC LOG: Print Schedule to Console
    console.log("--- SCHEDULE DIAGNOSTIC ---");
    console.log("Loaded Schedule:", WEEK_17_SCHEDULE);
    if (!WEEK_17_SCHEDULE || WEEK_17_SCHEDULE.length === 0) {
        alert("CRITICAL ERROR: WEEK_17_SCHEDULE is empty. Check lib/constants.js");
    } else {
        console.log("Sample Game 1:", WEEK_17_SCHEDULE[0]);
    }

    Promise.all([
        fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-data/main/weekly_stats.json").then(r => r.json()),
        fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-app/main/betting_splits.json").then(r => r.json()).catch(() => ({}))
    ]).then(([statsData, splitsData]) => {
        setStats(statsData);
        setSplits(splitsData || {});
        setLoading(false);
    }).catch(err => console.error("Error loading data:", err));
  }, []);

  const gamesWithSplits = WEEK_17_SCHEDULE.map(game => {
      const gameData = splits[game.id] || splits[String(game.id)];
      const expertData = expertConsensus[game.id] || { expertPicks: { spread: [], total: [] } };
      return {
          ...game,
          splits: gameData?.splits || null,
          contestSpread: contestLines[game.id] || null,
          consensus: expertData 
      };
  });

  // --- 🔥 BRUTE FORCE MATCHER ---
  const findGameForTeam = (rawInput) => {
      if (!rawInput) return null;
      const cleanInput = rawInput.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

      // 1. Alias Lookup
      let searchKey = cleanInput;
      for (const [alias, standard] of Object.entries(TEAM_ALIASES)) {
          if (cleanInput.includes(alias)) {
              searchKey = standard;
              break;
          }
      }

      // 2. Exact/Partial Match
      let match = WEEK_17_SCHEDULE.find(g => 
          g.home.toLowerCase().includes(searchKey) || 
          g.visitor.toLowerCase().includes(searchKey)
      );
      if (match) return match;

      // 3. Reverse Check (Does Schedule contain Input?)
      match = WEEK_17_SCHEDULE.find(g => 
          searchKey.includes(g.home.toLowerCase()) || 
          searchKey.includes(g.visitor.toLowerCase())
      );
      if (match) return match;

      // 4. Token Match (Word by Word) - "Last Resort"
      const tokens = searchKey.split(" ");
      match = WEEK_17_SCHEDULE.find(g => {
          return tokens.some(t => t.length > 3 && (g.home.toLowerCase().includes(t) || g.visitor.toLowerCase().includes(t)));
      });

      return match || null;
  };

  // --- AI LOGIC ---
  const handleAIAnalyze = async (text, sourceData) => {
    try {
        console.log("Analyzing text...");
        const prompt = `
        Analyze this transcript and extract NFL betting picks.
        Source: ${sourceData.name}
        
        Return a JSON OBJECT with a key named "picks" containing an array of objects.
        Each object in the array must have:
        - selection: (Team Name or 'Over'/'Under')
        - type: ('Spread', 'Total', or 'Prop')
        - line: (The number, e.g. -3.5 or 48.5. Use "0" if moneyline)
        - analysis: (Direct quote or summary of reasoning)
        - summary: (Short bullet point justifying the pick)
        - units: (1-5 confidence score, default 1)
        - team1: (Visitor Team Name - approximate match)
        - team2: (Home Team Name - approximate match)

        Transcript:
        ${text.substring(0, 15000)}
        `;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sourceData.apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a betting analyst JSON extractor. Always return a valid JSON object with a 'picks' key." }, 
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" } 
            })
        });

        const data = await response.json();
        if (data.error) { alert(`OpenAI Error: ${data.error.message}`); return; }

        const content = JSON.parse(data.choices[0].message.content);
        console.log("AI OUTPUT:", content);

        let picks = content.picks || content;
        if (!Array.isArray(picks)) picks = [picks];

        const processedPicks = picks.map(p => {
            const safeTeam1 = p.team1 || "";
            const safeTeam2 = p.team2 || "";
            const safeSel = p.selection || "";
            
            // Try to match
            const game = findGameForTeam(safeTeam1) || findGameForTeam(safeTeam2) || findGameForTeam(safeSel);
            
            // Log Failures
            if (!game) {
                console.warn(`FAILED TO MATCH: ${safeTeam1} / ${safeTeam2} / ${safeSel}`);
            }

            return {
                ...p,
                gameId: game ? game.id : null,
                expert: sourceData.name,
                rationale: p.summary,
                matchName: game ? `${game.visitor} @ ${game.home}` : "UNKNOWN GAME"
            };
        });

        if (processedPicks.length === 0) {
            alert("The AI returned 0 picks.");
        }

        setStagedPicks(processedPicks);
        setShowAudio(false);
        setShowReview(true); 

    } catch (error) {
        console.error("AI Error:", error);
        alert("Error parsing transcript.");
    }
  };

  // --- SAVE LOGIC (WITH DIAGNOSTICS) ---
  const handleConfirmPicks = () => {
      const newConsensus = { ...expertConsensus };
      let savedCount = 0;
      let skippedCount = 0;
      let failedMatches = [];

      stagedPicks.forEach(p => {
          if (!p.gameId) {
              skippedCount++;
              failedMatches.push(p.selection);
              return;
          }

          if (!newConsensus[p.gameId]) {
              newConsensus[p.gameId] = { expertPicks: { spread: [], total: [] } };
          }

          // DEEP COPY
          const updatedGameData = {
              ...newConsensus[p.gameId],
              expertPicks: {
                  ...newConsensus[p.gameId].expertPicks,
                  spread: [...newConsensus[p.gameId].expertPicks.spread],
                  total: [...newConsensus[p.gameId].expertPicks.total],
              }
          };

          const category = p.type === 'Total' ? 'total' : 'spread';
          updatedGameData.expertPicks[category].push({
              expert: p.expert, pick: p.selection, line: p.line, pickType: p.type,
              analysis: p.analysis, rationale: p.rationale, units: p.units
          });

          newConsensus[p.gameId] = updatedGameData;
          savedCount++;
      });

      setExpertConsensus(newConsensus);
      setShowReview(false);
      setStagedPicks([]);
      
      if (skippedCount > 0) {
          alert(`Saved ${savedCount} picks.\n\n⚠️ SKIPPED ${skippedCount} PICKS:\n${failedMatches.join("\n")}\n\nREASON: Could not match these teams to the Week 17 Schedule.\nCheck the browser console (F12) to see what Team Names the schedule is expecting.`);
      } else {
          alert(`Success! ${savedCount} picks added to the Board.`);
      }
  };

  // --- REST OF HANDLERS (Unchanged) ---
  const handleUpdatePick = (gameId, oldPick, newPickData) => {
      const newConsensus = { ...expertConsensus };
      const gamePicks = newConsensus[gameId].expertPicks;
      const category = oldPick.type === 'Total' ? 'total' : 'spread';
      const index = gamePicks[category].findIndex(p => p.expert === oldPick.expert && p.pick === oldPick.pick);
      if (index !== -1) {
          gamePicks[category][index] = { ...gamePicks[category][index], ...newPickData };
          setExpertConsensus(newConsensus);
      }
  };

  const handleDeletePick = (gameId, pickToDelete) => {
      if(!window.confirm("Delete this pick?")) return;
      const newConsensus = { ...expertConsensus };
      const category = pickToDelete.type === 'Total' ? 'total' : 'spread';
      newConsensus[gameId].expertPicks[category] = newConsensus[gameId].expertPicks[category].filter(p => 
          !(p.expert === pickToDelete.expert && p.pick === pickToDelete.pick)
      );
      setExpertConsensus(newConsensus);
  };

  const handleClearExpert = (expertName) => {
      const newConsensus = { ...expertConsensus };
      Object.keys(newConsensus).forEach(gameId => {
          newConsensus[gameId].expertPicks.spread = newConsensus[gameId].expertPicks.spread.filter(p => p.expert !== expertName);
          newConsensus[gameId].expertPicks.total = newConsensus[gameId].expertPicks.total.filter(p => p.expert !== expertName);
      });
      setExpertConsensus(newConsensus);
  };
  const handleBulkImport = (text) => { alert("Bulk Text received. Logic coming soon."); };
  const handleBet = (gameId, type, selection, line) => {
    const game = WEEK_17_SCHEDULE.find(g => g.id === gameId);
    setMyBets([{ id: Date.now(), game: `${game.visitor} @ ${game.home}`, gameId, selection, type, line, odds: -110, status: 'OPEN' }, ...myBets]);
    setSelectedGame(null);
  };
  const removeBet = (id) => setMyBets(myBets.filter(b => b.id !== id));
  const handleLockBets = (betIds) => setMyBets(prev => prev.map(bet => (betIds.includes(bet.id) ? { ...bet, status: 'PLACED' } : bet)));
  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-[#00d2be] font-mono">Loading Data Engine...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans pb-20 selection:bg-[#00d2be] selection:text-black">
      <Header 
        activeTab={activeTab} setActiveTab={setActiveTab} cartCount={myBets.length} 
        onSyncOdds={() => console.log("Sync")} onOpenSplits={() => setShowPulse(true)}     
        onOpenTeasers={() => setShowTeasers(true)} onOpenContest={() => setShowContest(true)}  
        onImport={() => setShowImport(true)} onAnalyze={() => setShowAudio(true)} onManage={() => setShowExpertMgr(true)} 
        onSave={() => alert("Save functionality coming soon")} onReset={() => { if(window.confirm("Reset all picks?")) setMyBets([]); }}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <div className="animate-in fade-in zoom-in duration-300"><Dashboard schedule={gamesWithSplits} stats={stats} simResults={simResults} onGameClick={setSelectedGame} /></div>}
        {activeTab === 'standings' && <Standings experts={INITIAL_EXPERTS} />}
        {activeTab === 'mycard' && <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300"><MyCardModal bets={myBets} onRemoveBet={removeBet} onLockBets={handleLockBets} onClearCard={() => setMyBets([])} /></div>}
        {activeTab === 'devlab' && <DevLab games={WEEK_17_SCHEDULE} stats={stats} savedResults={simResults} onSimComplete={setSimResults} />}
      </main>
      <MatchupWizardModal isOpen={!!selectedGame} game={selectedGame} stats={stats} currentWizardData={selectedGame ? (expertConsensus[selectedGame.id] || null) : null} onClose={() => setSelectedGame(null)} onBet={(id, type, sel, line) => { handleBet(id, type, sel, line); setSelectedGame(null); }} />
      <PulseModal isOpen={showPulse} onClose={() => setShowPulse(false)} games={gamesWithSplits} />
      <ContestLinesModal isOpen={showContest} onClose={() => setShowContest(false)} games={gamesWithSplits} onUpdateContestLines={setContestLines} />
      <WongTeaserModal isOpen={showTeasers} onClose={() => setShowTeasers(false)} games={gamesWithSplits} />
      <SplitsModal isOpen={showSplits} onClose={() => setShowSplits(false)} games={gamesWithSplits} />
      <AudioUploadModal isOpen={showAudio} onClose={() => setShowAudio(false)} onAnalyze={handleAIAnalyze} />
      <ReviewPicksModal isOpen={showReview} onClose={() => setShowReview(false)} stagedPicks={stagedPicks} onConfirm={handleConfirmPicks} onDiscard={(idx) => setStagedPicks(stagedPicks.filter((_, i) => i !== idx))} />
      <BulkImportModal isOpen={showImport} onClose={() => setShowImport(false)} onImport={handleBulkImport} />
      <ExpertManagerModal isOpen={showExpertMgr} onClose={() => setShowExpertMgr(false)} experts={INITIAL_EXPERTS} expertConsensus={expertConsensus} onUpdatePick={handleUpdatePick} onDeletePick={handleDeletePick} onClearExpert={handleClearExpert} />
    </div>
  );
}
export default App;