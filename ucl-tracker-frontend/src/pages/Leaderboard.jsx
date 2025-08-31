import { useState, useEffect } from 'react';
import api from '../api';
import { parseTeam, parseNationality, parsePosition, posMap, slugify } from '../prefixMappings';
import PlayerCard from '../components/PlayerCard';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [uniqueNationalities, setUniqueNationalities] = useState([]);
  const [uniquePositions, setUniquePositions] = useState([]);
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [filters, setFilters] = useState({
    nationality: '',
    position: '',
    team: '',
    minGoals: 0,
    sortBy: 'goals',
    limit: 10
  });
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/players/nationalities').then(res => setUniqueNationalities(res.data.map(parseNationality).sort())),
      api.get('/players/positions').then(res => setUniquePositions(res.data)),
      api.get('/players/teams').then(res => setUniqueTeams(res.data.map(parseTeam).sort()))
    ])
      .catch(err => {
        console.error('Error fetching filter data:', err);
        setError('Failed to load filter options. Please try refreshing.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams({
      ...filters,
      minGoals: filters.minGoals.toString(),
    });
    const url = `/players/filter?${params.toString()}`;
    console.log('Fetching leaders with URL:', url);
    api.get(url)
      .then(res => {
        console.log('API response:', res.data);
        setLeaders(res.data);
      })
      .catch(err => console.error('API error:', err));
  }, [filters, loading]);

  const handleChange = (key, value) => {
    console.log(`Changing ${key} to ${value}`);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleShowMore = () => {
    console.log('Show More clicked, increasing limit');
    setFilters(prev => ({ ...prev, limit: prev.limit + 10 }));
  };

  const filteredLeaders = leaders.filter(player =>
    player.name.toLowerCase().includes(searchName.toLowerCase())
  );

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-8 text-center drop-shadow-[0_2px_6px_rgba(0,255,0,0.6)]">Leaderboard</h1>
        <div className="bg-gray-900/80 p-6 rounded-xl shadow-lg mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <select 
              value={filters.sortBy} 
              onChange={e => handleChange('sortBy', e.target.value)} 
              className="p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-green-400"
            >
              <option value="goals">Goals</option>
              <option value="assists">Assists</option>
              <option value="xg">xG</option>
              <option value="xag">xAG</option>
            </select>
            <input 
              type="number" 
              value={filters.minGoals} 
              onChange={e => handleChange('minGoals', parseFloat(e.target.value) || 0)} 
              placeholder="Min Goals"
              className="p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-green-400 w-32"
              min="0"
            />
            <select 
              value={filters.nationality} 
              onChange={e => handleChange('nationality', e.target.value)} 
              className="p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-green-400"
            >
              <option value="">All Nationalities</option>
              {uniqueNationalities.map(nat => <option key={nat} value={nat}>{nat}</option>)}
            </select>
            <select 
              value={filters.position} 
              onChange={e => handleChange('position', e.target.value)} 
              className="p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-green-400"
            >
              <option value="">All Positions</option>
              {uniquePositions.map(pos => <option key={pos} value={pos}>{parsePosition(pos)}</option>)}
            </select>
            <select 
              value={filters.team} 
              onChange={e => handleChange('team', e.target.value)} 
              className="p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-green-400"
            >
              <option value="">All Teams</option>
              {uniqueTeams.map(team => <option key={team} value={team}>{team}</option>)}
            </select>
            <input 
              type="number" 
              value={filters.limit} 
              onChange={e => handleChange('limit', Math.max(1, parseInt(e.target.value) || 10))} 
              placeholder="Limit"
              className="p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-green-400 w-24"
              min="1"
            />
          </div>
          <input 
            type="text" 
            value={searchName} 
            onChange={e => setSearchName(e.target.value)} 
            placeholder="Search by player name..."
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400 placeholder-gray-500 mb-6"
          />
        </div>
        <div className="overflow-x-auto rounded-xl shadow-2xl">
          <table className="min-w-full bg-gray-900/80 shadow-md rounded-xl">
            <thead className="bg-green-500/50">
              <tr>
                <th className="py-3 px-4 text-left rounded-tl-xl text-white">Rank</th>
                <th className="py-3 px-4 text-left text-white">Name</th>
                <th className="py-3 px-4 text-left text-white">Nationality</th>
                <th className="py-3 px-4 text-left text-white">Team</th>
                <th className="py-3 px-4 text-left text-white">Position</th>
                <th className="py-3 px-4 text-left text-white">Goals</th>
                <th className="py-3 px-4 text-left text-white">Assists</th>
                <th className="py-3 px-4 text-left text-white">xG</th>
                <th className="py-3 px-4 text-left rounded-tr-xl text-white">xAG</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaders.map((player, index) => (
                <tr key={player.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-white">{index + 1}</td>
                  <td className="py-3 px-4 text-white">{player.name}</td>
                  <td className="py-3 px-4 text-white">{parseNationality(player.nationality)}</td>
                  <td className="py-3 px-4 text-white">{parseTeam(player.team)}</td>
                  <td className="py-3 px-4 text-white">{parsePosition(player.position)}</td>
                  <td className="py-3 px-4 text-white">{player.goals || 0}</td>
                  <td className="py-3 px-4 text-white">{player.assists || 0}</td>
                  <td className="py-3 px-4 text-white">{player.xg?.toFixed(2) || 0.00}</td>
                  <td className="py-3 px-4 text-white">{player.xag?.toFixed(2) || 0.00}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={handleShowMore} 
          className="mt-8 w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 shadow-md"
        >
          Show More
        </button>
      </div>
    </div>
  );
}