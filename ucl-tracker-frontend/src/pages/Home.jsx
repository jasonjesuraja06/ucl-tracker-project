import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('player-photos/ucl-trophy.png')] bg-cover bg-center relative flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70"></div>
      <div className="text-center bg-gray-900/80 p-10 rounded-xl shadow-lg max-w-2xl relative z-10">
        <img src="/team-logos/ucl.png" alt="UCL Logo" className="w-32 mx-auto mb-6 rounded-lg filter drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]" />
        <h1 className="text-5xl font-bold text-green-400 mb-6 drop-shadow-[0_2px_6px_rgba(0,255,0,0.6)]">Welcome to UCL Tracker!</h1>
        <p className="text-lg text-gray-300 mb-8">Explore detailed stats for the 2024/25 UEFA Champions League season. Track players, teams, and nations with ease.</p>
        <Link to="/login" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 shadow-md">Get Started</Link>
      </div>
    </div>
  );
}