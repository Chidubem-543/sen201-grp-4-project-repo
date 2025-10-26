const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        // Get admin user from database
        db.get(
            'SELECT * FROM admins WHERE username = ?',
            [username],
            async (err, admin) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                if (!admin) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // Verify password
                const validPassword = await bcrypt.compare(password, admin.password_hash);

                if (!validPassword) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // Generate JWT token
                const token = jwt.sign(
                    { id: admin.id, username: admin.username },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    message: 'Login successful',
                    token,
                    user: { id: admin.id, username: admin.username }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify token
router.get('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        res.json({ valid: true, user });
    });
});

module.exports = router;
