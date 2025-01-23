# Managed IT Installation Guide

This guide will help you install and set up the Managed IT application.

## Prerequisites

- Node.js 16+
- MySQL 8+
- Git

## Step 1: Clone and Install Dependencies

1. Clone the repository:
```bash
git clone https://github.com/cds-id/managed-it
cd managed-it
```

2. Install dependencies:
```bash
npm install
```

## Step 2: Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE managed_it;
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Update the DATABASE_URL in .env with your MySQL credentials:
```
DATABASE_URL="mysql://username:password@localhost:3306/managed_it"
```

## Step 3: Run Database Migrations

```bash
npm run db:migrate
```

## Step 4: (Optional) Seed Initial Data

```bash
npm run db:seed
```

## Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Default Admin Credentials

Email: admin@example.com
Password: Password123!

## Additional Configuration

### Upload Provider

The app supports two upload providers:
1. Local filesystem (default)
2. Alibaba Cloud OSS

To configure the upload provider, update the following in .env:

```env
# Upload Configuration
UPLOAD_PROVIDER=local # or 'oss'

# Local Upload Configuration
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_PUBLIC_PATH=/uploads

# OSS Configuration (if using OSS)
OSS_REGION=your-region
OSS_ACCESS_KEY_ID=your-key-id
OSS_ACCESS_KEY_SECRET=your-key-secret
OSS_BUCKET=your-bucket
```

### Company Information

Update company details in .env:

```env
COMPANY_NAME="Your Company Name"
COMPANY_ADDRESS="Your Company Address"
COMPANY_PHONE="+1234567890"
COMPANY_EMAIL="contact@yourcompany.com"
```

### Report Language

Set default report language:

```env
REPORT_LANGUAGE=ID # or EN
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Default Admin Credentials

After running database seed, you can login with:

- **Email:** admin@managed-it.com
- **Password:** admin123!

⚠️ **Important Security Notice:**
1. These are default credentials for initial setup only
2. Change the password immediately after first login
3. In production, remove or modify seed data for security
