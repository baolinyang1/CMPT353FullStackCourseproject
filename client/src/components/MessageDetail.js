import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function MessageDetail() {
  const { messageId } = useParams();
  const [message, setMessage] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');

  // For demonstration purposes, we mock the message detail.
  const fetchMessage = async () => {
    try {
      // You would normally call an endpoint here.
      // For this demo, we simulate a fetched message.
      setMessage({
        id: messageId,
        content: "This is a sample message content.",
        displayName: "SampleUser"
      });
    } catch (err) {
      console.error(err);
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
    fetchMessage();
    fetchReplies();
  }, [messageId]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Message Detail (ID: {messageId})</h2>
      
      <div className="card mb-4">
        <div className="card-header">
          {message ? `${message.displayName}'s Message` : 'Loading message...'}
        </div>
        <div className="card-body">
          <p className="card-text">
            {message ? message.content : 'Message content not available.'}
          </p>
        </div>
      </div>

      <h3 className="mb-3">Replies</h3>
      {replies.length > 0 ? (
        <ul className="list-group mb-4">
          {replies.map((r) => (
            <li key={r.id} className="list-group-item">
              <strong>{r.displayName}:</strong> {r.content}
              {r.parentReplyId && (
                <span className="badge badge-secondary ml-2">
                  Reply to #{r.parentReplyId}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No replies yet.</p>
      )}

      <div className="card">
        <div className="card-header">Post a Reply</div>
        <div className="card-body">
          <form onSubmit={(e) => handlePostReply(e, null)}>
            <div className="form-group">
              <textarea
                className="form-control"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Enter your reply..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Post Reply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

