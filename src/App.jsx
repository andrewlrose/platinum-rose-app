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
// 🔥 NEW IMPORTS
import AudioUploadModal from './components/modals/AudioUploadModal';
import ReviewPicksModal from './components/modals/ReviewPicksModal';

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
  const [showAudio, setShowAudio] = useState(false);     // 🔥 NEW: Audio Modal
  const [showReview, setShowReview] = useState(false);   // 🔥 NEW: Review Modal

  const [myBets, setMyBets] = useState([]);
  const [simResults, setSimResults] = useState({});
  const [contestLines, setContestLines] = useState({}); 
  
  // 🔥 DATA: AI Picks Storage
  // Stores picks by gameID: { "game_id": { spread: [], total: [] } }
  const [expertConsensus, setExpertConsensus] = useState({}); 
  const [stagedPicks, setStagedPicks] = useState([]); // Temporary holding for AI review

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

  // --- MERGE ALL DATA INTO SCHEDULE ---
  const gamesWithSplits = WEEK_17_SCHEDULE.map(game => {
      const gameData = splits[game.id] || splits[String(game.id)];
      const expertData = expertConsensus[game.id] || { expertPicks: { spread: [], total: [] } }; // 🔥 Merge Expert Data

      return {
          ...game,
          splits: gameData?.splits || null,
          contestSpread: contestLines[game.id] || null,
          consensus: expertData // Pass this down to the card
      };
  });

  // --- OPENAI LOGIC ---
  const handleAIAnalyze = async (text, sourceData) => {
    try {
        console.log("Analyzing text...");
        // 1. Construct Prompt
        const prompt = `
        Analyze this transcript and extract NFL betting picks.
        Source: ${sourceData.name}
        
        Return a JSON array of objects with these fields:
        - selection: (Team Name or 'Over'/'Under')
        - type: ('Spread', 'Total', or 'Prop')
        - line: (The number, e.g. -3.5 or 48.5. Use 0 if moneyline)
        - analysis: (A direct quote or summary of their reasoning)
        - summary: (An array of 2-3 short bullet points justifying the pick)
        - units: (1-5 confidence score, default 1)
        - team1: (Visitor Team Name)
        - team2: (Home Team Name)

        Transcript:
        ${text.substring(0, 12000)}
        `;

        // 2. Call OpenAI
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sourceData.apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // Or gpt-3.5-turbo if you want cheaper
                messages: [{ role: "system", content: "You are a betting analyst JSON extractor." }, { role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        let picks = content.picks || content; // Handle if GPT wraps it in a 'picks' key
        if (!Array.isArray(picks)) picks = [picks];

        // 3. Match picks to Schedule
        const processedPicks = picks.map(p => {
            // Simple fuzzy match logic (In a real app, use a better team matcher)
            const game = WEEK_17_SCHEDULE.find(g => 
                (g.home.includes(p.team1) || g.visitor.includes(p.team1)) || 
                (g.home.includes(p.team2) || g.visitor.includes(p.team2)) ||
                (g.home.includes(p.selection) || g.visitor.includes(p.selection))
            );
            
            return {
                ...p,
                gameId: game ? game.id : null, // If null, user might need to manually map later
                expert: sourceData.name,
                rationale: p.summary // Map 'summary' to 'rationale' for WizardModal
            };
        }).filter(p => p.gameId); // Only keep picks we matched to a game

        setStagedPicks(processedPicks);
        setShowAudio(false);
        setShowReview(true); // Open Review Modal

    } catch (error) {
        console.error("AI Error:", error);
        alert("Error analyzing transcript. Check API Key and try again.");
    }
  };

  // --- SAVE CONFIRMED PICKS ---
  const handleConfirmPicks = () => {
      const newConsensus = { ...expertConsensus };

      stagedPicks.forEach(p => {
          if (!newConsensus[p.gameId]) {
              newConsensus[p.gameId] = { expertPicks: { spread: [], total: [] } };
          }
          const category = p.type === 'Total' ? 'total' : 'spread';
          
          // Add to the list
          newConsensus[p.gameId].expertPicks[category].push({
              expert: p.expert,
              pick: p.selection,
              line: p.line,
              pickType: p.type,
              analysis: p.analysis,
              rationale: p.rationale,
              units: p.units
          });
      });

      setExpertConsensus(newConsensus);
      setShowReview(false);
      setStagedPicks([]);
      alert(`Success! ${stagedPicks.length} new picks added to the Board.`);
  };

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
        
        // --- BUTTONS ---
        onOpenSplits={() => setShowPulse(true)}     
        onOpenTeasers={() => setShowTeasers(true)}
        onOpenContest={() => setShowContest(true)}  
        
        // --- DATA BUTTONS ---
        onLoad={() => setShowAudio(true)} // 🔥 Microphone button now triggers Audio Modal
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
      {/* 1. MATCHUP WIZARD (Passes the CONSENSUS data from expertConsensus) */}
      <MatchupWizardModal 
         isOpen={!!selectedGame} 
         game={selectedGame} 
         stats={stats} 
         // 🔥 CRITICAL: We pass the accumulated expert picks to the wizard here
         currentWizardData={selectedGame ? (expertConsensus[selectedGame.id] || null) : null}
         onClose={() => setSelectedGame(null)} 
         onBet={(id, type, sel, line) => { handleBet(id, type, sel, line); setSelectedGame(null); }} 
      />
      
      <PulseModal isOpen={showPulse} onClose={() => setShowPulse(false)} games={gamesWithSplits} />
      <ContestLinesModal isOpen={showContest} onClose={() => setShowContest(false)} games={gamesWithSplits} onUpdateContestLines={setContestLines} />
      <WongTeaserModal isOpen={showTeasers} onClose={() => setShowTeasers(false)} games={gamesWithSplits} />
      <SplitsModal isOpen={showSplits} onClose={() => setShowSplits(false)} games={gamesWithSplits} />

      {/* 🔥 NEW AI MODALS */}
      <AudioUploadModal 
         isOpen={showAudio} 
         onClose={() => setShowAudio(false)} 
         onAnalyze={handleAIAnalyze} 
      />
      
      <ReviewPicksModal 
         isOpen={showReview} 
         onClose={() => setShowReview(false)} 
         stagedPicks={stagedPicks}
         onConfirm={handleConfirmPicks}
         onDiscard={(idx) => setStagedPicks(stagedPicks.filter((_, i) => i !== idx))}
      />

    </div>
  );
}

export default App;