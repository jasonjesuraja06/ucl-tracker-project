import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { parseTeam, parseNationality, slugify } from '../prefixMappings';

export default function Admin() {
  const navigate = useNavigate();

  // Data
  const [players, setPlayers] = useState([]);
  const [nations, setNations] = useState([]); // raw (prefixed) as stored in DB
  const [teams, setTeams] = useState([]);     // raw (prefixed) as stored in DB

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');
  const [visible, setVisible] = useState(12);

  // Admin / auth state feedback
  const [forbidden, setForbidden] = useState(false);

  // Form state
  const emptyForm = {
    name: '',
    nationality: '', // must be from nations raw options
    position: 'FW',  // GK / DF / MF / FW
    team: '',        // must be from teams raw options
    age: '',
    matchesPlayed: '',
    gamesStarted: '',
    minutes: '',
    goals: '',
    assists: '',
    penaltyKicksMade: '',
    xg: '',
    xag: '',
  };

  const [mode, setMode] = useState('create'); // 'create' | 'update' | 'patch'
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // success/info messages

  // Load initial data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      api.get('/players'),
      api.get('/players/nationalities'),
      api.get('/players/teams'),
    ])
      .then(([pRes, nRes, tRes]) => {
        if (!mounted) return;
        setPlayers(pRes.data || []);
        setNations((nRes.data || []).sort());
        setTeams((tRes.data || []).sort());
        setLoading(false);
      })
      .catch(err => {
        console.error('Admin init load error:', err);
        if (!mounted) return;
        setError('Failed to load initial data. Please refresh.');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Filtered players by search
  const filteredPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return players;
    return players.filter(p => {
      const name = (p.name || '').toLowerCase();
      const teamName = parseTeam(p.team || '').toLowerCase();
      const natName = parseNationality(p.nationality || '').toLowerCase();
      const pos = (p.position || '').toLowerCase();
      return (
        name.includes(q) ||
        teamName.includes(q) ||
        natName.includes(q) ||
        pos.includes(q)
      );
    });
  }, [players, search]);

  // Helpers
  const asInt   = (v) => (v === '' || v === null || v === undefined) ? null : parseInt(v, 10);
  const asFloat = (v) => (v === '' || v === null || v === undefined) ? null : parseFloat(v);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedId(null);
    setMode('create');
  };

  const selectForUpdate = (player) => {
    setMode('update');
    setSelectedId(player.id);
    setForm({
      name: player.name ?? '',
      nationality: player.nationality ?? '',
      position: player.position ?? 'FW',
      team: player.team ?? '',
      age: player.age ?? '',
      matchesPlayed: player.matchesPlayed ?? '',
      gamesStarted: player.starts ?? player.gamesStarted ?? '',
      minutes: player.minutes ?? '',
      goals: player.goals ?? '',
      assists: player.assists ?? '',
      penaltyKicksMade: player.pkMade ?? player.penaltyKicksMade ?? '',
      xg: player.xg ?? '',
      xag: player.xag ?? '',
    });
  };

  const selectForPatch = (player) => {
    setMode('patch');
    setSelectedId(player.id);
    setForm({
      name: '',
      nationality: '',
      position: 'FW',
      team: '',
      age: '',
      matchesPlayed: '',
      gamesStarted: '',
      minutes: '',
      goals: '',
      assists: '',
      penaltyKicksMade: '',
      xg: '',
      xag: '',
    });
  };

  // Compose payload per PlayerRequest
  const buildPayload = () => {
    // For PATCH mode we only send non-empty fields
    if (mode === 'patch') {
      const body = {};
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) {
          if (['age','matchesPlayed','gamesStarted','minutes','goals','assists','penaltyKicksMade'].includes(k)) {
            body[k] = asInt(v);
          } else if (['xg','xag'].includes(k)) {
            body[k] = asFloat(v);
          } else {
            body[k] = v;
          }
        }
      });
      return body;
    }

    // create / update — full payload (allow null numbers)
    return {
      name: form.name,
      nationality: form.nationality,
      position: form.position,
      team: form.team,
      age: asInt(form.age),
      matchesPlayed: asInt(form.matchesPlayed),
      gamesStarted: asInt(form.gamesStarted),
      minutes: asInt(form.minutes),
      goals: asInt(form.goals),
      assists: asInt(form.assists),
      penaltyKicksMade: asInt(form.penaltyKicksMade),
      xg: asFloat(form.xg),
      xag: asFloat(form.xag),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    setForbidden(false);

    try {
      let res;
      const body = buildPayload();

      if (mode === 'create') {
        res = await api.post('/players', body);
      } else if (mode === 'update') {
        if (!selectedId) throw new Error('No player selected for update.');
        res = await api.put(`/players/${selectedId}`, body);
      } else {
        if (!selectedId) throw new Error('No player selected for patch.');
        res = await api.patch(`/players/${selectedId}`, body);
      }

      // Success — reload list
      const list = await api.get('/players');
      setPlayers(list.data || []);
      setToast(`✅ ${mode === 'create' ? 'Created' : mode === 'update' ? 'Updated' : 'Patched'} successfully`);
      if (mode !== 'patch') resetForm();
    } catch (err) {
      console.error('Admin save error:', err);
      if (err?.response?.status === 403) {
        setForbidden(true);
        setToast('❌ You are not an admin. Access denied.');
      } else if (err?.response?.data?.message) {
        setToast(`❌ ${err.response.data.message}`);
      } else {
        setToast('❌ Failed to save. Check inputs and try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (playerId) => {
    const ok = window.confirm('Delete this player? This cannot be undone.');
    if (!ok) return;
    setSaving(true);
    setToast(null);
    setForbidden(false);

    try {
      await api.delete(`/players/${playerId}`);
      const list = await api.get('/players');
      setPlayers(list.data || []);
      setToast('✅ Deleted successfully');
      if (selectedId === playerId) resetForm();
    } catch (err) {
      console.error('Admin delete error:', err);
      if (err?.response?.status === 403) {
        setForbidden(true);
        setToast('❌ You are not an admin. Access denied.');
      } else if (err?.response?.data?.message) {
        setToast(`❌ ${err.response.data.message}`);
      } else {
        setToast('❌ Failed to delete. Try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading admin panel...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-green-400 drop-shadow-[0_2px_6px_rgba(0,255,0,0.6)]">
            Admin: Manage Players
          </h1>
          <div className="flex gap-3">
            <Link to="/" className="text-white/80 hover:text-white">Home</Link>
            <Link to="/teams" className="text-white/80 hover:text-white">Teams</Link>
            <Link to="/nations" className="text-white/80 hover:text-white">Nations</Link>
            <Link to="/leaderboard" className="text-white/80 hover:text-white">Leaderboard</Link>
          </div>
        </div>

        {forbidden && (
          <div className="mb-4 p-3 rounded-md bg-red-900/50 text-red-200 border border-red-500/30">
            You are not an admin. You can view but cannot modify data.
          </div>
        )}
        {toast && (
          <div className="mb-4 p-3 rounded-md bg-gray-800 text-white border border-green-500/20">
            {toast}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by player, team, nationality, or position..."
            className="w-full max-w-2xl p-4 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-green-400 placeholder-gray-500"
          />
        </div>

        {/* Grid of players */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <h2 className="text-2xl text-white mb-3">Players</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPlayers.slice(0, visible).map(p => {
                const tname = parseTeam(p.team || '');
                const nname = parseNationality(p.nationality || '');
                const teamSlug = slugify(tname);
                return (
                  <div
                    key={p.id}
                    className="bg-gray-900/80 border border-green-500/20 rounded-xl p-4 hover:shadow-green-500/20 transition-all duration-300 flex gap-4"
                  >
                    <img
                      src={`/team-logos/${teamSlug}.png`}
                      alt={tname}
                      className="w-16 h-16 rounded-full border border-green-500/20 object-cover"
                      onError={(e) => (e.currentTarget.src = '/team-logos/default.png')}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white text-lg font-semibold">{p.name}</h3>
                        <span className="text-xs text-white/70 bg-gray-800 px-2 py-1 rounded">
                          {p.position}
                        </span>
                      </div>
                      <div className="text-white/80 text-sm mt-1">
                        <div>Team: <span className="text-white">{tname}</span></div>
                        <div>Nation: <span className="text-white">{nname}</span></div>
                      </div>
                      <div className="text-white/80 text-xs mt-2 flex flex-wrap gap-3">
                        <div>Goals: <span className="text-white">{p.goals ?? 0}</span></div>
                        <div>Assists: <span className="text-white">{p.assists ?? 0}</span></div>
                        <div>xG: <span className="text-white">{p.xg ?? 0}</span></div>
                        <div>xAG: <span className="text-white">{p.xag ?? 0}</span></div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => selectForUpdate(p)}
                          className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => selectForPatch(p)}
                          className="px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                        >
                          Patch
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-2 text-sm bg-red-700 hover:bg-red-800 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {visible < filteredPlayers.length && (
              <button
                onClick={() => setVisible(v => v + 12)}
                className="mt-6 w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 shadow-md"
              >
                Show More
              </button>
            )}
          </div>

          {/* Create / Update / Patch form */}
          <div className="md:col-span-5">
            <h2 className="text-2xl text-white mb-3">
              {mode === 'create' ? 'Create Player'
                : mode === 'update' ? `Update Player ${selectedId ?? ''}`
                : `Patch Player ${selectedId ?? ''}`}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="bg-gray-900/80 border border-green-500/20 rounded-xl p-4 space-y-3"
            >
              {/* Mode toggle */}
              <div className="flex gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => { setMode('create'); setSelectedId(null); }}
                  className={`px-3 py-2 rounded ${mode === 'create' ? 'bg-green-700 text-white' : 'bg-gray-800 text-white/80 hover:text-white'}`}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setMode('update')}
                  className={`px-3 py-2 rounded ${mode === 'update' ? 'bg-green-700 text-white' : 'bg-gray-800 text-white/80 hover:text-white'}`}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setMode('patch')}
                  className={`px-3 py-2 rounded ${mode === 'patch' ? 'bg-green-700 text-white' : 'bg-gray-800 text-white/80 hover:text-white'}`}
                >
                  Patch
                </button>
              </div>

              {/* ID info */}
              {(mode === 'update' || mode === 'patch') && (
                <div className="text-white/70 text-sm">
                  Selected ID: <span className="text-white">{selectedId ?? '(none)'}</span>
                  {!selectedId && <div className="text-yellow-400 mt-1">Select a player from the left to {mode}.</div>}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-white/80 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  placeholder={mode === 'patch' ? '(optional)' : 'e.g., Erling Haaland'}
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400"
                />
              </div>

              {/* Nationality (raw list) */}
              <div>
                <label className="block text-white/80 mb-1">Nationality (raw DB value)</label>
                <select
                  name="nationality"
                  value={form.nationality}
                  onChange={handleInput}
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
                >
                  <option value="">{mode === 'patch' ? '(leave empty to skip)' : 'Select nationality'}</option>
                  {nations.map(n => (
                    <option key={n} value={n}>
                      {parseNationality(n)} — <span className="text-xs">{n}</span>
                    </option>
                  ))}
                </select>
                <p className="text-xs text-white/50 mt-1">
                  Uses raw value from DB (e.g., <code>gb-eng</code> or <code>br BRA</code>). Displayed name is normalized.
                </p>
              </div>

              {/* Position */}
              <div>
                <label className="block text-white/80 mb-1">Position</label>
                <select
                  name="position"
                  value={form.position}
                  onChange={handleInput}
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
                >
                  <option value="GK">Goalkeeper</option>
                  <option value="DF">Defender</option>
                  <option value="MF">Midfielder</option>
                  <option value="FW">Forward</option>
                </select>
              </div>

              {/* Team (raw list) */}
              <div>
                <label className="block text-white/80 mb-1">Team (raw DB value)</label>
                <select
                  name="team"
                  value={form.team}
                  onChange={handleInput}
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
                >
                  <option value="">{mode === 'patch' ? '(leave empty to skip)' : 'Select team'}</option>
                  {teams.map(t => (
                    <option key={t} value={t}>
                      {parseTeam(t)} — <span className="text-xs">{t}</span>
                    </option>
                  ))}
                </select>
                <p className="text-xs text-white/50 mt-1">
                  Uses raw value from DB with prefix (e.g., <code>eng Manchester City</code>).
                </p>
              </div>

              {/* Numeric fields */}
              <div className="grid grid-cols-2 gap-3">
                <FieldNumber label="Age" name="age" value={form.age} onChange={handleInput} patch={mode==='patch'} />
                <FieldNumber label="Matches Played" name="matchesPlayed" value={form.matchesPlayed} onChange={handleInput} patch={mode==='patch'} />
                <FieldNumber label="Games Started" name="gamesStarted" value={form.gamesStarted} onChange={handleInput} patch={mode==='patch'} />
                <FieldNumber label="Minutes" name="minutes" value={form.minutes} onChange={handleInput} patch={mode==='patch'} />
                <FieldNumber label="Goals" name="goals" value={form.goals} onChange={handleInput} patch={mode==='patch'} />
                <FieldNumber label="Assists" name="assists" value={form.assists} onChange={handleInput} patch={mode==='patch'} />
                <FieldNumber label="PK Made" name="penaltyKicksMade" value={form.penaltyKicksMade} onChange={handleInput} patch={mode==='patch'} />
                <FieldNumber label="xG" name="xg" value={form.xg} onChange={handleInput} patch={mode==='patch'} step="0.01" />
                <FieldNumber label="xAG" name="xag" value={form.xag} onChange={handleInput} patch={mode==='patch'} step="0.01" />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || ((mode === 'update' || mode === 'patch') && !selectedId)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg"
                >
                  {saving ? 'Saving...' : mode === 'create' ? 'Create' : mode === 'update' ? 'Save Update' : 'Apply Patch'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="text-xs text-white/50 mt-3">
              <p><strong>Note:</strong> Nationality and Team use <em>raw</em> database values to ensure consistency (prefixes included). The UI displays normalized names.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small numeric input helper to keep styles consistent */
function FieldNumber({ label, name, value, onChange, patch, step = '1' }) {
  return (
    <div>
      <label className="block text-white/80 mb-1">{label}</label>
      <input
        type="number"
        step={step}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={patch ? '(optional)' : ''}
        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-400"
      />
    </div>
  );
}
