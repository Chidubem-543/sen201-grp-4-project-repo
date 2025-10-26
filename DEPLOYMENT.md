# Deployment Guide

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git
- A hosting platform (e.g., Heroku, DigitalOcean, AWS, Azure)

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chidubem-543/sen201-grp-4-project-repo.git
   cd accessible-content-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the root directory:
   ```
   JWT_SECRET=your_very_secure_random_string_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=your_bcrypt_hash_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Initialize the database:**
   ```bash
   node database/init.js
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Production Deployment

### General Steps

1. **Set up your server:**
   - Ensure Node.js and npm are installed
   - Set up a process manager (PM2 recommended)

2. **Clone and configure:**
   ```bash
   git clone <your-repo-url>
   cd accessible-content-platform
   npm install --production
   ```

3. **Configure environment variables:**
   ```bash
   # Create .env file with production values
   JWT_SECRET=<strong-random-secret>
   PORT=3000
   NODE_ENV=production
   ```

4. **Initialize database:**
   ```bash
   node database/init.js
   ```

5. **Start with PM2:**
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name accessible-platform
   pm2 save
   pm2 startup
   ```

### Deployment Platforms

#### Heroku

1. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set NODE_ENV=production
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

#### DigitalOcean / VPS

1. Set up Ubuntu server
2. Install Node.js and npm
3. Clone repository
4. Set up Nginx as reverse proxy
5. Configure SSL with Let's Encrypt
6. Use PM2 for process management

#### AWS / Azure

Follow platform-specific documentation for deploying Node.js applications.

## Security Checklist

- [ ] Change default admin credentials immediately
- [ ] Use strong JWT secret (minimum 32 characters)
- [ ] Enable HTTPS (SSL/TLS certificate)
- [ ] Set NODE_ENV to 'production'
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Set up logging and monitoring

## Backup Strategy

### Database Backup

Create automated backup script:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"
DB_FILE="database/accessible_platform.db"

# Create backup
cp $DB_FILE "$BACKUP_DIR/backup_$DATE.db"

# Keep only last 30 backups
ls -t $BACKUP_DIR/backup_*.db | tail -n +31 | xargs rm -f

echo "Backup completed: backup_$DATE.db"
```

Schedule with cron (daily at 2 AM):
```bash
0 2 * * * /path/to/backup.sh
```

### File Backup

- Back up the entire project directory weekly
- Store backups off-site (cloud storage)
- Test restore procedures regularly

## Monitoring and Maintenance

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

Set up alerts for:
- Server downtime
- Response time > 5 seconds
- SSL certificate expiration

### Log Management

```bash
# View PM2 logs
pm2 logs accessible-platform

# View error logs
pm2 logs accessible-platform --err

# Clear logs
pm2 flush
```

### Performance Monitoring

Monitor:
- CPU usage
- Memory usage
- Disk space
- Response times
- Database performance

## Scaling Considerations

For high traffic:
1. Use a load balancer
2. Deploy multiple instances
3. Use a production database (PostgreSQL/MySQL)
4. Implement caching (Redis)
5. Use CDN for static assets

## Troubleshooting

### Server won't start
- Check Node.js version
- Verify all dependencies installed
- Check port availability
- Review error logs

### Database errors
- Verify database file permissions
- Check disk space
- Review database logs

### Authentication issues
- Verify JWT_SECRET is set
- Check token expiration
- Clear browser localStorage

## Support and Resources

- Project Repository: https://github.com/Chidubem-543/sen201-grp-4-project-repo
- Node.js Documentation: https://nodejs.org/docs/
- Express Documentation: https://expressjs.com/
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
