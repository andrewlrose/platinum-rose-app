// Test script to populate bankroll data for testing
import { addBet, updateBetResult, BET_TYPES, BET_STATUS } from '../src/lib/bankroll.js';

// Add some test bets
const testBets = [
  {
    game: 'Chiefs @ Bills',
    team: 'Chiefs',
    type: BET_TYPES.SPREAD,
    line: '-3.5',
    odds: -110,
    amount: 100,
    units: 1,
    confidence: 75,
    winProbability: 60,
    notes: 'Chiefs have good road record'
  },
  {
    game: 'Cowboys @ Eagles',
    team: 'Eagles', 
    type: BET_TYPES.TOTAL,
    line: 'o47.5',
    odds: -105,
    amount: 250,
    units: 2.5,
    confidence: 80,
    winProbability: 65,
    notes: 'Both offenses clicking'
  },
  {
    game: 'Ravens @ Steelers',
    team: 'Ravens',
    type: BET_TYPES.MONEYLINE,
    line: 'ML',
    odds: -140,
    amount: 140,
    units: 1.4,
    confidence: 85,
    winProbability: 70,
    notes: 'Ravens favored in rivalry game'
  }
];

console.log('Adding test bets...');
testBets.forEach(bet => {
  const betId = addBet(bet);
  console.log(`Added bet: ${betId}`);
});

console.log('Test bankroll data populated successfully!');