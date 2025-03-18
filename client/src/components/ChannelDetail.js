import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ChannelDetail() {
  const { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/messages/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/messages/${channelId}`,
        { content: newMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMsg('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [channelId]);

  return (
    <div className="container mt-5">
      <h2>Channel Detail</h2>
      <ul className="list-group mb-4">
        {messages.map((m) => (
          <li key={m.id} className="list-group-item">
            <Link to={`/message/${m.id}`}>
              <strong>{m.displayName}:</strong> {m.content}
            </Link>
          </li>
        ))}
      </ul>

      <div className="card">
        <div className="card-header">Post a New Message</div>
        <div className="card-body">
          <form onSubmit={handlePostMessage}>
            <div className="form-group">
              <label>Content</label>
              <textarea
                className="form-control"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2">Post Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

