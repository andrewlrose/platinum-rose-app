// src/lib/draftKingsParser.js
// Uses unified team database from teams.js

import { normalizeDKName } from './teams.js';

export const parseDraftKingsDump = (text) => {
    if (!text) return [];
    
    const teamData = [];
    const lines = text.split('\n');

    // Use unified normalizer from teams.js
    const normalizeName = normalizeDKName;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Regex looks for: TeamName (optional spread) (Handle%) (Bets%)
        // Example: "Chiefs -4.5 76% 82%"
        const match = line.match(/^([A-Za-z\s\d]+?)\s+([-+]?[\d\.]+)?\s*(\d+)%\s+(\d+)%/);
        
        if (match) {
            const rawName = match[1].trim();
            const team = normalizeName(rawName);
            const money = parseInt(match[3]); // Handle %
            const ticket = parseInt(match[4]); // Bets %

            teamData.push({ team, money, ticket });
        }
    }

    return teamData;
};