# Featherweight 🎒

A modern gear management application for ultralight backpackers. Track your gear weight, create optimized pack lists, and achieve your base weight goals.

**Current Status**: ✅ **Backend Complete** - Full API, authentication, and database ready. Frontend integration next!

## ✨ Features

### 🎯 **Implemented & Working**

- **Full Authentication System**: Email magic links, Google & GitHub OAuth with automatic user registration
- **Complete REST API**: Gear management, pack lists, weight calculations with user security
- **Database Schema**: PostgreSQL with Prisma ORM, seeded with ultralight categories
- **Modern UI Foundation**: Beautiful responsive design with shadcn/ui components
- **Type Safety**: Full TypeScript coverage across frontend and backend

### 🔄 **Ready for Frontend Integration**

- **Gear Management**: CRUD operations for gear items with categories and weight tracking
- **Smart Pack Lists**: Create trip-specific lists with real-time weight calculations
- **Weight Analytics**: Base weight vs total weight calculations, statistics dashboard
- **Public Sharing**: Shareable pack lists with unique URLs
- **User Settings**: Preferences, units, base weight goals

## 🚀 Tech Stack

- **Frontend**: Next.js 15+, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with email + OAuth (Google, GitHub)
- **API**: REST endpoints with Zod validation and user authorization
- **Development**: ESLint, Prettier, Husky for code quality

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm/npm/yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/featherweight.git
   cd featherweight
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.local.example .env.local
   ```

   Update the following variables in `.env.local`:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/featherweight_dev"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations (when you have a database)
   npx prisma migrate dev

   # Seed default categories
   npx prisma db seed
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                 # Next.js 13+ app directory
│   ├── api/            # API routes
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── layout/        # Layout components
│   ├── gear/          # Gear-specific components
│   └── auth/          # Authentication components
├── lib/               # Utility functions
│   ├── auth.ts        # NextAuth configuration
│   ├── prisma.ts      # Database client
│   └── utils.ts       # Helper functions
├── types/             # TypeScript definitions
└── hooks/             # Custom React hooks

prisma/
├── schema.prisma      # Database schema
└── seed.ts           # Database seeding
```

## 🗃️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and preferences
- **Categories**: Gear categorization (Shelter, Sleep System, etc.)
- **GearItems**: Individual gear pieces with weight and metadata
- **PackLists**: Trip-specific gear collections
- **PackListItems**: Many-to-many relationship between lists and gear

## 🎯 Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript checks
npm run format       # Format code with Prettier

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma db seed   # Seed database
```

### Git Workflow

The project uses conventional commits and automated code quality checks:

- **Pre-commit hooks**: Lint and format code automatically
- **Commit format**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- **Branch protection**: All changes should go through pull requests

## 📋 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📖 Documentation

- [Product Requirements Document](./PRD.md) - Complete feature specifications
- [Claude Code Configuration](./CLAUDE.md) - Development guidelines and conventions
- [Initial Feature Request](./INITIAL.md) - Detailed user stories and requirements

## 🎨 Design System

The application uses a consistent design system built on:

- **Colors**: Tailwind CSS color palette with category-specific colors
- **Typography**: Geist font family for optimal readability
- **Components**: shadcn/ui for consistent, accessible components
- **Icons**: Lucide React for comprehensive iconography
- **Responsive**: Mobile-first design with breakpoints at 768px and 1024px

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on every push to main

### Manual Deployment

```bash
npm run build
npm run start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Lighterpack](https://lighterpack.com) for inspiration
- [shadcn/ui](https://ui.shadcn.com) for the excellent component library
- The ultralight backpacking community for valuable feedback and insights

---

**Happy trails! 🥾**
