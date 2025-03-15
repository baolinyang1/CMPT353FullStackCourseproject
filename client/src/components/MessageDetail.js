import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function MessageDetail() {
  const { messageId } = useParams();
  const [message, setMessage] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');

  const fetchMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      // We can fetch the message alone or use the channel's endpoint. 
      // For simplicity, let's do a direct SQL approach from the server side if needed.
      // Reusing the "get messages for channel" might not be direct. So let's do a single message approach or just hack:
      const res = await axios.get(`http://localhost:5000/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      // Our current messages route is a bit different: /api/messages/:channelId
      // so in real code you'd do an additional route or adapt. For demonstration, let's skip.
    }
  };

  const fetchReplies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/replies/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReplies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostReply = async (e, parentReplyId = null) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/replies/${messageId}`,
        { content: replyContent, parentReplyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyContent('');
      fetchReplies();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // fetchMessage(); // Implementation depends on your server route
    fetchReplies();
  }, [messageId]);

  return (
    <div>
      <h2>Message Detail (ID {messageId})</h2>
      {/* 
        If you had a route to fetch the single message, you'd display message.content, etc.
        For demonstration, let's skip details or mock them:
      */}
      <div>
        <p>Message content goes here (unimplemented fetch for single message).</p>
      </div>

      <hr />
      <h3>Replies</h3>
      <ul>
        {replies.map((r) => (
          <li key={r.id}>
            <strong>{r.displayName}:</strong> {r.content}
            {r.parentReplyId && <span> (reply to #{r.parentReplyId})</span>}
          </li>
        ))}
      </ul>

      <hr />
      <h3>Post a Reply</h3>
      <form onSubmit={(e) => handlePostReply(e, null)}>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          required
        />
        <br />
        <button type="submit">Post Reply</button>
      </form>
    </div>
  );
}
