// server/src/routes/replies.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authRequired, adminRequired } = require('../middlewares/authMiddleware');

// Get all replies for a message, nested
router.get('/:messageId', authRequired, async (req, res) => {
  const { messageId } = req.params;
  try {
    // We'll fetch all replies and do a simple nesting on the client side or here
    const [rows] = await pool.query(
      `SELECT r.*, u.displayName 
       FROM replies r
       JOIN users u ON r.userId = u.id
       WHERE r.messageId = ?
       ORDER BY r.createdAt ASC`,
      [messageId]
    );
    // Optionally nest them in a tree
    // For simplicity, return the flat list; client can nest or you can do it here
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Create a reply (can also set parentReplyId for nested)
router.post('/:messageId', authRequired, async (req, res) => {
  const { messageId } = req.params;
  const { content, imageUrl, parentReplyId } = req.body;

  if (!content) return res.status(400).json({ message: 'Reply content required' });

  try {
    await pool.query(
      'INSERT INTO replies (messageId, userId, parentReplyId, content, imageUrl) VALUES (?,?,?,?,?)',
      [messageId, req.user.id, parentReplyId || null, content, imageUrl || null]
    );
    return res.status(201).json({ message: 'Reply created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Admin can delete any reply
router.delete('/:replyId', authRequired, adminRequired, async (req, res) => {
  const { replyId } = req.params;
  try {
    await pool.query('DELETE FROM replies WHERE id = ?', [replyId]);
    return res.json({ message: 'Reply deleted by admin' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
