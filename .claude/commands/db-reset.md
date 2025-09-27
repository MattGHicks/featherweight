---
description: Reset database for development with fresh seed data
allowed-tools: Bash(npx prisma:*), Bash(npm:*)
model: claude-3-5-sonnet-20241022
---

# Database Reset Command

This command completely resets the development database and seeds it with fresh data.

⚠️ **WARNING**: This will delete all existing data in your database!

## What this command does:

1. Resets the database schema
2. Applies all migrations
3. Seeds default categories
4. Generates fresh Prisma client

```bash
echo "🗃️ Resetting database..."
npx prisma migrate reset --force

echo "🌱 Seeding database with default categories..."
npx prisma db seed

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "✅ Database reset complete!"
echo ""
echo "Your database now has:"
echo "- Fresh schema with all migrations applied"
echo "- 14 default gear categories seeded"
echo "- Clean state for development"
```

🎯 Your development database is now ready with fresh seed data!
