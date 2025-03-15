// server/src/routes/ratings.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authRequired } = require('../middlewares/authMiddleware');

// Rate a message
router.post('/message/:messageId', authRequired, async (req, res) => {
  const { messageId } = req.params;
  const { rating } = req.body; // 1 for thumbs up, -1 for thumbs down
  if (![1, -1].includes(rating)) {
    return res.status(400).json({ message: 'Invalid rating' });
  }
  try {
    // Upsert logic
    const [existing] = await pool.query(
      `SELECT id FROM ratings WHERE userId = ? AND messageId = ?`,
      [req.user.id, messageId]
    );
    if (existing.length > 0) {
      await pool.query(
        `UPDATE ratings SET rating = ? WHERE id = ?`,
        [rating, existing[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO ratings (userId, messageId, rating) VALUES (?,?,?)`,
        [req.user.id, messageId, rating]
      );
    }
    return res.json({ message: 'Rating applied' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Rate a reply
router.post('/reply/:replyId', authRequired, async (req, res) => {
  const { replyId } = req.params;
  const { rating } = req.body; // 1 or -1
  if (![1, -1].includes(rating)) {
    return res.status(400).json({ message: 'Invalid rating' });
  }
  try {
    const [existing] = await pool.query(
      `SELECT id FROM ratings WHERE userId = ? AND replyId = ?`,
      [req.user.id, replyId]
    );
    if (existing.length > 0) {
      await pool.query(
        `UPDATE ratings SET rating = ? WHERE id = ?`,
        [rating, existing[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO ratings (userId, replyId, rating) VALUES (?,?,?)`,
        [req.user.id, replyId, rating]
      );
    }
    return res.json({ message: 'Rating applied' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Optional: Get total rating for a message or reply
router.get('/message/:messageId', authRequired, async (req, res) => {
  const { messageId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT SUM(rating) as totalRating FROM ratings WHERE messageId = ?',
      [messageId]
    );
    return res.json({ totalRating: rows[0].totalRating || 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

router.get('/reply/:replyId', authRequired, async (req, res) => {
  const { replyId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT SUM(rating) as totalRating FROM ratings WHERE replyId = ?',
      [replyId]
    );
    return res.json({ totalRating: rows[0].totalRating || 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
