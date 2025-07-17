import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PlaylistCard  from './components/PlaylistCard';
import PlaylistView  from './components/PlaylistView';
import LoginScreen   from './components/LoginScreen';
import Navigation    from './components/Navigation';
import NowPlayingBar from './components/NowPlayingBar';
// import SearchBar from './components/SearchBar';
import './App.css';
import './index.css';

function App() {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistsImported, setPlaylistsImported] = useState(false); // ← new
  const [comments, setComments] = useState([]);
  const [currentView, setCurrentView] = useState('feed');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);

  // Bootstrap Auth & User
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    if (token) {
      localStorage.setItem('ms_token', token);
      window.history.replaceState({}, document.title, '/');
    }
    const savedToken = localStorage.getItem('ms_token');
    if (savedToken) {
      axios.get(`${process.env.REACT_APP_API_URL}api/users/me`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
      .then(res => {
        console.log('User profile:', res.data);
        setUser(res.data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem('ms_token');
      });
    }
  }, []);

  // Bootstrap Playlists
  useEffect(() => {
    if (!isLoggedIn) return;
    // auto-import once on login:
    importPlaylists();
  }, [isLoggedIn]);

  // Theme change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Whenever `playlists` changes (import or shared), reset the filter
  useEffect(() => {
    setFilteredPlaylists(playlists);
  }, [playlists]);

  // Handlers
  // Import playlists from Spotify → backend → DB
  const importPlaylists = () => {
    const token = localStorage.getItem('ms_token');
    axios.get(
      `${process.env.REACT_APP_API_URL}api/playlists/import`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      console.log('Imported playlists:', res.data.playlists);
      setPlaylists(res.data.playlists);
      setPlaylistsImported(true); // ← new: hide button after import
    })
    .catch(err => {
      console.error('Failed to import playlists:', err);
      alert('Could not import playlists—check the console for details.');
    });
  };

  const handleSpotifyLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}api/auth/login`;
  };

  const handlePlayPause = track => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // const handleLikePlaylist = playlistId => {
  //   const token = localStorage.getItem('ms_token');
  //   axios
  //     .post(
  //       `${process.env.REACT_APP_API_URL}/api/playlists/${playlistId}/like`,
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     )
  //     .then(res => {
  //       setPlaylists(pls =>
  //         pls.map(pl =>
  //           pl._id === playlistId ? { ...pl, likes: res.data.likes } : pl
  //         )
  //       );
  //     })
  //     .catch(console.error);
  // };

  const handlePlaylistClick = playlist => {
    setSelectedPlaylist(playlist);
    setCurrentView('playlist');

    // load comments for that playlist
    axios
      .get(`${process.env.REACT_APP_API_URL}api/comments/${playlist._id}`)
      .then(res => setComments(res.data))
      .catch(console.error);
  };

  // const handleAddComment = (playlistId, text) => {
  //   const token = localStorage.getItem('ms_token');
  //   axios
  //     .post(
  //       `${process.env.REACT_APP_API_URL}/api/comments/${playlistId}`,
  //       { text },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     )
  //     .then(res => {
  //       setComments(cs => [res.data, ...cs]);
  //     })
  //     .catch(console.error);
  // };

  const handleBackToFeed = () => {
    setCurrentView('feed');
    setSelectedPlaylist(null);
    setComments([]);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('ms_token');
    try {
      // Tell our backend to clear tokens
      await axios.post(
        `${process.env.REACT_APP_API_URL}api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Backend logout failed:', err);
    }

    // Clear localStorage & app state
    localStorage.removeItem('ms_token');
    setUser(null);
    setIsLoggedIn(false);

    // Redirect the browser to Spotify’s own logout URL
    //    this will sign them out of Spotify.com
    window.location.href = 'https://www.spotify.com/logout/';
  }

  // SOTD
  const handleSongOfTheDay = () => {
    const token = localStorage.getItem('ms_token');
    axios
      .get(`${process.env.REACT_APP_API_URL}api/playlists/song-of-the-day`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const track = res.data;
        // open on Spotify
        window.open(
          `https://open.spotify.com/track/${track.trackId}`,
          '_blank'
        );
      })
      .catch(err => {
        console.error('Song of the Day error:', err);
        alert(
          err.response?.data?.message ||
            'Could not fetch Song of the Day'
        );
      });
  };

  // Like a playlist
  const handleLikePlaylist = async (playlistId) => {
    try {
      const token = localStorage.getItem('ms_token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}api/playlists/${playlistId}/like`,
        {}, // empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state so the UI reflects the new count
      setPlaylists((pls) =>
        pls.map((pl) =>
          pl.id === playlistId ? { ...pl, likes: res.data.likes } : pl
        )
      );
    } catch (err) {
      console.error('Failed to like playlist', err);
    }
  };

  // — Add a comment —
  const handleAddComment = async (playlistId, text) => {
    try {
      const token = localStorage.getItem('ms_token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}api/comments/${playlistId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Prepend the new comment onto your comments state
      setComments((cs) => [res.data, ...cs]);
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };


  // Render

  if (!isLoggedIn) {
    return <LoginScreen onSpotifyLogin={handleSpotifyLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onThemeChange = {setTheme}
        onSongOfTheDay={handleSongOfTheDay}
        playlists={playlists} 
        onSearchResults={setFilteredPlaylists}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'feed' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Your Feed</h2>
              <p className="text-gray-600">Discover playlists shared by friends</p>
            </div>

            {/* ← Add Import button here */}
            {!playlistsImported && (
              <button
                onClick={importPlaylists}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-6"
              >
                Import Your Playlists
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaylists.map(pl => (
                <PlaylistCard
                  key={pl._id}
                  playlist={pl}
                  onPlaylistClick={handlePlaylistClick}
                  onLikePlaylist={handleLikePlaylist}
                />
              ))}
            </div>
          </div>
        )}

        {currentView === 'playlist' && selectedPlaylist && (
          <PlaylistView
            playlist={selectedPlaylist}
            comments={comments}
            onAddComment={text =>
              handleAddComment(selectedPlaylist._id, text)
            }
            onBackClick={handleBackToFeed}
            onLikePlaylist={handleLikePlaylist}
            onPlayPause={handlePlayPause}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            user={user}
          />
        )}
      </main>

      {currentTrack && (
        <NowPlayingBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
        />
      )}
    </div>
  );
}

export default App;
