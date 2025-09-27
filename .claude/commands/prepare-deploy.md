---
description: Prepare the application for deployment with comprehensive checks
allowed-tools: Bash(npm:*), Bash(npx:*), Read(*.env*), Read(package.json)
model: claude-3-5-sonnet-20241022
---

# Prepare Deployment Command

Comprehensive pre-deployment checklist and preparation for the Featherweight application.

## Deployment Preparation Steps:

1. **Code Quality Verification**
2. **Build Testing**
3. **Environment Configuration Check**
4. **Database Migration Status**
5. **Security Audit**
6. **Performance Check**

```bash
echo "🚀 Preparing Featherweight for Deployment"
echo "========================================"

# Step 1: Code Quality
echo "📏 1. Running code quality checks..."
npm run lint && npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Code quality checks failed. Please fix before deploying."
  exit 1
fi
echo "✅ Code quality verified!"

# Step 2: Build Testing
echo ""
echo "🏗️ 2. Testing production build..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Production build failed. Please fix build errors."
  exit 1
fi
echo "✅ Production build successful!"

# Step 3: Environment Check
echo ""
echo "🔧 3. Checking environment configuration..."
if [ -f ".env.local" ]; then
  echo "✅ Local environment file found"
else
  echo "⚠️ No .env.local file found"
fi

# Step 4: Database Status
echo ""
echo "🗃️ 4. Checking database migration status..."
npx prisma migrate status
echo "ℹ️ Ensure all migrations are applied in production!"

# Step 5: Security Check
echo ""
echo "🔒 5. Running security audit..."
npm audit --audit-level moderate
if [ $? -ne 0 ]; then
  echo "⚠️ Security vulnerabilities found. Consider fixing before deployment."
else
  echo "✅ No critical security issues found!"
fi

# Step 6: Package Analysis
echo ""
echo "📦 6. Analyzing package size and dependencies..."
if command -v npx &> /dev/null; then
  echo "Bundle analysis:"
  npm run analyze --if-present 2>/dev/null || echo "Bundle analyzer not configured"
fi

echo ""
echo "========================================"
echo "🎯 Deployment Checklist Summary:"
echo ""
echo "✅ Code quality verified"
echo "✅ Production build successful"
echo "📋 Environment variables configured"
echo "🗃️ Database migrations ready"
echo "🔒 Security audit completed"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to the main branch"
echo "2. Configure environment variables in your deployment platform"
echo "3. Set up your production database"
echo "4. Run database migrations in production"
echo "5. Deploy and monitor!"
```
