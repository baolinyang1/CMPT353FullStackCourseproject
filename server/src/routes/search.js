// server/src/routes/search.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authRequired } = require('../middlewares/authMiddleware');

// Search for messages or replies containing a string
router.get('/', authRequired, async (req, res) => {
  const { query, byUser, stats } = req.query;
  
  try {
    if (query) {
      // Search text in messages + replies
      const [messages] = await pool.query(
        `SELECT 'message' as type, m.id, m.content, u.displayName, m.createdAt
         FROM messages m
         JOIN users u ON m.userId = u.id
         WHERE m.content LIKE ?`,
        [`%${query}%`]
      );
      const [replies] = await pool.query(
        `SELECT 'reply' as type, r.id, r.content, u.displayName, r.createdAt
         FROM replies r
         JOIN users u ON r.userId = u.id
         WHERE r.content LIKE ?`,
        [`%${query}%`]
      );
      return res.json([...messages, ...replies]);
    }
    
    if (byUser) {
      // All messages and replies by a specific user
      const [userContent] = await pool.query(
        `SELECT 'message' as type, m.id, m.content, m.createdAt
           FROM messages m
           JOIN users u ON m.userId = u.id
          WHERE u.username = ?
         UNION
         SELECT 'reply' as type, r.id, r.content, r.createdAt
           FROM replies r
           JOIN users u ON r.userId = u.id
          WHERE u.username = ?`,
        [byUser, byUser]
      );
      return res.json(userContent);
    }

    if (stats === 'mostLeastPosts') {
      // Return user with the most posts and the least posts
      // messages + replies combined
      const [rows] = await pool.query(
        `SELECT u.username, COUNT(m.id) as totalMessages,
                (SELECT COUNT(r.id) FROM replies r WHERE r.userId = u.id) as totalReplies
         FROM users u
         LEFT JOIN messages m ON m.userId = u.id
         GROUP BY u.id
         ORDER BY (COUNT(m.id) + (SELECT COUNT(rr.id) FROM replies rr WHERE rr.userId = u.id)) DESC`
      );
      // Then figure out who has the most vs least from the array
      if (rows.length === 0) {
        return res.json({ most: null, least: null });
      }
      const combined = rows.map((r) => ({
        username: r.username,
        totalPosts: r.totalMessages + r.totalReplies
      }));
      combined.sort((a, b) => b.totalPosts - a.totalPosts);
      const most = combined[0];
      const least = combined[combined.length - 1];
      return res.json({ most, least });
    }

    if (stats === 'highestLowestRank') {
      // sum of ratings for a user's messages and replies
      const [rows] = await pool.query(`
        SELECT u.id, u.username,
               COALESCE(SUM(r.rating), 0) as totalRating
        FROM users u
        LEFT JOIN messages m ON m.userId = u.id
        LEFT JOIN ratings r ON r.messageId = m.id
        GROUP BY u.id
      `);
      // But we also need to add ratings on replies
      for (let row of rows) {
        const [replyRatings] = await pool.query(`
          SELECT COALESCE(SUM(rating), 0) as totalReplyRating
          FROM replies rep
          JOIN ratings r2 ON r2.replyId = rep.id
          WHERE rep.userId = ?
        `, [row.id]);
        row.totalRating += (replyRatings[0].totalReplyRating || 0);
      }
      rows.sort((a,b) => b.totalRating - a.totalRating);
      const highest = rows[0];
      const lowest = rows[rows.length - 1];
      return res.json({ highest, lowest });
    }

    // If no recognized parameter, just return empty
    return res.json([]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
