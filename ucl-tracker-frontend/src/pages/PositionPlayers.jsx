import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import PlayerCard from '../components/PlayerCard';
import { parsePosition } from '../prefixMappings';

export default function PositionPlayers() {
  const { position } = useParams();
  const [players, setPlayers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/players/positions/${position}`)
      .then(res => {
        console.log(`Players for ${position}:`, res.data);
        setPlayers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error fetching players for ${position}:`, err);
        setError('Failed to load players. Please try refreshing.');
        setLoading(false);
      });
  }, [position]);

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchName.toLowerCase())
  );

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-8 text-center drop-shadow-[0_2px_6px_rgba(0,255,0,0.6)]">{parsePosition(position)} Players</h1>
        <input 
          type="text" 
          value={searchName} 
          onChange={e => setSearchName(e.target.value)} 
          placeholder="Search by player name..."
          className="w-full max-w-md p-4 mb-6 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400 placeholder-gray-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => <PlayerCard key={player.id} player={player} />)
          ) : (
            <p className="text-center text-gray-300">No players found.</p>
          )}
        </div>
      </div>
    </div>
  );
}