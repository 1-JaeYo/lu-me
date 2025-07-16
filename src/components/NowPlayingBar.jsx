import React from 'react';
import { Play, Pause } from 'lucide-react';
import '../styles/NowPlayingBar.css';

export default function NowPlayingBar({ currentTrack, isPlaying, onPlayPause }) {
  if (!currentTrack) return null;
  return (
    <div className="npb-bar">
      <div className="npb-left">
        <button className="npb-play-btn" onClick={() => onPlayPause(currentTrack)}>
          {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
        </button>
        <div className="npb-info">
          <p className="npb-name">{currentTrack.name}</p>
          <p className="npb-artist">{currentTrack.artist}</p>
        </div>
      </div>
      <div className="npb-text">Now Playing</div>
    </div>
  );
}
