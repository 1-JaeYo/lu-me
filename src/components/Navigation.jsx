import React, { useState, useRef, useEffect } from 'react';
import { Search, Home, Calendar, Settings, X } from 'lucide-react';
import '../styles/Navigation.css';
import SearchBar from './SearchBar';

export default function Navigation({
  currentView,
  onViewChange,
  user,
  onLogout,
  theme,
  onThemeChange,
  onSongOfTheDay,
  playlists,
  onSearchResults,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const profileRef = useRef();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="nav-bar">
        {/* Left: Logo & Title */}
        <div className="nav-left">
          <img src={process.env.PUBLIC_URL + '/logo 2.png'} alt="logo" className="login-logo"/>
          <span className="nav-title">Lu&amp;Me</span>
        </div>

        {/* Middle: Search */}
        <div className="nav-middle">
          <Search size={16} className="nav-search-icon" />
          <SearchBar data={playlists} onResults={onSearchResults} />
        </div>

        {/* Right: Buttons & Menus */}
        <div className="nav-right">
          {/* Home / Feed */}
          <button
            onClick={() => onViewChange('feed')}
            className={currentView === 'feed' ? 'nav-btn active' : 'nav-btn'}
            title="Feed"
          >
            <Home size={20} />
          </button>

          {/* Song of the Day */}
          <button
            onClick={onSongOfTheDay}
            className="nav-btn"
            title="Song of the Day"
          >
            <Calendar size={20} />
          </button>

          {/* Settings opens full-screen modal */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="nav-btn"
            title="Settings"
          >
            <Settings size={20} />
          </button>

          {/* Profile dropdown */}
          <div className="profile-wrapper" ref={profileRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2 focus:outline-none"
              title="Profile"
            >
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="nav-avatar"
              />
              <span className="nav-username">{user.displayName}</span>
            </button>
            {menuOpen && (
              <div className="profile-dropdown">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="dropdown-item"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Full-screen Settings Modal */}
      {settingsOpen && (
        <div className="settings-overlay">
          <div className="settings-modal">
            <button
              className="settings-close"
              onClick={() => setSettingsOpen(false)}
            >
              <X size={24} />
            </button>
            <h2>Settings</h2>
            <button
              onClick={() =>
                onThemeChange(theme === 'light' ? 'dark' : 'light')
              }
              className="settings-btn"
            >
              Switch to {theme === 'light' ? 'Darker' : 'Regular'} Theme
            </button>
            <button
              onClick={() => alert('Edit display name feature coming soon!')}
              className="settings-btn"
            >
              Edit Display Name
            </button>
            <button onClick={onLogout} className="settings-btn">
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
