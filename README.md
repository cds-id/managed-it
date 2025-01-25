# Managed IT

<p align="center">
<img src="public/logo.png" alt="Managed IT Logo" width="200"/>
</p>

An open-source IT Service Management System built with Next.js, Blitz.js, and TypeScript.

## Features

- 👥 Client Management
- ✅ Task Tracking
- 🏃 Sprint Planning
- 📄 Automated Report Generation
- 👤 User Role Management
- 🔒 Secure Authentication
- 🌐 Multi-language Support (EN/ID)
- 📤 Flexible File Upload (Local/OSS)
- 📧 Daily Task Summary Emails
- ⏰ Automated Task Reminders

## Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [Blitz.js](https://blitzjs.com/) - Fullstack React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Prisma](https://www.prisma.io/) - Database ORM
- [MySQL](https://www.mysql.com/) - Database
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [React-PDF](https://react-pdf.org/) - PDF Generation
- [Nodemailer](https://nodemailer.com/) - Email Service
- [React-Email](https://react.email/) - Email Templates

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/cds-id/managed-it
cd managed-it
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file and configure:
```bash
cp .env.example .env
```

4. Configure email settings in .env:
```env
# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM="Managed IT <noreply@your-domain.com>"

# Cron Job Security
CRON_SECRET=your-secret-token
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Start development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Email Features

### Daily Task Summary

Administrators receive daily email summaries containing:
- Tasks due today
- Overdue tasks
- Tasks in progress
- Tasks completed today
- Upcoming deadlines

#### Testing Daily Summary

```bash
# Test the daily summary email manually
curl -X POST \
  http://localhost:3000/api/cron/daily-summary \
  -H "Authorization: Bearer your-cron-secret-here"
```

#### Setting up Automated Emails

1. Using crontab:
```bash
# Edit crontab
crontab -e

# Add this line to run daily at 9 AM
0 9 * * * curl -X POST -H "Authorization: Bearer your-cron-secret-here" http://your-domain/api/cron/daily-summary
```

2. Using Vercel Cron (add to vercel.json):
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-summary",
      "schedule": "0 9 * * *"
    }
  ]
}
```

## Documentation

See [INSTALL.md](INSTALL.md) for detailed installation and configuration instructions.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Default Credentials

After running database migrations and seed:

```bash
npm run db:migrate
npm run db:seed
```

You can login with these default credentials:

- **Email:** admin@managed-it.com
- **Password:** admin123!

⚠️ **Important:** Please change the default password immediately after first login.

## Environment Variables

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/managed_it"

# Authentication
SESSION_SECRET_KEY=your-secret-key

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM="Managed IT <noreply@your-domain.com>"

# Cron Jobs
CRON_SECRET=your-cron-secret

# File Upload
UPLOAD_PROVIDER=local # or 'oss' for Alibaba Cloud OSS

# Optional: OSS Configuration
OSS_REGION=your-region
OSS_ACCESS_KEY_ID=your-key
OSS_ACCESS_KEY_SECRET=your-secret
OSS_BUCKET=your-bucket

# Application
COMPANY_NAME="Your Company Name"
REPORT_LANGUAGE=EN # or 'ID' for Indonesian
```

## Support

For support, please open an issue in the GitHub repository or contact us at support@cds.id

## Acknowledgments

- [Blitz.js](https://blitzjs.com/) community
- [React-Email](https://react.email/) team
- All our contributors

---
Built with ❤️ by [CDS](https://ciptadusa.com)
