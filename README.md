# BRACU Oracle

[![Discord](https://dcbadge.limes.pink/api/server/Tzcmjnq699)](https://discord.gg/Tzcmjnq699)

BRACU Oracle is a comprehensive academic management platform designed specifically for BRAC University students. It aims to streamline the course registration process, provide real-time information, and enhance the overall academic experience.

![BRACU Oracle Preview](https://i.imgur.com/zORJ7QM.png)

## Table of Contents

- [BRACU Oracle](#bracu-oracle)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Clone and Install Dependencies](#1-clone-and-install-dependencies)
    - [2. Environment Setup](#2-environment-setup)
    - [3. Database Setup](#3-database-setup)
    - [4. Start Development Server](#4-start-development-server)
    - [5. Additional Database Commands](#5-additional-database-commands)
    - [Authentication Notes](#authentication-notes)
    - [Troubleshooting](#troubleshooting)
  - [Development Status](#development-status)
  - [Learn More](#learn-more)
  - [Deploy on Vercel](#deploy-on-vercel)
  - [Contributing](#contributing)
    - [🚀 How to Contribute](#-how-to-contribute)
    - [📝 Commit Convention](#-commit-convention)
    - [🔗 Referencing Issues](#-referencing-issues)
    - [📋 Pull Request Process](#-pull-request-process)
    - [✅ Code Guidelines](#-code-guidelines)
    - [🐛 Reporting Issues](#-reporting-issues)
    - [📞 Getting Help](#-getting-help)
  - [License](#license)

## Key Features

- **PrePreReg**: Build your course routine effortlessly with intelligent scheduling based on live data
- **Live Seat Status**: Real-time updates on course seat availability
- **Course Swap Platform**: Centralized system for course swapping between students
- **Faculty Review System**: Structured platform for faculty ratings and feedback
- **Course Directory**: Comprehensive repository of academic resources and materials

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js with Google OAuth
- **UI Components**: Radix UI, shadcn/ui
- **Package Manager**: npm

## Getting Started

Follow these steps to get the project running locally:

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- npm
- A Supabase account (for the database)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd boracle
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory and add the following environment variables:

```env
# Supabase PostgreSQL Connection
# Get these from your Supabase dashboard > Settings > Database
DATABASE_URL=postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Or use individual variables:
# DB_HOST=aws-0-[region].pooler.supabase.com
# DB_PORT=6543
# DB_USER=postgres.[project-ref]
# DB_PASS=your-password
# DB_NAME=postgres

# NextAuth Configuration
AUTH_SECRET=your-auth-secret-here
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

**Generate your AUTH_SECRET:**
```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (Git Bash recommended)
openssl rand -base64 32

# Alternative: Online generator
# Visit: https://generate-secret.vercel.app/32
```

**Setting up Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env` file

### 3. Database Setup

**For new Supabase projects**, push the schema directly to your database:

```bash
# Push schema to your Supabase database (first time setup)
npm run db:push

# (Optional) Seed the database with sample data
npm run db:seed
```

**For development with migrations:**

```bash
# Generate migration files
npm run db:generate

# Run migrations to set up database schema
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 5. Additional Database Commands

```bash
# Open Drizzle Studio (database GUI)
npm run db:studio

# Push schema changes to database (recommended for Supabase)
npm run db:push

# Pull schema from existing database
npm run db:pull
```

### Authentication Notes

- The application only allows BRAC University email addresses (@g.bracu.ac.bd)
- You'll need to set up a Google OAuth application and configure the credentials in your environment variables
- Make sure to set up your Supabase project and get the database connection details from your Supabase dashboard

### Troubleshooting

**Database Connection Issues:**
- Make sure your Supabase project is active and accessible
- Verify your database credentials in the `.env` file
- Check your Supabase dashboard for correct connection details
- Ensure your database URL includes the correct project reference and region
- Try using `npm run db:studio` to test database connectivity

**Authentication Issues:**
- Ensure your Google OAuth app is properly configured
- Generate a secure random string for `NEXTAUTH_SECRET`

## Development Status

All major features are currently under development. Features marked with 🟡 are coming soon.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Contributing

We welcome contributions to BRACU Oracle! Please follow these guidelines to ensure a smooth contribution process.

### 🚀 How to Contribute

1. **Comment on the Issue First**
   - Before working on any issue, comment on it to let others know you're interested
   - Wait for maintainer approval before starting work
   - This helps avoid duplicate work and ensures alignment with project goals

2. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/your-username/boracle.git
   cd boracle
   npm install
   ```

3. **Create a Feature Branch**
   ```bash
   # Create and switch to a new branch for your feature/fix
   git checkout -b feature/your-feature-name
   # or for bug fixes
   git checkout -b fix/issue-description
   ```

### 📝 Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Your commit messages should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```bash
git commit -m "feat: add course swap filtering functionality"
git commit -m "fix: resolve authentication redirect issue"
git commit -m "docs: update API documentation for routine endpoints"
git commit -m "chore: update dependencies to latest versions"
```

### 🔗 Referencing Issues

- **Always reference the issue number** in your commit messages and PR description
- Use keywords to automatically close issues when your PR is merged

**Examples:**
```bash
git commit -m "feat: add real-time seat updates (closes #123)"
git commit -m "fix: resolve login redirect bug (fixes #456)"
```


### 📋 Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Test your changes**
   ```bash
   npm run dev  # Test locally
   npm run build  # Ensure build works
   ```

3. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference the issue number in the description
   - Provide a detailed description of changes made
   - Add screenshots if applicable (UI changes)

**PR Title Examples:**
```
feat: Add course swap filtering system (#123)
fix: Resolve authentication redirect issue (#456)
docs: Update contributing guidelines (#789)
```

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Changes Made
- [ ] Added feature X
- [ ] Fixed bug Y
- [ ] Updated documentation Z

## Screenshots (if applicable)
Add screenshots here
```

### ✅ Code Guidelines

- Follow existing code style and formatting
- Write meaningful variable and function names
- Add comments for complex logic
- Ensure your code works with the existing authentication system (BRACU emails only)

### 🐛 Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/environment information
- Screenshots if applicable

### 📞 Getting Help

- Join our [Discord Server](https://discord.gg/Tzcmjnq699)
- Check existing issues and discussions
- Feel free to ask questions in issue comments

Thank you for contributing to BRACU Oracle! 🎓

## License

This project is licensed under the MIT License.
