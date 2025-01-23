# Managed IT
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

## Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [Blitz.js](https://blitzjs.com/) - Fullstack React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Prisma](https://www.prisma.io/) - Database ORM
- [MySQL](https://www.mysql.com/) - Database
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [React-PDF](https://react-pdf.org/) - PDF Generation

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

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Documentation

See [INSTALL.md](INSTALL.md) for detailed installation and configuration instructions.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact us at support@cds.id

## Acknowledgments

- [Blitz.js](https://blitzjs.com/) community
- All our contributors

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
---
Built with ❤️ by [CDS](https://ciptadusa.com)
