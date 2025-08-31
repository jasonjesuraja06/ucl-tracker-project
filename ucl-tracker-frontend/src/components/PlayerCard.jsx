import { parseTeam, parsePosition, parseNationality, slugify } from '../prefixMappings';

export default function PlayerCard({ player }) {
  const teamSlug = slugify(parseTeam(player.team)); // e.g., "manchester-city"
  const photoSlug = slugify(player.name); // e.g., "federico-valverde"

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,255,0,0.1)] hover:shadow-[0_10px_40px_rgba(0,255,0,0.3)] transition-all duration-300 border border-green-500/20 overflow-hidden max-w-sm mx-auto transform hover:scale-105">
      <div className="relative flex flex-col items-center text-center">
        {/* Player Photo with Holographic Overlay */}
        <div className="relative w-36 h-36">
          <img 
            src={`/player-photos/${teamSlug}/${photoSlug}.jpg`} 
            alt={`${player.name}'s photo`} 
            className="w-full h-full object-cover rounded-xl border-4 border-green-500/30"
            onError={(e) => e.target.src = '/player-photos/default.jpg'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-transparent to-green-900/60 rounded-xl animate-pulse"></div>
        </div>
        <h3 className="text-2xl font-bold text-white mt-4 mb-3 tracking-wide drop-shadow-[0_2px_4px_rgba(0,255,0,0.5)]">{player.name}</h3>
        <div className="w-full grid grid-cols-2 gap-2 text-sm font-sans">
          {[
            { label: "Position", value: parsePosition(player.position) },
            { label: "Team", value: parseTeam(player.team) },
            { label: "Nationality", value: parseNationality(player.nationality) },
            { label: "Age", value: player.age || 'N/A' },
            { label: "Matches", value: player.matchesPlayed || 0 },
            { label: "Starts", value: player.starts || 0 },
            { label: "Minutes", value: player.minutes || 0 },
            { label: "Goals", value: player.goals || 0 },
            { label: "Assists", value: player.assists || 0 },
            { label: "PK", value: player.pkMade || 0 },
            { label: "xG", value: player.xg?.toFixed(2) || 0.00 },
            { label: "xAG", value: player.xag?.toFixed(2) || 0.00 },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/70 p-2 rounded-lg border border-green-500/30 hover:bg-green-900/50 transition-colors duration-200">
              <p className="text-green-300 font-medium text-xs uppercase tracking-wide">{stat.label}</p>
              <p className="text-white font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}