import React from 'react';
import { Music } from 'lucide-react';
import '../styles/LoginScreen.css';

export default function LoginScreen({ onSpotifyLogin }) {
  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <Music size={32} className="login-icon" />
          <h1>Lu&Me</h1>
          <p>Discover and share music with bestie</p>
        </div>
          <button onClick={onSpotifyLogin} className="login-btn">
          <Music size={20}/> Continue with Spotify
        </button>
      </div>
    </div>
  );
}
