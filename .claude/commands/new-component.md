---
description: Create a new React component with TypeScript, following project conventions
argument-hint: <component-name> [directory]
allowed-tools: Write(*), Read(*), Bash(mkdir:*)
model: claude-3-5-sonnet-20241022
---

# New Component Command

Creates a new React component following Featherweight project conventions.

## Usage

- `/new-component ComponentName` - Creates component in src/components/
- `/new-component ComponentName ui` - Creates in src/components/ui/
- `/new-component ComponentName gear` - Creates in src/components/gear/

## Component: $1

## Directory: $2

I'll create a new React component with:

- TypeScript interface for props
- Proper naming conventions (PascalCase for component, kebab-case for file)
- shadcn/ui styling patterns
- Proper imports and exports
- JSDoc comments for documentation

Let me create the component file structure and implement the component following our project conventions.

The component will be created in:

- File: `src/components/${2:-""}/$1.tsx` (kebab-case filename)
- Export: Named export (not default)
- Props: TypeScript interface
- Styling: Tailwind CSS with shadcn/ui patterns

After creation, I'll:

1. Add proper TypeScript types
2. Include component props interface
3. Add JSDoc documentation
4. Follow project naming conventions
5. Include proper imports for shadcn/ui components
