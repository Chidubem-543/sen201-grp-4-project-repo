# Deployment Checklist

## Pre-Deployment

### Security
- [ ] Change default admin credentials (username: `admin`, password: `admin123`)
- [ ] Generate strong JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Update JWT_SECRET in `.env` file
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Remove or secure `.env` file (ensure it's not committed to git)
- [ ] Verify `.gitignore` includes `.env` and `database/*.db`

### Database
- [ ] Verify database initialization: `node database/init.js`
- [ ] Test database connection
- [ ] Set up automated backup script (see DEPLOYMENT.md)
- [ ] Configure backup retention policy

### Testing
- [ ] Test server startup: `npm start`
- [ ] Access frontend: http://localhost:3000
- [ ] Access admin panel: http://localhost:3000/admin
- [ ] Test login with default credentials
- [ ] Test content creation, editing, deletion
- [ ] Test contact form submission
- [ ] Test accessibility features (TTS, high contrast, font controls)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test with screen readers (JAWS, NVDA, VoiceOver)

## Deployment Steps

### Environment Setup
- [ ] Install Node.js (v14+) on production server
- [ ] Install PM2: `npm install -g pm2`
- [ ] Clone repository to production server
- [ ] Run `npm install --production`
- [ ] Copy `.env.example` to `.env` and configure production values

### Web Server Configuration
- [ ] Install and configure Nginx or Apache as reverse proxy
- [ ] Set up SSL/TLS certificate (Let's Encrypt recommended)
- [ ] Configure HTTPS redirect (HTTP → HTTPS)
- [ ] Set up firewall rules (allow ports 80, 443)
- [ ] Configure proper file permissions

### Application Deployment
- [ ] Initialize database: `node database/init.js`
- [ ] Start application: `pm2 start server/index.js --name accessible-platform`
- [ ] Save PM2 process list: `pm2 save`
- [ ] Configure PM2 startup: `pm2 startup`
- [ ] Test application accessibility

### Monitoring & Maintenance
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error logging
- [ ] Set up log rotation
- [ ] Schedule automated backups (cron job)
- [ ] Configure alerts for downtime/errors
- [ ] Document recovery procedures

## Post-Deployment

### Immediate Actions
- [ ] **CRITICAL**: Change default admin password immediately
- [ ] Test all functionality in production
- [ ] Verify HTTPS is working correctly
- [ ] Test from multiple devices/browsers
- [ ] Verify accessibility features work in production

### Documentation
- [ ] Document production server credentials (securely)
- [ ] Document backup locations and procedures
- [ ] Document rollback procedures
- [ ] Train administrators (see ADMIN_GUIDE.md)

### Performance
- [ ] Run accessibility audit (Lighthouse, axe DevTools)
- [ ] Test page load times (target: 3-5 seconds)
- [ ] Verify WCAG 2.1 AA compliance
- [ ] Test under expected load

## Maintenance Schedule

### Daily
- [ ] Check uptime monitoring alerts
- [ ] Review error logs

### Weekly
- [ ] Verify backups are running
- [ ] Test backup restoration
- [ ] Review application logs
- [ ] Check disk space

### Monthly
- [ ] Security updates: `npm audit` and `npm update`
- [ ] Test all functionality
- [ ] Review and rotate logs
- [ ] Performance review

### Quarterly
- [ ] Full security audit
- [ ] Accessibility compliance review
- [ ] Disaster recovery drill
- [ ] Update documentation

## Emergency Contacts
- System Administrator: [contact info]
- Hosting Provider Support: [contact info]
- Development Team: [contact info]

## Rollback Procedure
If deployment fails:
1. Stop PM2: `pm2 stop accessible-platform`
2. Restore previous database backup
3. Checkout previous git commit: `git checkout <previous-commit>`
4. Restart: `pm2 restart accessible-platform`
5. Verify functionality
6. Notify stakeholders

## Useful Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs accessible-platform

# Restart application
pm2 restart accessible-platform

# Stop application
pm2 stop accessible-platform

# Database backup
cp database/accessible_platform.db backups/backup_$(date +%Y%m%d_%H%M%S).db

# Check Node.js version
node --version

# Test server health
curl http://localhost:3000/api/health
```
