import React from 'react';
// Uses unified team database from teams.js
import { LOGO_URLS, getTeamLogo, normalizeTeam } from '../../lib/teams.js';

const TeamLogo = ({ team, size = "md" }) => {
  // Size classes
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };
  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Use smart lookup that handles abbreviations, nicknames, etc.
  const logoUrl = getTeamLogo(team) || LOGO_URLS[team];
  const normalizedName = normalizeTeam(team) || team;

  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt={normalizedName} 
        className={`${currentSize} object-contain drop-shadow-md`}
      />
    );
  }

  // Fallback to Letters if name doesn't match
  return (
    <div className={`${currentSize} rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border border-white/10`}>
      {normalizedName ? normalizedName.substring(0, 1).toUpperCase() : "?"}
    </div>
  );
};

export default TeamLogo;