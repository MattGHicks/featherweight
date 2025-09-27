---
description: Handle database migrations with Prisma
argument-hint: [action] [name]
allowed-tools: Bash(npx prisma:*), Read(*), Write(*)
model: claude-3-5-sonnet-20241022
---

# Database Migration Command

This command handles Prisma database migrations for the Featherweight project.

## Usage

- `/db-migrate` - Shows migration status
- `/db-migrate create migration-name` - Creates a new migration
- `/db-migrate apply` - Applies pending migrations
- `/db-migrate reset` - Resets database and applies all migrations
- `/db-migrate rollback` - Rolls back the last migration

## Action: $1

```bash
if [ "$1" = "create" ]; then
  echo "Creating new migration: $2"
  npx prisma migrate dev --name "$2"
elif [ "$1" = "apply" ]; then
  echo "Applying pending migrations..."
  npx prisma migrate deploy
elif [ "$1" = "reset" ]; then
  echo "Resetting database and applying all migrations..."
  npx prisma migrate reset --force
elif [ "$1" = "rollback" ]; then
  echo "Rolling back last migration..."
  npx prisma migrate rollback
else
  echo "Checking migration status..."
  npx prisma migrate status
fi

echo "Generating Prisma client..."
npx prisma generate
```

Migration completed! Remember to:

- Review the generated migration files
- Test your changes thoroughly
- Update your team about schema changes
