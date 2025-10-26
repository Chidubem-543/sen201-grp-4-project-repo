# Accessible Content Platform

An inclusive web platform designed for users with disabilities, featuring full WCAG compliance, text-to-speech functionality, and comprehensive accessibility features.

## Features

### Accessibility Features
- ✅ **Screen Reader Support**: Full compatibility with JAWS, NVDA, and VoiceOver
- ✅ **Text-to-Speech**: Web Speech API integration for all content
- ✅ **Keyboard Navigation**: Complete keyboard-only navigation support
- ✅ **Alt Text**: Descriptive alternative text for all images
- ✅ **Captions**: Support for video captions and transcripts
- ✅ **WCAG 2.1 AA Compliant**: Meets Web Content Accessibility Guidelines
- ✅ **Responsive Design**: Mobile-friendly across all devices
- ✅ **High Contrast**: Support for high contrast modes

### Functional Features
- Secure admin authentication and content management
- Add, edit, and delete content through admin panel
- User-friendly contact and support information
- Fast load times (3-5 seconds on standard connections)

## Project Structure

```
accessible-content-platform/
├── public/           # Frontend HTML, CSS, JS
├── server/           # Backend Node.js/Express server
├── admin/            # Admin panel interface
├── database/         # SQLite database and schema
├── package.json      # Project dependencies
└── README.md         # This file
```

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with required environment variables:
   ```
   JWT_SECRET=your_secret_key_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=your_bcrypt_hash_here
   PORT=3000
   ```

3. Initialize the database:
   ```
   node database/init.js
   ```

4. Start the server:
   ```
   npm start
   ```
   
   Or for development with auto-reload:
   ```
   npm run dev
   ```

## Admin Panel

Access the admin panel at `/admin` to manage content. Default credentials should be changed immediately after first login.

## Deployment Requirements

- **Uptime**: Host on reliable server with 99% uptime guarantee
- **Backups**: Schedule regular automated backups
- **Security**: Use HTTPS, secure authentication, and regular security updates
- **Training**: Ensure administrators are trained on accessibility features

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Screen readers: JAWS, NVDA, VoiceOver

## Compliance

This platform is designed to meet:
- WCAG 2.1 Level AA standards
- Section 508 compliance
- ADA (Americans with Disabilities Act) requirements

## Support

For accessibility issues or support, contact the administrator through the contact page.

## License

MIT License
