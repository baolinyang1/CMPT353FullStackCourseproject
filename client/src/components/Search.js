import React, { useState } from 'react';
import axios from 'axios';

export default function Search() {
  const [query, setQuery] = useState('');
  const [byUser, setByUser] = useState('');
  const [results, setResults] = useState([]);
  const [statsType, setStatsType] = useState('');
  const [statsResult, setStatsResult] = useState(null);

  const handleSearchText = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { query }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert('Search error');
    }
  };

  const handleSearchByUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { byUser }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert('Search error');
    }
  };

  const handleStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { stats: statsType }
      });
      setStatsResult(res.data);
      setResults([]); // Clear normal results
    } catch (err) {
      console.error(err);
      alert('Stats error');
    }
  };

  return (
    <div>
      <h2>Search</h2>

      <div>
        <h3>Search by text content</h3>
        <input
          placeholder="String to find..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearchText}>Search</button>
      </div>

      <div>
        <h3>Search by user</h3>
        <input
          placeholder="username"
          value={byUser}
          onChange={(e) => setByUser(e.target.value)}
        />
        <button onClick={handleSearchByUser}>Search</button>
      </div>

      <div>
        <h3>Stats</h3>
        <button onClick={() => {setStatsType('mostLeastPosts'); handleStats();}}>
          Most/Least Posts
        </button>
        <button onClick={() => {setStatsType('highestLowestRank'); handleStats();}}>
          Highest/Lowest Rank
        </button>
      </div>

      <hr />
      <div>
        {results.length > 0 && (
          <>
            <h3>Search Results</h3>
            <ul>
              {results.map((r, i) => (
                <li key={i}>
                  {r.type} #{r.id} by {r.displayName || '???'}: {r.content}
                </li>
              ))}
            </ul>
          </>
        )}
        {statsResult && (
          <>
            <h3>Stats Results</h3>
            <pre>{JSON.stringify(statsResult, null, 2)}</pre>
          </>
        )}
      </div>
    </div>
  );
}
