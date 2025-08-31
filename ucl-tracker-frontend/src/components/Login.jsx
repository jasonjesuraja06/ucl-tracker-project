import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/teams');
  }, [user, navigate]);

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;

  const login = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen bg-[url('player-photos/ucl-trophy.png')] bg-cover bg-center relative flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70"></div>
      <div className="bg-gray-900/80 p-8 rounded-xl shadow-lg w-full max-w-md text-center relative z-10">
        <h2 className="text-3xl font-bold text-green-400 mb-6 drop-shadow-[0_2px_4px_rgba(0,255,0,0.5)]">Welcome to UCL Tracker!</h2>
        {loading && <p className="text-white mb-4">Loading...</p>}
        <button 
          onClick={login} 
          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 shadow-md flex items-center justify-center space-x-3"
        >
          <img src="/team-logos/google-logo.png" alt="Google Logo" className="w-6 h-6 filter drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]" />
          <span className="tracking-wide">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}