import React, { useState } from 'react';
import axios from 'axios';

export default function Search() {
  const [query, setQuery] = useState('');
  const [byUser, setByUser] = useState('');
  const [results, setResults] = useState([]);
  const [statsResult, setStatsResult] = useState(null);

  const handleSearchText = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { query }
      });
      setResults(res.data);
      setStatsResult(null);
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
      setStatsResult(null);
    } catch (err) {
      console.error(err);
      alert('Search error');
    }
  };

  const handleStats = async (statType) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { stats: statType }
      });
      setStatsResult(res.data);
      setResults([]);
    } catch (err) {
      console.error(err);
      alert('Stats error');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Search</h2>

      {/* Search by Text Content */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Search by Text Content</h5>
          <div className="form-inline">
            <input
              type="text"
              className="form-control mr-2"
              placeholder="Enter string to find..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearchText} className="btn btn-primary">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search by User */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Search by User</h5>
          <div className="form-inline">
            <input
              type="text"
              className="form-control mr-2"
              placeholder="Enter username..."
              value={byUser}
              onChange={(e) => setByUser(e.target.value)}
            />
            <button onClick={handleSearchByUser} className="btn btn-primary">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Stats</h5>
          <button
            onClick={() => handleStats('mostLeastPosts')}
            className="btn btn-secondary mr-2"
          >
            Most/Least Posts
          </button>
          <button
            onClick={() => handleStats('highestLowestRank')}
            className="btn btn-secondary"
          >
            Highest/Lowest Rank
          </button>
        </div>
      </div>

      {/* Display Results */}
      {results.length > 0 && (
        <div className="card mb-3">
          <div className="card-header">Search Results</div>
          <ul className="list-group list-group-flush">
            {results.map((r, i) => (
              <li key={i} className="list-group-item">
                {r.type} #{r.id} by {r.displayName || '???'}: {r.content}
              </li>
            ))}
          </ul>
        </div>
      )}

      {statsResult && (
        <div className="card mb-3">
          <div className="card-header">Stats Results</div>
          <div className="card-body">
            <pre>{JSON.stringify(statsResult, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
