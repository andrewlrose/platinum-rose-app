// --- AI LOGIC ---
  const handleAIAnalyze = async (text, sourceData) => {
    try {
        console.log("Analyzing text...");
        
        // 1. Updated Prompt: Explicitly asks for an Object with a "picks" key
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
                response_format: { type: "json_object" } // This strictly enforces { ... }
            })
        });

        const data = await response.json();
        
        // Debugging: Check the console if it fails again
        if (data.error) {
            console.error("OpenAI API Error:", data.error);
            alert(`OpenAI Error: ${data.error.message}`);
            return;
        }

        const content = JSON.parse(data.choices[0].message.content);
        
        // Robustness: Handle if AI wraps it in 'picks' or returns raw object
        let picks = content.picks || content;
        if (!Array.isArray(picks)) picks = [picks];

        // 3. Robust Mapping (Prevents crashes on missing data)
        const processedPicks = picks.map(p => {
            const safeTeam1 = p.team1 || "";
            const safeTeam2 = p.team2 || "";
            const safeSel = p.selection || "";

            const game = WEEK_17_SCHEDULE.find(g => 
                (g.home.includes(safeTeam1) || g.visitor.includes(safeTeam1)) || 
                (g.home.includes(safeTeam2) || g.visitor.includes(safeTeam2)) ||
                (g.home.includes(safeSel) || g.visitor.includes(safeSel))
            );
            
            return {
                ...p,
                gameId: game ? game.id : null,
                expert: sourceData.name,
                rationale: p.summary
            };
        }).filter(p => p.gameId); // Only keep picks matched to a real game

        if (processedPicks.length === 0) {
            alert("Analysis complete, but no matching games were found. Check team names in the transcript.");
        }

        setStagedPicks(processedPicks);
        setShowAudio(false);
        setShowReview(true); // Open the review modal

    } catch (error) {
        console.error("AI Processing Error:", error);
        alert("Error parsing transcript. Please check the browser console for details.");
    }
  };