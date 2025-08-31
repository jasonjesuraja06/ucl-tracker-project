// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Teams from './pages/Teams';
import TeamPlayers from './pages/TeamPlayers';
import Nations from './pages/Nations';
import NationPlayers from './pages/NationPlayers';
import Positions from './pages/Positions';
import PositionPlayers from './pages/PositionPlayers';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';


export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
        <Route path="/teams/:team" element={<ProtectedRoute><TeamPlayers /></ProtectedRoute>} />
        <Route path="/nations" element={<ProtectedRoute><Nations /></ProtectedRoute>} />
        <Route path="/nations/:nation" element={<ProtectedRoute><NationPlayers /></ProtectedRoute>} />
        <Route path="/positions" element={<ProtectedRoute><Positions /></ProtectedRoute>} />
        <Route path="/positions/:position" element={<ProtectedRoute><PositionPlayers /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}