import React from 'react';
import { Heart, MessageCircle, Share2, Play } from 'lucide-react';
import '../styles/PlaylistCard.css';

export default function PlaylistCard({ playlist, onPlaylistClick, onLikePlaylist }) {
  return (
    <div className="card">
      <div className="cover-container" onClick={() => onPlaylistClick(playlist)}>
        <img
          src={playlist.coverImage}
          alt={playlist.name}
          className="cover-image"
        />
        <div className="overlay">
          <Play size={48} color="#ffffff" />
        </div>
      </div>

      <div className="content">
        <h3 className="title">{playlist.name}</h3>
        <p className="description">{playlist.description}</p>
        <p className="meta">
          by {playlist.owner.displayName} • {playlist.trackCount} tracks
        </p>

        <div className="actions">
          <div className="left-actions">
            <button
              className="btn like"
              onClick={e => {
                e.stopPropagation();
                onLikePlaylist(playlist._id);
              }}
            >
              <Heart size={16} />
              <span>{playlist.likes}</span>
            </button>
            <button
              className="btn comment"
              onClick={e => {
                e.stopPropagation();
                /* you could open detail or focus comment input */
              }}
            >
              <MessageCircle size={16} />
              <span>{playlist.commentsCount || playlist.comments}</span>
            </button>
          </div>
          <button className="btn share">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
