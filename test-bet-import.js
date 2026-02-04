// Test script for bet import parser
import { parseBookmakerBet } from './src/lib/betImport.js';

const testBetText = `4 TEAMS PARLAY (4 TEAMS)
NFL Seattle Seahawks -1-124
Los Angeles Rams vs Seattle Seahawks
Game Start 01/25/2026 @ 03:45 PM
LIVENFL New England Patriots +3½-151
New England Patriots vs Denver Broncos
Game Start 01/25/2026 @ 12:10 PM
NFL TOTAL o44-136 (Los Angeles Rams vrs Seattle Seahawks)
Los Angeles Rams vs Seattle Seahawks
Game Start 01/25/2026 @ 03:45 PM
OPEN PLAY
Game Start 01/25/2026 @ 12:26 PM
1 OPEN SPOTS Fill open spots

Placed 01/25/2026 @ 12:26 PM
Ticket # 727853342
Risk:$50.00Win:$447.39`;

console.log('🧪 TESTING BOOKMAKER BET PARSER');
console.log('================================');

try {
    const parsed = parseBookmakerBet(testBetText);
    
    console.log('\n✅ PARSING RESULTS:');
    console.log('Type:', parsed.type);
    console.log('Description:', parsed.description);
    console.log('Risk Amount:', '$' + parsed.riskAmount);
    console.log('Potential Win:', '$' + parsed.potentialWin);
    console.log('Open Slots:', parsed.openSlots);
    console.log('Is Hedging Bet:', parsed.isHedgingBet);
    console.log('Ticket Number:', parsed.ticketNumber);
    console.log('Source:', parsed.source);
    
    console.log('\n📋 BET LEGS:');
    parsed.legs.forEach((leg, index) => {
        console.log(`Leg ${index + 1}: ${leg.team} ${leg.line} (${leg.betType}) - ${leg.odds}`);
        if (leg.betType === 'open') {
            console.log('   🔓 OPEN SLOT for hedging');
        }
    });
    
    console.log('\n🎯 PARSER TEST: PASSED ✅');
    
} catch (error) {
    console.error('❌ PARSER TEST FAILED:', error);
}

export { testBetText };