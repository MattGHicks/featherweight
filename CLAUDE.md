# Featherweight - Claude Code Configuration

## Project Overview

Featherweight is a modern gear management web application for ultralight backpackers, inspired by Lighterpack but with enhanced features and integrations.

**Key References:**

- See [INITIAL.md](./INITIAL.md) for detailed user stories and technical requirements
- See [PRD.md](./PRD.md) for complete product specifications and business requirements
- **Current implementation status**: Frontend foundation and sitemap complete (December 2024)
- **Next steps**: Database setup, API implementation, and core business logic

## Tech Stack

- **Frontend**: Next.js 14+, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand (when needed)
- **API**: Next.js API routes with tRPC
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel

## Code Style Guidelines

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use const assertions for arrays and objects when appropriate
- Always type component props and return types

### React Components

- Use functional components with hooks
- Prefer named exports over default exports
- Use React.FC type for components only when children are explicitly used
- Keep components small and focused (max 200 lines)
- Use custom hooks for complex state logic

### File Structure

```
src/
├── app/                 # Next.js 13+ app directory
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── features/       # Feature-specific components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── stores/             # Zustand stores
└── styles/             # Global styles
```

### Naming Conventions

- Components: PascalCase (e.g., `GearItemCard.tsx`)
- Files/Folders: kebab-case (e.g., `gear-item-card.tsx`)
- Variables/Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Database tables: snake_case

### Component Patterns

```typescript
// Component with props interface
interface GearItemProps {
  item: GearItem;
  onEdit: (id: string) => void;
}

export function GearItem({ item, onEdit }: GearItemProps) {
  // Component logic
}

// Custom hook pattern
export function useGearItems() {
  const [items, setItems] = useState<GearItem[]>([]);
  // Hook logic
  return { items, setItems };
}
```

## Commands

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript checks
npm test             # Run Jest tests
npm run test:e2e     # Run Playwright tests
```

**⚠️ CRITICAL: Development Server Port Requirement**

The development server MUST run on port 3000 (http://localhost:3000) because:

- NextAuth.js callbacks are configured for port 3000
- OAuth providers (Google, GitHub) have redirect URIs set to port 3000
- Email authentication magic links point to port 3000

If port 3000 is in use:

1. Find and kill the process: `lsof -i :3000` then `kill -9 <PID>`
2. Ensure no other development servers are running
3. Start with `npm run dev` to verify it uses port 3000

### Database

```bash
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Create and apply migration
npx prisma studio    # Open Prisma Studio
npx prisma db seed   # Seed database
```

### Deployment

```bash
npm run build        # Build production
npm run start        # Test production build locally
```

## Testing Strategy

- Unit tests for utilities and custom hooks
- Component tests for UI components
- Integration tests for API routes
- E2E tests for critical user flows
- Aim for 80%+ code coverage on core business logic

## Git Workflow

- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Create feature branches from main: `feature/gear-management`
- Use pull requests for all changes
- Squash merge into main branch

## Security Guidelines

- Never commit environment variables or secrets
- Use environment variables for all configuration
- Validate all user inputs
- Sanitize data before database operations
- Use HTTPS in production

## Performance Guidelines

- Use Next.js Image component for all images
- Implement proper loading states
- Use React.memo for expensive components
- Optimize bundle size with dynamic imports
- Use server-side rendering where appropriate

## Claude Code Specific Notes

- **⚠️ CRITICAL**: Always ensure development server runs on port 3000 (authentication will fail on other ports)
- Run `npm run lint && npm run type-check` before marking tasks complete
- Use visual mockups when implementing UI components
- Prefer editing existing files over creating new ones
- Break complex features into smaller, testable components
- Use the TodoWrite tool to track progress on multi-step tasks

## Claude Code Agents & Commands

This project includes custom agents and slash commands for efficient development workflows.

### Custom Slash Commands

Located in `.claude/commands/`, these commands automate common tasks:

#### Database Management

- **`/db-migrate [action] [name]`** - Handle Prisma migrations
  - `/db-migrate` - Check migration status
  - `/db-migrate create migration-name` - Create new migration
  - `/db-migrate apply` - Apply pending migrations
  - `/db-migrate reset` - Reset database completely

- **`/db-reset`** - Reset development database with fresh seed data

#### Feature Development

- **`/new-component ComponentName [directory]`** - Create new React component
  - Follows project conventions with TypeScript interfaces
  - Auto-generates proper file structure and imports

- **`/add-gear-feature FeatureName [description]`** - Add complete gear feature
  - Creates database schema updates
  - Implements API endpoints
  - Builds frontend components

- **`/add-list-feature FeatureName [description]`** - Add pack list feature
  - Implements weight calculations
  - Creates sharing and export functionality
  - Builds analytics components

#### Testing & Quality

- **`/test-all`** - Run complete test suite
  - Linting, type checking, unit tests, E2E tests, build verification

- **`/fix-quality`** - Auto-fix code quality issues
  - Prettier formatting, ESLint fixes, import organization

#### Deployment

- **`/prepare-deploy`** - Comprehensive deployment preparation
  - Code quality verification, security audit, environment checks

### Specialized Sub-Agents

Located in `.claude/agents/`, these agents handle specific domains:

#### Database Agent (`database-agent.md`)

- **Specialization**: PostgreSQL schema design, Prisma operations, data modeling
- **Use for**: Database migrations, query optimization, schema changes
- **Tools**: Prisma CLI, schema design, seed data management

#### API Agent (`api-agent.md`)

- **Specialization**: Next.js API routes, authentication, business logic
- **Use for**: Creating endpoints, authentication flows, data validation
- **Tools**: Next.js App Router, NextAuth.js, Zod validation

#### UI/UX Agent (`ui-agent.md`)

- **Specialization**: React components, responsive design, accessibility
- **Use for**: Component development, user interfaces, design system
- **Tools**: shadcn/ui, Tailwind CSS, React Hook Form

#### Testing Agent (`testing-agent.md`)

- **Specialization**: Comprehensive testing strategies, quality assurance
- **Use for**: Unit tests, integration tests, E2E testing, performance
- **Tools**: Jest, React Testing Library, Playwright

#### Analytics Agent (`analytics-agent.md`)

- **Specialization**: Weight calculations, data visualization, exports
- **Use for**: Charts, weight analytics, goal tracking, report generation
- **Tools**: Chart libraries, calculation algorithms, export functionality

### Agent Usage Patterns

#### Parallel Development

Use multiple agents simultaneously for complex features:

```
- Database Agent: Update schema for new feature
- API Agent: Create corresponding endpoints
- UI Agent: Build frontend components
- Testing Agent: Add comprehensive test coverage
```

#### Sequential Workflows

For step-by-step feature development:

```
1. Database Agent: Design schema
2. API Agent: Implement backend logic
3. UI Agent: Create user interface
4. Analytics Agent: Add calculations/charts
5. Testing Agent: Verify everything works
```

## Model Context Protocol (MCP) Servers

This project is configured with MCP servers to enhance development workflow with Claude Code.

### Configured MCP Servers

Located in `~/.config/claude-desktop/claude_desktop_config.json`:

#### PostgreSQL MCP (`postgres`)

- **Purpose**: Direct database operations without CLI commands
- **Features**: Schema inspection, query execution, data exploration
- **Connection**: `postgresql://localhost:5432/featherweight_dev`
- **Use for**: Database queries, schema analysis, data debugging

#### Filesystem MCP (`filesystem`)

- **Purpose**: Enhanced file operations and codebase navigation
- **Scope**: `/Users/matt/Documents/My Coding Projects/featherweight`
- **Features**: Fast file search, bulk operations, directory analysis
- **Use for**: Large-scale refactoring, file management, code organization

#### Git MCP (`git`)

- **Purpose**: Streamlined version control operations
- **Repository**: Current project directory
- **Features**: Branch management, commit analysis, history exploration
- **Use for**: Version control, commit tracking, branch operations

#### Prettier MCP (`prettier`)

- **Purpose**: Direct code formatting without npm scripts
- **Features**: Fast formatting, configuration detection, file processing
- **Use for**: Code formatting, style consistency, cleanup operations

### MCP Usage Guidelines

- **Database Operations**: Use PostgreSQL MCP for direct database queries and schema inspection
- **File Management**: Use Filesystem MCP for complex file operations across the codebase
- **Version Control**: Use Git MCP for sophisticated git operations and history analysis
- **Code Formatting**: Use Prettier MCP for quick formatting without npm overhead

### Setup Instructions

#### For Claude Desktop

1. Configuration located at `~/.config/claude-desktop/claude_desktop_config.json`
2. Restart Claude Desktop after configuration changes
3. Verify MCP servers are loaded

#### For Claude Code CLI

1. **Project-level configuration**: `.mcp.json` (shared with team)
2. **Import from Desktop**: Run `claude mcp import` to use existing Claude Desktop configuration
3. **Direct setup**: MCPs are automatically detected from `.mcp.json` in project root
4. **Environment setup**: Ensure PostgreSQL is running locally for database MCP

#### Verification Steps

1. Test database connection with PostgreSQL MCP
2. Confirm filesystem access with project directory
3. Verify git operations work correctly
4. Test code formatting with Prettier MCP

## Feature Flags

Use environment variables for feature flags:

- `ENABLE_RETAILER_INTEGRATION`: Enable/disable retailer API features
- `ENABLE_COMMUNITY_FEATURES`: Enable/disable community sharing features

## Implementation Status

### ✅ Completed (September 2024)

#### Frontend Foundation & Sitemap

- **Landing Page**: Modern hero section with features showcase and CTAs
- **Authentication Pages**: Login/signup with OAuth integration points
- **Main Application Routes**: Complete sitemap with all core pages
  - Dashboard with stats overview and quick actions
  - Gear library management (`/gear`, `/gear/new`)
  - Pack lists management (`/lists`, `/lists/new`)
  - Analytics page for weight tracking
  - Settings with tabbed interface
- **Navigation System**: Responsive header with mobile/desktop navigation
- **Mobile Navigation**: Slide-out sheet with full navigation menu
- **Component Library**: All shadcn/ui components configured and styled
- **Responsive Design**: Mobile-first design working across all devices
- **Build System**: Successfully building and running on development server

#### Database & API Foundation ✅ COMPLETE

- **Database Schema**: Complete Prisma models for users, gear, categories, pack lists
- **Database Setup**: PostgreSQL with Prisma ORM, seeded with ultralight categories
- **API Routes**: Full REST API implementation with authentication
  - Gear management endpoints (`/api/gear/*`)
  - Pack list management endpoints (`/api/pack-lists/*`)
  - Category endpoints (`/api/categories`)
- **Data Validation**: Zod schemas for type-safe API endpoints
- **Authentication API**: NextAuth.js API routes configured

#### Authentication System ✅ COMPLETE

- **NextAuth.js Setup**: Full authentication system with multiple providers
- **Email Authentication**: Magic link authentication via SMTP
- **OAuth Providers**: Google and GitHub OAuth fully configured
- **User Registration**: Automatic user creation on first sign-in
- **Session Management**: JWT-based sessions with proper user data
- **Protected Routes**: Dashboard and authenticated areas properly secured
- **User Experience**: Loading states, redirects, error handling

#### Technical Implementation

- **Next.js 15+ App Router**: Modern routing with layouts and nested routes
- **TypeScript**: Full type safety across all components and APIs
- **Tailwind CSS v4**: CSS-first approach with design tokens
- **Authentication**: Complete NextAuth.js implementation with multi-provider support
- **Development Environment**: Local development server running on port 3000
- **API Security**: User ownership verification, input validation, error handling

#### Frontend Integration ✅ COMPLETE (December 2024)

- **Dashboard Integration**: Connected to real API with user statistics, gear counts, and pack list metrics
- **Gear Management UI**: Full CRUD operations connected to API endpoints
  - Table view with responsive design and mobile card layout
  - Sortable columns (name, category, weight, quantity, total weight, date)
  - Advanced filtering (search, category, type filters with visual badges)
  - Edit functionality with modal dialog and form validation
  - Delete functionality with confirmation prompts
  - View mode toggle (table/grid)
- **Pack List UI**: Connected pack list pages to API with weight calculations
- **Real-time Updates**: Optimistic updates and proper loading states
- **Error Handling**: User-friendly error messages and recovery
- **Mobile Optimization**: Responsive design with separate mobile layouts

### 🔄 Next Steps (Priority Order)

#### Phase 1: Enhanced User Experience ⚡ NEXT UP

1. **User Settings**: Connect settings page to user preferences API
2. **Weight Analytics**: Charts and visualizations for weight distribution
3. **Sharing & Export**: Public pack lists, CSV/PDF export functionality
4. **Image Upload**: Gear photo upload and management

#### Phase 2: Enhanced User Experience

1. **Real-time Updates**: Optimistic updates and loading states
2. **Form Validation**: Client-side validation with server sync
3. **Error Handling**: User-friendly error messages and recovery
4. **Search & Filtering**: Advanced search across gear and pack lists

#### Phase 3: Enhanced Features

1. **Weight Analytics**: Charts and visualizations for weight distribution
2. **Sharing & Export**: Public pack lists, CSV/PDF export functionality
3. **Search & Filtering**: Advanced search across gear and pack lists
4. **Image Upload**: Gear photo upload and management

### 📂 Current File Structure

```
src/
├── app/                     # ✅ Complete - All routes implemented
│   ├── api/                 # ✅ Complete REST API implementation
│   │   ├── auth/            # ✅ NextAuth.js authentication endpoints
│   │   ├── gear/            # ✅ Gear CRUD endpoints with user auth
│   │   ├── pack-lists/      # ✅ Pack list & item management endpoints
│   │   └── categories/      # ✅ Category listing endpoint
│   ├── dashboard/           # ✅ Dashboard overview page (ready for API integration)
│   ├── gear/               # ✅ Gear management pages (ready for API integration)
│   ├── lists/              # ✅ Pack list management pages (ready for API integration)
│   ├── analytics/          # ✅ Weight analytics page (ready for API integration)
│   ├── settings/           # ✅ User settings page (ready for API integration)
│   ├── login/              # ✅ Authentication pages - fully functional
│   └── signup/             # ✅ Authentication pages - fully functional
├── components/             # ✅ Complete component library
│   ├── ui/                 # ✅ shadcn/ui components
│   ├── layout/             # ✅ Navigation and layout components with auth
│   ├── providers/          # ✅ Session provider for authentication
│   ├── gear/               # 🔄 Placeholder components (ready for API integration)
│   └── pack-lists/         # 🔄 Placeholder components (ready for API integration)
├── lib/                    # ✅ Utility functions and configurations
│   ├── auth.ts             # ✅ NextAuth.js configuration with multi-provider
│   ├── prisma.ts           # ✅ Database client configuration
│   └── utils.ts            # ✅ General utility functions
└── types/                  # ✅ TypeScript type definitions
```

```
prisma/
├── schema.prisma           # ✅ Complete database schema
└── seed.ts                 # ✅ Database seeding with categories
```

### 🚀 Deployment Status

- **Development**: ✅ Running successfully on localhost:3000
- **Build Process**: ✅ Successfully building with no errors
- **Type Checking**: ✅ All TypeScript types valid
- **Linting**: ✅ No ESLint warnings or errors
- **Database**: ✅ PostgreSQL connected with seeded data
- **Authentication**: ✅ Email, Google, and GitHub OAuth configured and working
- **API**: ✅ Complete REST API with authentication and validation
- **Production Ready**: ✅ Frontend integration complete, ready for deployment
- **Gear Management**: ✅ Full CRUD operations with responsive table/grid views
- **Edit Functionality**: ✅ Modal-based editing with form validation and error handling

### 🔧 Quick Start Guide

1. **Clone and Install**:

   ```bash
   npm install
   ```

2. **Database Setup**:

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. **Authentication Setup**:
   - Configure OAuth providers (see `AUTH_SETUP.md`)
   - Set up email SMTP (see `AUTH_SETUP.md`)
   - Update `.env.local` with your credentials

4. **Start Development**:

   ```bash
   npm run dev
   ```

5. **Access Application**:
   - Frontend: `http://localhost:3000`
   - Database Studio: `npx prisma studio`

## API Documentation

### Authentication

All API endpoints (except `/api/auth/*` and `/api/categories`) require authentication via NextAuth.js session.

### Endpoints Overview

#### Categories

- `GET /api/categories` - List all gear categories

#### Gear Management

- `GET /api/gear` - List user's gear items (supports `?categoryId=` filter)
- `POST /api/gear` - Create new gear item
- `GET /api/gear/[id]` - Get specific gear item
- `PATCH /api/gear/[id]` - Update gear item
- `DELETE /api/gear/[id]` - Delete gear item

#### Pack Lists

- `GET /api/pack-lists` - List user's pack lists with stats
- `POST /api/pack-lists` - Create new pack list
- `GET /api/pack-lists/[id]` - Get pack list with items (supports public sharing)
- `PATCH /api/pack-lists/[id]` - Update pack list
- `DELETE /api/pack-lists/[id]` - Delete pack list

#### Pack List Items

- `POST /api/pack-lists/[id]/items` - Add gear item to pack list
- `PATCH /api/pack-lists/[id]/items/[itemId]` - Update pack list item
- `DELETE /api/pack-lists/[id]/items/[itemId]` - Remove item from pack list

### Data Models

#### GearItem

```typescript
{
  id: string
  name: string
  description?: string
  weight: number // in grams
  quantity: number
  categoryId: string
  imageUrl?: string
  isWorn: boolean
  isConsumable: boolean
  retailerUrl?: string
}
```

#### PackList

```typescript
{
  id: string
  name: string
  description?: string
  isPublic: boolean
  shareSlug?: string
  items: PackListItem[]
  stats: {
    totalWeight: number
    baseWeight: number
    itemCount: number
  }
}
```

#### PackListItem

```typescript
{
  id: string;
  gearItemId: string;
  quantity: number;
  isIncluded: boolean;
  gearItem: GearItem;
}
```

### Weight Calculations

- **Total Weight**: Sum of all included items (worn + consumable + base weight)
- **Base Weight**: Sum of included items excluding worn and consumable items
- All weights stored and calculated in grams

## Repository Etiquette

- Keep commits focused and atomic
- Write descriptive commit messages
- Update documentation when adding features
- Add tests for new functionality
- Review code before merging
