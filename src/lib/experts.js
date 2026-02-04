// src/lib/experts.js
// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED NFL EXPERTS DATABASE - Single Source of Truth
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Expert/Show Database
 * Each expert has:
 * - id: unique identifier
 * - name: display name
 * - source: the show/podcast they appear on
 * - aliases: array of lowercase variations for matching
 * - record/lastWeek: tracking fields
 */
export const EXPERTS = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SHOWS / SOURCES (id 1-10)
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: 1, 
    name: "Sharp or Square", 
    source: "Sharp or Square", 
    aliases: ["sharp or square", "sharpsquare", "sos"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 2, 
    name: "Even Money", 
    source: "Even Money", 
    aliases: ["even money", "evenmoney"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 3, 
    name: "Sunday Sixpack", 
    source: "Sunday Sixpack", 
    aliases: ["sunday sixpack", "sixpack", "6pack"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 4, 
    name: "The Favorites", 
    source: "The Favorites", 
    aliases: ["the favorites", "favorites"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 5, 
    name: "Lock n Cash", 
    source: "Lock n Cash", 
    aliases: ["lock n cash", "lockncash", "lock and cash"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 6, 
    name: "Betting Primer", 
    source: "Betting Primer", 
    aliases: ["betting primer", "primer"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 7, 
    name: "Warren Sharp", 
    source: "Warren Sharp", 
    aliases: ["warren sharp", "sharp", "sharp football"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 8, 
    name: "Walter Football", 
    source: "Walter Football", 
    aliases: ["walter football", "walterfootball", "walter"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 9, 
    name: "Hitman", 
    source: "Hitman", 
    aliases: ["hitman", "hit man"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 10, 
    name: "Tuley's Takes", 
    source: "Tuley's Takes", 
    aliases: ["tuley's takes", "tuleys takes", "tuley takes"],
    isShow: true,
    record: "0-0", 
    lastWeek: "0-0" 
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPECIFIC HOSTS (id 11+)
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: 11, 
    name: "Chad Millman", 
    source: "Sharp or Square", 
    aliases: ["chad millman", "millman", "chad"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 12, 
    name: "Simon Hunter", 
    source: "Sharp or Square", 
    aliases: ["simon hunter", "hunter", "simon"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 13, 
    name: "Ross Tucker", 
    source: "Even Money", 
    aliases: ["ross tucker", "tucker", "ross"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 14, 
    name: "Steve Fezzik", 
    source: "Even Money", 
    // Common misspellings included
    aliases: ["steve fezzik", "fezzik", "fezzick", "fezik", "fezick", "bezic", "bessic"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 15, 
    name: "Chris Raybon", 
    source: "Sunday Sixpack", 
    // Common misspellings included
    aliases: ["chris raybon", "raybon", "rayburn", "rabon"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 16, 
    name: "Stuckey", 
    source: "Sunday Sixpack", 
    // Common misspellings included
    aliases: ["stuckey", "stucky", "stuckie", "stuck"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 17, 
    name: "Chad Millman", 
    source: "The Favorites", 
    aliases: ["chad millman fav", "chad favorites"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 18, 
    name: "Simon Hunter", 
    source: "The Favorites", 
    aliases: ["simon hunter fav", "simon favorites"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 19, 
    name: "Evan Abrams", 
    source: "Betting Primer", 
    aliases: ["evan abrams", "abrams", "evan"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 20, 
    name: "Dave Tuley", 
    source: "Tuley's Takes", 
    aliases: ["dave tuley", "tuley", "david tuley"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 21, 
    name: "Warren Sharp", 
    source: "Sharp Football", 
    aliases: ["warren sharp host", "sharp analyst"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 22, 
    name: "Walter Football", 
    source: "Walter Football", 
    aliases: ["walter host"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  },
  { 
    id: 23, 
    name: "Hitman", 
    source: "Hitman", 
    aliases: ["hitman host"],
    isShow: false,
    record: "0-0", 
    lastWeek: "0-0" 
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRECOMPUTED LOOKUPS
// ═══════════════════════════════════════════════════════════════════════════════

// Build alias → expert lookup
const _expertAliasLookup = {};
EXPERTS.forEach(expert => {
  expert.aliases.forEach(alias => {
    // Store array since multiple experts might have same alias (prioritize non-show)
    if (!_expertAliasLookup[alias]) {
      _expertAliasLookup[alias] = [];
    }
    _expertAliasLookup[alias].push(expert);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Find an expert by any name variation (handles misspellings)
 * @param {string} rawName - Raw expert name from transcript/import
 * @param {object} options - { preferShow: boolean, sourceHint: string }
 * @returns {object|null} - Expert object or null
 */
export function findExpert(rawName, options = {}) {
  if (!rawName) return null;
  
  const { preferShow = false, sourceHint = null } = options;
  const clean = String(rawName).toLowerCase().trim();
  
  // 1. Direct alias lookup
  if (_expertAliasLookup[clean]) {
    const matches = _expertAliasLookup[clean];
    
    // If sourceHint provided, try to match by source
    if (sourceHint) {
      const sourceMatch = matches.find(e => 
        e.source.toLowerCase().includes(sourceHint.toLowerCase())
      );
      if (sourceMatch) return sourceMatch;
    }
    
    // Prefer individual hosts over shows unless specified
    if (preferShow) {
      return matches.find(e => e.isShow) || matches[0];
    }
    return matches.find(e => !e.isShow) || matches[0];
  }
  
  // 2. Partial match (for compound names like "Ross from Even Money")
  for (const [alias, experts] of Object.entries(_expertAliasLookup)) {
    if (clean.includes(alias) || alias.includes(clean)) {
      if (preferShow) {
        return experts.find(e => e.isShow) || experts[0];
      }
      return experts.find(e => !e.isShow) || experts[0];
    }
  }
  
  // 3. First name match (e.g. "Ross" → "Ross Tucker")
  const firstName = clean.split(' ')[0];
  if (firstName.length >= 3) {
    for (const expert of EXPERTS) {
      if (expert.name.toLowerCase().startsWith(firstName)) {
        return expert;
      }
    }
  }
  
  return null;
}

/**
 * Find expert by ID
 * @param {number} id - Expert ID
 * @returns {object|null}
 */
export function getExpertById(id) {
  return EXPERTS.find(e => e.id === id) || null;
}

/**
 * Get all experts for a specific show
 * @param {string} source - Show name
 * @returns {object[]}
 */
export function getExpertsBySource(source) {
  const cleanSource = source.toLowerCase();
  return EXPERTS.filter(e => 
    e.source.toLowerCase() === cleanSource && !e.isShow
  );
}

/**
 * Get only show entries (not individual hosts)
 * @returns {object[]}
 */
export function getShows() {
  return EXPERTS.filter(e => e.isShow);
}

/**
 * Get only individual hosts (not shows)
 * @returns {object[]}
 */
export function getHosts() {
  return EXPERTS.filter(e => !e.isShow);
}

/**
 * Match expert name from AI output (handles common errors)
 * @param {string} rawName - Raw name from AI/transcript
 * @param {object[]} expertList - Optional custom expert list
 * @returns {number} - Expert ID or 0 if not found
 */
export function matchExpertId(rawName, expertList = EXPERTS) {
  const expert = findExpert(rawName);
  if (expert) return expert.id;
  
  // Fallback: substring match in provided list
  const clean = String(rawName).toLowerCase();
  const match = expertList.find(e => 
    clean.includes(e.name.toLowerCase().split(' ')[0])
  );
  
  return match ? match.id : 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * INITIAL_EXPERTS format (for components expecting the old format)
 * Strips the aliases and isShow fields for backward compatibility
 */
export const INITIAL_EXPERTS = EXPERTS.map(({ aliases, isShow, ...rest }) => rest);

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════
// Primary: EXPERTS, findExpert, getExpertById, matchExpertId
// Utility: getExpertsBySource, getShows, getHosts
// Legacy: INITIAL_EXPERTS
