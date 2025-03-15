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
        headers: {
          Authorization: `Bearer ${token}`
        }
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
          headers: {
            Authorization: `Bearer ${token}`
          }
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
    <div>
      <h2>Channels</h2>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            <Link to={`/channel/${channel.id}`}>{channel.name}</Link>
          </li>
        ))}
      </ul>

      <hr />
      <h3>Create a new channel</h3>
      <form onSubmit={handleCreateChannel}>
        <div>
          <label>Name</label>{" "}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>{" "}
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Create Channel</button>
      </form>
    </div>
  );
}
