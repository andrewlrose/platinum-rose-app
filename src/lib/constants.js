// --- CONFIGURATION ---
export const APP_VERSION = "v2.0 (GitHub Live)";
export const CURRENT_WEEK = 17; 

// --- STORAGE KEYS ---
// We only need this one so your "My Card" saves to your browser
export const STORAGE_KEY_BETS = 'platinum_rose_bets_v17'; 

// --- SCHEDULE ---
// This drives the Dashboard Grid
export const WEEK_17_SCHEDULE = [
  { id: 1, home: 'CHI', visitor: 'SEA', spread: -2.5, total: 42.5, time: 'Thu 8:15 PM' },
  { id: 2, home: 'CIN', visitor: 'DEN', spread: -9.5, total: 43.5, time: 'Sat 1:00 PM' },
  { id: 3, home: 'BUF', visitor: 'NYJ', spread: -13.5, total: 44.5, time: 'Sun 1:00 PM' },
  { id: 4, home: 'CLE', visitor: 'MIA', spread: 3.5, total: 41.0, time: 'Sun 8:20 PM' },
  { id: 5, home: 'PHI', visitor: 'DAL', spread: -2.5, total: 48.0, time: 'Sun 4:25 PM' },
  { id: 6, home: 'NE', visitor: 'LAC', spread: -3.0, total: 40.5, time: 'Sun 1:00 PM' },
  { id: 7, home: 'NO', visitor: 'LV', spread: -5.5, total: 42.0, time: 'Sun 1:00 PM' },
  { id: 8, home: 'IND', visitor: 'TEN', spread: -4.0, total: 43.0, time: 'Sun 1:00 PM' },
  { id: 9, home: 'JAX', visitor: 'HOU', spread: 1.5, total: 45.0, time: 'Sun 1:00 PM' },
  { id: 10, home: 'LAR', visitor: 'ARI', spread: -6.5, total: 47.5, time: 'Sun 4:25 PM' },
  { id: 11, home: 'WAS', visitor: 'ATL', spread: -3.0, total: 46.0, time: 'Sun 1:00 PM' },
  { id: 12, home: 'TB', visitor: 'CAR', spread: -5.0, total: 41.5, time: 'Sun 1:00 PM' },
  { id: 13, home: 'MIN', visitor: 'GB', spread: 4.5, total: 45.5, time: 'Sun 8:20 PM' },
  { id: 14, home: 'SF', visitor: 'DET', spread: -4.5, total: 51.5, time: 'Mon 8:15 PM' },
  { id: 15, home: 'PIT', visitor: 'KC', spread: 3.5, total: 44.0, time: 'Wed 1:00 PM' },
  { id: 16, home: 'BAL', visitor: 'NYG', spread: -6.0, total: 43.0, time: 'Sun 1:00 PM' }
];

// --- EXPERTS LIBRARY ---
// Used for the Expert Tracker features
export const INITIAL_EXPERTS = [
  // --- 🎙️ SHOWS / SOURCES ---
  { id: 1, name: "Sharp or Square", source: "Sharp or Square", record: "0-0", lastWeek: "0-0" },
  { id: 2, name: "Even Money", source: "Even Money", record: "0-0", lastWeek: "0-0" },
  { id: 3, name: "Sunday Sixpack", source: "Sunday Sixpack", record: "0-0", lastWeek: "0-0" },
  { id: 4, name: "The Favorites", source: "The Favorites", record: "0-0", lastWeek: "0-0" },
  { id: 5, name: "Lock n Cash", source: "Lock n Cash", record: "0-0", lastWeek: "0-0" },
  { id: 6, name: "Betting Primer", source: "Betting Primer", record: "0-0", lastWeek: "0-0" },
  { id: 7, name: "Warren Sharp", source: "Warren Sharp", record: "0-0", lastWeek: "0-0" },
  { id: 8, name: "Walter Football", source: "Walter Football", record: "0-0", lastWeek: "0-0" },
  { id: 9, name: "Hitman", source: "Hitman", record: "0-0", lastWeek: "0-0" },
  { id: 10, name: "Tuley's Takes", source: "Tuley's Takes", record: "0-0", lastWeek: "0-0" },

  // --- 👤 SPECIFIC HOSTS ---
  { id: 11, name: "Chad Millman", source: "Sharp or Square", record: "0-0", lastWeek: "0-0" },
  { id: 12, name: "Simon Hunter", source: "Sharp or Square", record: "0-0", lastWeek: "0-0" },
  { id: 13, name: "Ross Tucker", source: "Even Money", record: "0-0", lastWeek: "0-0" },
  { id: 14, name: "Steve Fezzick", source: "Even Money", record: "0-0", lastWeek: "0-0" },
  { id: 15, name: "Chris Raybon", source: "Sunday Sixpack", record: "0-0", lastWeek: "0-0" },
  { id: 16, name: "Stuckey", source: "Sunday Sixpack", record: "0-0", lastWeek: "0-0" },
  { id: 17, name: "Chad Millman (Fav)", source: "The Favorites", record: "0-0", lastWeek: "0-0" },
  { id: 18, name: "Simon Hunter (Fav)", source: "The Favorites", record: "0-0", lastWeek: "0-0" },
  { id: 19, name: "Evan Abrams", source: "Betting Primer", record: "0-0", lastWeek: "0-0" },
  { id: 20, name: "Dave Tuley", source: "Tuley's Takes", record: "0-0", lastWeek: "0-0" },
  { id: 21, name: "Warren Sharp", source: "Warren Sharp", record: "0-0", lastWeek: "0-0" },
  { id: 22, name: "Walter Football", source: "Walter Football", record: "0-0", lastWeek: "0-0" },
  { id: 23, name: "Hitman", source: "Hitman", record: "0-0", lastWeek: "0-0" }
];