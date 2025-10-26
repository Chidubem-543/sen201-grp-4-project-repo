const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all content (public)
router.get('/', (req, res) => {
    db.all('SELECT * FROM content ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Get single content by ID (public)
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM content WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Content not found' });
        }
        res.json(row);
    });
});

// Create new content (admin only)
router.post('/', authenticateToken, (req, res) => {
    const { title, body, alt_text, category } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: 'Title and body required' });
    }

    db.run(
        'INSERT INTO content (title, body, alt_text, category) VALUES (?, ?, ?, ?)',
        [title, body, alt_text || '', category || 'general'],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({
                id: this.lastID,
                message: 'Content created successfully'
            });
        }
    );
});

// Update content (admin only)
router.put('/:id', authenticateToken, (req, res) => {
    const { title, body, alt_text, category } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: 'Title and body required' });
    }

    db.run(
        'UPDATE content SET title = ?, body = ?, alt_text = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, body, alt_text || '', category || 'general', req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }
            res.json({ message: 'Content updated successfully' });
        }
    );
});

// Delete content (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM content WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }
        res.json({ message: 'Content deleted successfully' });
    });
});

module.exports = router;
