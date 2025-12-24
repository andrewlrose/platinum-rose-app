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
import ExpertManagerModal from './components/modals/ExpertManagerModal'; // 🔥 NEW

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
  const [showExpertMgr, setShowExpertMgr] = useState(false); // 🔥 NEW

  const [myBets, setMyBets] = useState([]);
  const [simResults, setSimResults] = useState({});
  const [contestLines, setContestLines] = useState({}); 
  const [expertConsensus, setExpertConsensus] = useState({}); 
  const [stagedPicks, setStagedPicks] = useState([]); 

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

  // --- AI LOGIC ---
  const handleAIAnalyze = async (text, sourceData) => {
    try {
        console.log("Analyzing text...");
        const prompt = `
        Analyze this transcript and extract NFL betting picks.
        Source: ${sourceData.name}
        Return JSON array: [{selection, type, line, analysis, summary, units, team1, team2}]
        Transcript: ${text.substring(0, 12000)}
        `;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sourceData.apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "system", content: "You are a betting analyst JSON extractor." }, { role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });
        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        let picks = content.picks || content;
        if (!Array.isArray(picks)) picks = [picks];

        const processedPicks = picks.map(p => {
            const game = WEEK_17_SCHEDULE.find(g => 
                (g.home.includes(p.team1) || g.visitor.includes(p.team1)) || 
                (g.home.includes(p.team2) || g.visitor.includes(p.team2)) ||
                (g.home.includes(p.selection) || g.visitor.includes(p.selection))
            );
            return { ...p, gameId: game ? game.id : null, expert: sourceData.name, rationale: p.summary };
        }).filter(p => p.gameId);

        setStagedPicks(processedPicks);
        setShowAudio(false);
        setShowReview(true);
    } catch (error) {
        console.error("AI Error:", error);
        alert("Error analyzing transcript. Check API Key.");
    }
  };

  const handleConfirmPicks = () => {
      const newConsensus = { ...expertConsensus };
      stagedPicks.forEach(p => {
          if (!newConsensus[p.gameId]) newConsensus[p.gameId] = { expertPicks: { spread: [], total: [] } };
          const category = p.type === 'Total' ? 'total' : 'spread';
          newConsensus[p.gameId].expertPicks[category].push({
              expert: p.expert, pick: p.selection, line: p.line, pickType: p.type,
              analysis: p.analysis, rationale: p.rationale, units: p.units
          });
      });
      setExpertConsensus(newConsensus);
      setShowReview(false);
      setStagedPicks([]);
      alert(`Success! ${stagedPicks.length} new picks added.`);
  };

  // --- EXPERT MANAGER LOGIC ---
  const handleUpdatePick = (gameId, oldPick, newPickData) => {
      const newConsensus = { ...expertConsensus };
      const gamePicks = newConsensus[gameId].expertPicks;
      const category = oldPick.type === 'Total' ? 'total' : 'spread';
      
      // Find and update
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

  const handleBulkImport = (text) => { alert("Bulk Text received. Parsing logic would go here."); };

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
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={myBets.length} 
        onSyncOdds={() => console.log("Sync")}
        onOpenSplits={() => setShowPulse(true)}     
        onOpenTeasers={() => setShowTeasers(true)}
        onOpenContest={() => setShowContest(true)}  
        
        onImport={() => setShowImport(true)} 
        onAnalyze={() => setShowAudio(true)} 
        
        // 🔥 RE-WIRED SAVE TO OPEN MANAGER FOR NOW (Or you can add a new button)
        onSave={() => setShowExpertMgr(true)} 
        onReset={() => { if(window.confirm("Reset all picks?")) setMyBets([]); }}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
            <div className="animate-in fade-in zoom-in duration-300">
                <Dashboard schedule={gamesWithSplits} stats={stats} simResults={simResults} onGameClick={setSelectedGame} />
            </div>
        )}
        {activeTab === 'standings' && <Standings experts={INITIAL_EXPERTS} />}
        {activeTab === 'mycard' && <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300"><MyCardModal bets={myBets} onRemoveBet={removeBet} onLockBets={handleLockBets} onClearCard={() => setMyBets([])} /></div>}
        {activeTab === 'devlab' && <DevLab games={WEEK_17_SCHEDULE} stats={stats} savedResults={simResults} onSimComplete={setSimResults} />}
      </main>

      {/* --- MODALS --- */}
      <MatchupWizardModal isOpen={!!selectedGame} game={selectedGame} stats={stats} currentWizardData={selectedGame ? (expertConsensus[selectedGame.id] || null) : null} onClose={() => setSelectedGame(null)} onBet={(id, type, sel, line) => { handleBet(id, type, sel, line); setSelectedGame(null); }} />
      <PulseModal isOpen={showPulse} onClose={() => setShowPulse(false)} games={gamesWithSplits} />
      <ContestLinesModal isOpen={showContest} onClose={() => setShowContest(false)} games={gamesWithSplits} onUpdateContestLines={setContestLines} />
      <WongTeaserModal isOpen={showTeasers} onClose={() => setShowTeasers(false)} games={gamesWithSplits} />
      <SplitsModal isOpen={showSplits} onClose={() => setShowSplits(false)} games={gamesWithSplits} />

      <AudioUploadModal isOpen={showAudio} onClose={() => setShowAudio(false)} onAnalyze={handleAIAnalyze} />
      <ReviewPicksModal isOpen={showReview} onClose={() => setShowReview(false)} stagedPicks={stagedPicks} onConfirm={handleConfirmPicks} onDiscard={(idx) => setStagedPicks(stagedPicks.filter((_, i) => i !== idx))} />
      <BulkImportModal isOpen={showImport} onClose={() => setShowImport(false)} onImport={handleBulkImport} />
      
      {/* 🔥 EXPERT MANAGER */}
      <ExpertManagerModal 
          isOpen={showExpertMgr} 
          onClose={() => setShowExpertMgr(false)}
          experts={INITIAL_EXPERTS}
          expertConsensus={expertConsensus}
          onUpdatePick={handleUpdatePick}
          onDeletePick={handleDeletePick}
          onClearExpert={handleClearExpert}
      />

    </div>
  );
}

export default App;