---
description: Add a new pack list management feature with full-stack implementation
argument-hint: <feature-name> [description]
allowed-tools: Write(*), Read(*), Edit(*), Bash(npx prisma:*)
model: claude-3-5-sonnet-20241022
---

# Add Pack List Feature Command

Creates a complete pack list management feature with database, API, and frontend components.

## Usage

- `/add-list-feature FeatureName` - Creates complete feature
- `/add-list-feature FeatureName "Description of the feature"` - With description

## Feature: $1

## Description: $2

I'll create a complete pack list feature including:

### 1. Database Layer

- Update Prisma schema for pack list enhancements
- Create migration for new fields/relationships
- Update TypeScript types for pack lists

### 2. API Layer

- Create/update API routes in `src/app/api/lists/`
- Implement pack list operations (CRUD, sharing, cloning)
- Add weight calculation logic
- Include proper validation and error handling

### 3. Frontend Layer

- Create pack list specific components
- Implement drag-and-drop functionality
- Add weight analytics and visualizations
- Create sharing and export interfaces
- Implement real-time weight calculations

### 4. Weight Analytics

- Add category breakdown calculations
- Implement weight goal tracking
- Create visual charts and progress indicators
- Add comparison features

### 5. Sharing & Export

- Implement public/private list settings
- Create shareable URLs with custom slugs
- Add export functionality (CSV, PDF, Markdown)
- Implement list cloning features

The implementation will focus on:

- Real-time weight calculations
- Intuitive drag-and-drop UX
- Visual weight analytics
- Efficient data handling
- Responsive design for mobile use

After implementation, I'll provide usage examples and suggest performance optimizations.
