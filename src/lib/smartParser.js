// src/lib/smartParser.js
// Uses unified team database from teams.js

import { TEAM_MAP } from './teams.js';

const SYSTEM_PROMPT = `
You are an expert sports betting analyst AI. Your job is to read a transcript of a betting podcast and extract every explicit wager made by the hosts.

OUTPUT FORMAT:
You must return a valid JSON array of objects. Do not include markdown formatting.

SCHEMA:
[
  {
    "expert": "Name (e.g. Ross Tucker)",
    "team": "Team Name (e.g. Patriots)",
    "market": "Spread, Total, or Teaser",
    "line": "The number (e.g. +7.5)",
    "type": "Standard, Teaser, or Parlay",
    "units": "Number",
    "selection": "The side (e.g. Patriots, Over)",
    "analysis": "1-sentence summary.",
    "rationale": ["Bullet 1", "Bullet 2"]
  }
]
`;

export const processTranscripts = async (files, onProgress, apiKey = null) => {
    onProgress("⚙️ Initializing Smart Parser...");
    let fullText = Array.isArray(files) ? files.join("\n") : files;

    // --- MODE A: API KEY PROVIDED ---
    if (apiKey) {
        try {
            onProgress("🧠 Connecting to OpenAI...");
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: `Transcript:\n\n${fullText.substring(0, 50000)}` } 
                    ],
                    temperature: 0.1
                })
            });

            if (!response.ok) throw new Error("OpenAI API Error");

            const data = await response.json();
            const cleanJson = data.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
            const rawPicks = JSON.parse(cleanJson);
            
            return { source: "OpenAI GPT-4o", picks: rawPicks };

        } catch (e) {
            console.error("API Failed", e);
            onProgress(`⚠️ API Failed: ${e.message}. Switching to Local Parser...`);
        }
    }

    // --- MODE B: LOCAL REGEX (Fallback for Lists) ---
    onProgress("📝 Running Local List Parser...");
    const picks = [];
    const lines = fullText.split(/\n/);
    let currentExpert = "Consensus"; 

    lines.forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine) return;

        // Header Detection
        if (cleanLine.toUpperCase().includes("ROSS TUCKER")) currentExpert = "Ross Tucker";
        if (cleanLine.toUpperCase().includes("STEVE FEZZIK")) currentExpert = "Steve Fezzik";

        // List Detection (1. NE +7.5)
        const summaryMatch = cleanLine.match(/(?:^\d+\.\s*|^)([A-Z]{2,3}|[A-Z][a-z]+)\s+([+-]?\d+\.?\d*)/);
        
        if (summaryMatch) {
            const teamRaw = summaryMatch[1].toLowerCase();
            const number = summaryMatch[2];
            
            if (TEAM_MAP[teamRaw]) {
                const teamName = TEAM_MAP[teamRaw];
                let units = 1;
                if (cleanLine.includes("2U") || cleanLine.includes("2 units") || cleanLine.includes("(2U)")) units = 2;
                
                picks.push({
                    team: teamName,
                    selection: teamName,
                    market: "Spread",
                    line: number,
                    type: cleanLine.toLowerCase().includes("teaser") ? "Teaser" : "Standard",
                    units: units,
                    expert: currentExpert,
                    analysis: cleanLine,
                    rationale: ["Extracted from summary list"]
                });
            }
        }

        // Total Detection (OVER NYJ-JAX)
        const totalMatch = cleanLine.match(/(OVER|UNDER)\s+([A-Z]{2,3})[-–]([A-Z]{2,3})/i);
        if (totalMatch) {
            const side = totalMatch[1].toUpperCase() === "OVER" ? "Over" : "Under";
            const team1Raw = totalMatch[2].toLowerCase();
            const team2Raw = totalMatch[3].toLowerCase();
            const anchorTeam = TEAM_MAP[team1Raw] || TEAM_MAP[team2Raw];
            
            if (anchorTeam) {
                 let units = cleanLine.includes("2U") ? 2 : 1;
                 picks.push({
                     team: anchorTeam,
                     selection: side,
                     market: "Total",
                     line: "Total",
                     type: "Standard",
                     expert: currentExpert,
                     units: units,
                     analysis: cleanLine,
                     rationale: ["Extracted Total"]
                 });
            }
        }
    });

    onProgress(`✅ Found ${picks.length} plays via Local Parser.`);
    
    // CRITICAL FIX: Ensure we return the object structure App.jsx expects!
    return {
        source: "Local Regex Engine",
        picks: picks
    };
};