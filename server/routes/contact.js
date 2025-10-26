const express = require('express');
const db = require('../database/db');

const router = express.Router();

// Submit contact form
router.post('/', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    // Save to database
    db.run(
        'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to save message' });
            }

            res.status(201).json({
                message: 'Message received successfully',
                id: this.lastID
            });
        }
    );
});

// Get all contact messages (admin only - should add auth middleware in production)
router.get('/', (req, res) => {
    db.all(
        'SELECT * FROM contact_messages ORDER BY created_at DESC',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(rows);
        }
    );
});

module.exports = router;
