// --- CONFIGURATION ---
export const APP_VERSION = "v2.0 (GitHub Live)";
export const CURRENT_WEEK = 17; 

// --- STORAGE KEYS ---
// We only need this one so your "My Card" saves to your browser
export const STORAGE_KEY_BETS = 'platinum_rose_bets_v17'; 

// --- EXPERTS ---
// Re-export from unified experts.js for backward compatibility
export { INITIAL_EXPERTS, EXPERTS, findExpert } from './experts.js';

// --- SCHEDULE ---
// This drives the Dashboard Grid
// --- SCHEDULE (2025 REAL WEEK 17) ---
// Times are ET. Spreads are illustrative based on current opening lines.
export const WEEK_17_SCHEDULE = [
  // CHRISTMAS DAY (Thu Dec 25)
  { id: 1, home: 'WAS', visitor: 'DAL', spread: 5.5, total: 48.5, time: 'Thu 1:00 PM' },
  { id: 2, home: 'MIN', visitor: 'DET', spread: 6.0, total: 51.0, time: 'Thu 4:30 PM' },
  { id: 3, home: 'KC', visitor: 'DEN', spread: 13.5, total: 43.5, time: 'Thu 8:15 PM' },

  // SATURDAY (Dec 27)
  { id: 4, home: 'LAC', visitor: 'HOU', spread: -1.5, total: 46.0, time: 'Sat 4:30 PM' },
  { id: 5, home: 'GB', visitor: 'BAL', spread: -2.5, total: 47.5, time: 'Sat 8:00 PM' },

  // SUNDAY (Dec 28)
  { id: 6, home: 'CAR', visitor: 'SEA', spread: 7.0, total: 41.5, time: 'Sun 1:00 PM' },
  { id: 7, home: 'CIN', visitor: 'ARI', spread: -7.0, total: 45.0, time: 'Sun 1:00 PM' },
  { id: 8, home: 'CLE', visitor: 'PIT', spread: 4.5, total: 39.5, time: 'Sun 1:00 PM' },
  { id: 9, home: 'IND', visitor: 'JAX', spread: 6.5, total: 44.0, time: 'Sun 1:00 PM' },
  { id: 10, home: 'MIA', visitor: 'TB', spread: 5.5, total: 46.5, time: 'Sun 1:00 PM' },
  { id: 11, home: 'NYJ', visitor: 'NE', spread: 12.5, total: 38.0, time: 'Sun 1:00 PM' },
  { id: 12, home: 'TEN', visitor: 'NO', spread: 2.5, total: 42.0, time: 'Sun 1:00 PM' },
  { id: 13, home: 'LV', visitor: 'NYG', spread: 1.5, total: 40.5, time: 'Sun 4:05 PM' },
  { id: 14, home: 'BUF', visitor: 'PHI', spread: -2.5, total: 49.0, time: 'Sun 4:25 PM' },
  { id: 15, home: 'SF', visitor: 'CHI', spread: -2.5, total: 45.5, time: 'Sun 8:20 PM' },

  // MONDAY (Dec 29)
  { id: 16, home: 'ATL', visitor: 'LAR', spread: -3.0, total: 48.0, time: 'Mon 8:15 PM' }
];

// Note: INITIAL_EXPERTS is now defined in experts.js and re-exported above