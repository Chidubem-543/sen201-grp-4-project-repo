const bcrypt = require('bcrypt');
const db = require('./db');

// Default admin credentials (CHANGE IN PRODUCTION!)
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123'; // Change this immediately!

async function initializeDatabase() {
    console.log('Initializing database with default admin user...');

    try {
        // Check if admin already exists
        db.get('SELECT * FROM admins WHERE username = ?', [DEFAULT_USERNAME], async (err, row) => {
            if (err) {
                console.error('Error checking for admin:', err);
                return;
            }

            if (row) {
                console.log('Admin user already exists');
                process.exit(0);
            } else {
                // Create default admin
                const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

                db.run(
                    'INSERT INTO admins (username, password_hash, email) VALUES (?, ?, ?)',
                    [DEFAULT_USERNAME, passwordHash, 'admin@example.com'],
                    function(err) {
                        if (err) {
                            console.error('Error creating admin:', err);
                        } else {
                            console.log('✅ Default admin user created successfully');
                            console.log('Username:', DEFAULT_USERNAME);
                            console.log('Password:', DEFAULT_PASSWORD);
                            console.log('⚠️  IMPORTANT: Change the default password immediately!');
                        }
                        process.exit(0);
                    }
                );
            }
        });

        // Add some sample content
        setTimeout(() => {
            db.get('SELECT COUNT(*) as count FROM content', [], (err, row) => {
                if (err) {
                    console.error('Error checking content:', err);
                    return;
                }

                if (row.count === 0) {
                    const sampleContent = [
                        {
                            title: 'Welcome to Accessibility',
                            body: 'This platform demonstrates best practices in web accessibility, including WCAG 2.1 compliance, screen reader support, and keyboard navigation.',
                            alt_text: 'Accessible web design illustration',
                            category: 'general'
                        },
                        {
                            title: 'Text-to-Speech Feature',
                            body: 'Our text-to-speech feature allows users to listen to content instead of reading it. Simply enable the feature and click on any text to hear it read aloud.',
                            alt_text: 'Text-to-speech icon',
                            category: 'features'
                        }
                    ];

                    sampleContent.forEach(content => {
                        db.run(
                            'INSERT INTO content (title, body, alt_text, category) VALUES (?, ?, ?, ?)',
                            [content.title, content.body, content.alt_text, content.category],
                            (err) => {
                                if (err) {
                                    console.error('Error adding sample content:', err);
                                } else {
                                    console.log(`✅ Added sample content: ${content.title}`);
                                }
                            }
                        );
                    });
                }
            });
        }, 500);

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run initialization
initializeDatabase();
