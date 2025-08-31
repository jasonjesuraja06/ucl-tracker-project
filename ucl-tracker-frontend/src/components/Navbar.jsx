import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''; // set this in your .env

export default function Navbar() {
  const { user, logout } = useAuth();

  const isAdmin =
    !!user &&
    !!user.email &&
    ADMIN_EMAIL &&
    user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <nav className="bg-gradient-to-r from-black to-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: brand */}
        <div className="flex items-center space-x-3">
          <img
            src="/team-logos/ucl.png"
            alt="UEFA Champions League Logo"
            className="w-10 h-10 filter drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]"
            onError={(e) => (e.currentTarget.src = '/team-logos/default.png')}
          />
          <Link
            to="/"
            className="text-green-400 text-2xl font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,255,0,0.3)]"
          >
            UCL Tracker
          </Link>
        </div>

        {/* Right: nav links */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/teams" className="text-white hover:text-green-400 transition duration-200">
                Teams
              </Link>
              <Link to="/nations" className="text-white hover:text-green-400 transition duration-200">
                Nations
              </Link>
              <Link to="/positions" className="text-white hover:text-green-400 transition duration-200">
                Positions
              </Link>
              <Link to="/leaderboard" className="text-white hover:text-green-400 transition duration-200">
                Leaderboard
              </Link>

              {/* Show Admin link only for your admin email */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-white hover:text-green-400 transition duration-200"
                  title="Admin dashboard"
                >
                  Admin
                </Link>
              )}

              {/* User info */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">
                  {user.name || user.email || 'User'}
                </span>
                {isAdmin && (
                  <span className="text-[10px] uppercase bg-green-700 text-white px-2 py-1 rounded-md border border-green-400/40">
                    Admin
                  </span>
                )}
              </div>

              <button
                onClick={logout}
                className="text-white hover:text-green-400 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white hover:text-green-400 transition duration-200">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
