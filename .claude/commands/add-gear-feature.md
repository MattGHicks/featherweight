---
description: Add a new gear management feature with full-stack implementation
argument-hint: <feature-name> [description]
allowed-tools: Write(*), Read(*), Edit(*), Bash(npx prisma:*)
model: claude-3-5-sonnet-20241022
---

# Add Gear Feature Command

Creates a complete gear management feature with database, API, and frontend components.

## Usage

- `/add-gear-feature FeatureName` - Creates complete feature
- `/add-gear-feature FeatureName "Description of the feature"` - With description

## Feature: $1

## Description: $2

I'll create a complete gear feature including:

### 1. Database Layer

- Update Prisma schema if needed
- Create migration for new fields/tables
- Update TypeScript types

### 2. API Layer

- Create API route in `src/app/api/gear/`
- Implement CRUD operations
- Add proper error handling and validation
- Include authentication checks

### 3. Frontend Layer

- Create feature-specific components
- Add forms with react-hook-form + zod validation
- Implement UI components with shadcn/ui
- Add proper loading states and error handling

### 4. Types & Utilities

- Update TypeScript interfaces
- Add utility functions if needed
- Update existing types for compatibility

The implementation will follow our project conventions:

- TypeScript strict mode
- Proper error handling
- Consistent styling with shadcn/ui
- Responsive design
- Accessibility compliance

After implementation, I'll also suggest testing approaches and provide usage examples.
