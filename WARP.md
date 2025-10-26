# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Initialize/reset database
node database/init.js
```

### Database Operations
- Database file: `database/accessible_platform.db`
- Schema is auto-created on first run via `database/db.js`
- To reset: delete the `.db` file and run `node database/init.js`

### Environment Setup
Required `.env` variables:
```
JWT_SECRET=your_secret_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt_hash
PORT=3000
NODE_ENV=development
```

Default admin credentials (must change immediately):
- Username: `admin`
- Password: `admin123`

## Architecture

### Stack
- **Backend**: Node.js + Express.js
- **Database**: SQLite3 with three tables: `admins`, `content`, `contact_messages`
- **Auth**: JWT-based with bcrypt password hashing
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)

### Directory Structure
```
├── server/
│   ├── index.js              # Express app entry point
│   ├── middleware/auth.js    # JWT authentication middleware
│   └── routes/               # API routes (auth, content, contact)
├── database/
│   ├── db.js                 # SQLite connection & schema initialization
│   ├── init.js               # Seed default admin & sample content
│   └── accessible_platform.db # SQLite database file
├── public/                    # Public website files
│   ├── index.html
│   ├── accessibility.js      # TTS, font controls, high contrast
│   └── app.js                # Main frontend app logic
└── admin/                     # Admin panel interface
```

### API Architecture
All API routes are prefixed with `/api`:
- `/api/auth` - Login/authentication (POST `/api/auth/login`)
- `/api/content` - CRUD operations for content
  - GET `/api/content` - Public: list all content
  - GET `/api/content/:id` - Public: get single content
  - POST/PUT/DELETE - Protected: requires JWT token
- `/api/contact` - Contact form submissions

### Authentication Flow
1. Admin logs in via `/api/auth/login` with username/password
2. Server validates credentials (bcrypt comparison) and returns JWT
3. Client stores JWT and includes in `Authorization: Bearer <token>` header
4. `authenticateToken` middleware validates JWT for protected routes
5. JWT contains `{ username, id }` payload

### Accessibility Features Implementation
The platform's core functionality is built around accessibility:

**Frontend (`public/accessibility.js`)**:
- Web Speech API integration for text-to-speech
- localStorage persistence for user preferences (TTS, font size, high contrast)
- Keyboard shortcuts: Ctrl+T (TTS), Ctrl+H (high contrast), Ctrl+/- (font size)
- Screen reader announcements via aria-live regions
- Click-to-read functionality on elements with `.tts-content` class

**WCAG Compliance**:
- All content requires `alt_text` field for images
- Semantic HTML structure expected
- Keyboard navigation support throughout
- Skip links for main content navigation

## Development Notes

### Database Schema
```sql
-- admins: id, username, password_hash, email, created_at
-- content: id, title, body, alt_text, category, created_at, updated_at
-- contact_messages: id, name, email, message, created_at, read
```

### Content Categories
Standard categories: `general`, `features`, `news`, `help`

### Security Considerations
- Always change default admin credentials in production
- JWT_SECRET must be strong (32+ characters) in production
- HTTPS required for production deployment
- Password hashing uses bcrypt with salt rounds = 10

### No Test Framework
This project does not include automated tests. Manual testing required.

### Deployment
- PM2 recommended for process management: `pm2 start server/index.js --name accessible-platform`
- See DEPLOYMENT.md for platform-specific instructions (Heroku, DigitalOcean, AWS)
- Regular database backups essential (see DEPLOYMENT.md backup script)
- Uptime monitoring recommended (99% uptime target)

## Key Files to Understand

1. **server/index.js** - Express app setup, middleware registration, route mounting
2. **database/db.js** - Database connection + table creation logic
3. **server/middleware/auth.js** - JWT token verification for protected routes
4. **public/accessibility.js** - Core accessibility feature implementations
5. **server/routes/content.js** - Content CRUD with public/private route distinction
