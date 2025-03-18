import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ChannelsList() {
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/channels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load channels');
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/channels', 
        { name, description },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setName('');
      setDescription('');
      fetchChannels();
    } catch (err) {
      console.error(err);
      alert('Failed to create channel');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Channels</h2>
      <ul className="list-group mb-4">
        {channels.map((channel) => (
          <li key={channel.id} className="list-group-item">
            <Link to={`/channel/${channel.id}`}>{channel.name}</Link>
          </li>
        ))}
      </ul>

      <div className="card">
        <div className="card-header">Create a New Channel</div>
        <div className="card-body">
          <form onSubmit={handleCreateChannel}>
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2">Create Channel</button>
          </form>
        </div>
      </div>
    </div>
  );
}
