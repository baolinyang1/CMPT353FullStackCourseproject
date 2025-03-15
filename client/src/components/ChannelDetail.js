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
    <div>
      <h2>Channel Detail</h2>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            <Link to={`/message/${m.id}`}>
              <strong>{m.displayName}:</strong> {m.content}
            </Link>
          </li>
        ))}
      </ul>

      <hr />
      <h3>Post a new message</h3>
      <form onSubmit={handlePostMessage}>
        <div>
          <label>Content</label>{" "}
          <textarea
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            required
          />
        </div>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
