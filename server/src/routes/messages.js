// server/src/routes/messages.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authRequired, adminRequired } = require('../middlewares/authMiddleware');

// Get messages for a channel
router.get('/:channelId', authRequired, async (req, res) => {
  const { channelId } = req.params;
  try {
    const [messages] = await pool.query(
      `SELECT m.*, u.displayName 
       FROM messages m 
       JOIN users u ON m.userId = u.id
       WHERE m.channelId = ?
       ORDER BY m.createdAt ASC`,
      [channelId]
    );
    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Create a new message in a channel
router.post('/:channelId', authRequired, async (req, res) => {
  const { channelId } = req.params;
  const { content, imageUrl } = req.body;
  if (!content) return res.status(400).json({ message: 'Content is required' });

  try {
    await pool.query(
      'INSERT INTO messages (channelId, userId, content, imageUrl) VALUES (?,?,?,?)',
      [channelId, req.user.id, content, imageUrl || null]
    );
    return res.status(201).json({ message: 'Message posted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Admin-only delete
router.delete('/:messageId', authRequired, adminRequired, async (req, res) => {
  const { messageId } = req.params;
  try {
    await pool.query('DELETE FROM messages WHERE id = ?', [messageId]);
    return res.json({ message: 'Message deleted by admin' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
