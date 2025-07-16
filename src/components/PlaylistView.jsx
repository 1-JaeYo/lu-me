import React, { useState } from 'react';
import { Play, Pause, Heart, Plus, Share2 } from 'lucide-react';
import '../styles/PlaylistView.css';

export default function PlaylistView({
  playlist,
  onBackClick,
  onLikePlaylist,
  onPlayPause,
  currentTrack,
  isPlaying,
  user,
  comments,
  onAddComment
}) {
  const [newComment, setNewComment] = useState('');

  return (
    <div className="pv-container">
      <button className="pv-back" onClick={onBackClick}>
        ← Back to Feed
      </button>

      <div className="pv-header">
        <img
          src={playlist.coverImage}
          alt={playlist.name}
          className="pv-image"
        />
        <div className="pv-info">
          <h1 className="pv-title">{playlist.name}</h1>
          <p className="pv-desc">{playlist.description}</p>
          <p className="pv-creator">
            Created by {playlist.owner.displayName}
          </p>
          <div className="pv-stats">
            <span>{playlist.trackCount} tracks</span>
            <span>•</span>
            <span>{playlist.likes} likes</span>
          </div>
          <div className="pv-buttons">
            <button
              className="pv-play"
              onClick={() => 
                window.open(
                  `https://open.spotify.com/track/${playlist.tracks[0].trackId}`,
                  '_blank'
                )
              }
            >
              <Play size={16} /> Play
            </button>
            <button
              className="pv-like"
              onClick={() => onLikePlaylist(playlist._id)}
            >
              <Heart size={16} /> Like
            </button>
            <button className="pv-share">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="pv-tracks">
        {playlist.tracks.map((track, i) => (
          <div key={track.trackId} className="pv-track">
            <div className="pv-track-info">
              <span className="pv-index">{i + 1}</span>
              <button
                onClick={() =>
                  window.open(
                    `https://open.spotify.com/track/${track.trackId}`,
                    '_blank'
                  )
                }
              >
                <Play size={16} />
              </button>
              <div>
                <p className="pv-track-name">{track.name}</p>
                <p className="pv-track-artist">{track.artist}</p>
              </div>
            </div>
            <div className="pv-track-actions">
              <button>
                <Plus size={16} />
              </button>
              <span className="pv-duration">{track.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pv-comments">
        <h3>Comments ({comments.length})</h3>
        <div className="pv-add">
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="pv-avatar"
          />
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment…"
            className="pv-textarea"
          />
          <button
            onClick={() => {
              onAddComment(newComment);
              setNewComment('');
            }}
            disabled={!newComment.trim()}
            className="pv-comment-btn"
          >
            Comment
          </button>
        </div>

        {comments.map(c => (
          <div key={c._id || c.id} className="pv-comment">
            <img
              src={`https://picsum.photos/32/32?random=${c._id || c.id}`}
              alt={c.user.displayName}
              className="pv-avatar"
            />
            <div>
              <div className="pv-comment-content">
                <p className="pv-comment-user">{c.user.displayName}</p>
                <p>{c.text}</p>
              </div>
              <div className="pv-comment-meta">
                <span>{c.timestamp}</span>
                <button>
                  <Heart size={12} /> {c.likes}
                </button>
                <button>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
