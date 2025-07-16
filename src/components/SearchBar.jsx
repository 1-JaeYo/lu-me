import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export default function SearchBar({ data, onResults }) {
  const [query, setQuery] = useState('');

  // Re-create Fuse index any time `data` changes
  const fuse = new Fuse(data, {
    keys: [
      'name',
      'description',
      'owner.displayName',
      'tracks.name',
      'tracks.artist'
    ],
    threshold: 0.3,       // adjust fuzziness (0 = exact, 1 = very fuzzy)
    includeMatches: true, // so we can highlight (optional)
    minMatchCharLength: 2
  });

  // Debounce user input
  useEffect(() => {
    if (query.length < 2) {
      onResults(data);
      return;
    }
    const timeout = setTimeout(() => {
      const results = fuse.search(query).map(r => r.item);
      onResults(results);
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      type="text"
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search playlists or tracks..."
      className="nav-search"
    />
  );
}
