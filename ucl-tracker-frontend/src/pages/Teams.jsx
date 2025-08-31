import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { parseTeam, slugify } from '../prefixMappings';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/players/teams')
      .then(res => {
        console.log('API response for teams:', res.data);
        setTeams(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams. Please try refreshing.');
        setLoading(false);
      });
  }, []);

  const filtered = teams
    .map(t => {
      const name = parseTeam(t);
      const slug = slugify(parseTeam(t));
      return { original: t, name, slug };
    })
    .filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-8 text-center drop-shadow-[0_2px_6px_rgba(0,255,0,0.6)]">Teams</h1>
        <input 
          type="text" 
          placeholder="Search teams..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="w-full max-w-md p-4 mb-6 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400 placeholder-gray-500"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.slice(0, visible).map(({ original, name, slug }) => (
            <Link to={`/teams/${slug}`} key={original} className="block">
              <div className="bg-gray-900/80 p-6 rounded-xl shadow-lg hover:shadow-green-500/20 transition-all duration-300 border border-green-500/20 text-center">
                <img src={`/team-logos/${slug}.png`} alt={name} className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-green-500/30" onError={(e) => e.target.src = '/team-logos/default.png'} />
                <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
              </div>
            </Link>
          ))}
        </div>
        {visible < filtered.length && (
          <button 
            onClick={() => setVisible(v => v + 10)} 
            className="mt-8 w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 shadow-md"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}