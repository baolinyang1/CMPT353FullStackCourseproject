// server/src/routes/channels.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authRequired, adminRequired } = require('../middlewares/authMiddleware');

router.get('/', authRequired, async (req, res) => {
  try {
    const [channels] = await pool.query('SELECT * FROM channels');
    return res.json(channels);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', authRequired, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Channel name required' });

  try {
    await pool.query(
      'INSERT INTO channels (name, description, createdBy) VALUES (?,?,?)',
      [name, description || '', req.user.id]
    );
    return res.status(201).json({ message: 'Channel created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/:channelId', authRequired, adminRequired, async (req, res) => {
  const { channelId } = req.params;
  try {
    await pool.query('DELETE FROM channels WHERE id = ?', [channelId]);
    return res.json({ message: 'Channel deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
