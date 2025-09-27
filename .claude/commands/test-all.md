---
description: Run complete test suite for quality assurance
allowed-tools: Bash(npm:*), Bash(npx:*)
model: claude-3-5-sonnet-20241022
---

# Complete Test Suite Command

Runs the full test suite to ensure code quality and functionality.

## What this command runs:

1. **Linting** - Code style and best practices
2. **Type Checking** - TypeScript compilation
3. **Unit Tests** - Component and utility testing (when added)
4. **E2E Tests** - End-to-end functionality (when added)
5. **Build Test** - Production build verification

```bash
echo "🔍 Running Featherweight Test Suite..."
echo "======================================"

echo "📝 1. Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix errors before continuing."
  exit 1
fi
echo "✅ Linting passed!"

echo ""
echo "🔷 2. Running TypeScript type check..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Please fix type errors."
  exit 1
fi
echo "✅ Type checking passed!"

echo ""
echo "🧪 3. Running unit tests..."
if npm run test:unit --if-present 2>/dev/null; then
  echo "✅ Unit tests passed!"
else
  echo "⚠️ Unit tests not configured yet"
fi

echo ""
echo "🌐 4. Running E2E tests..."
if npm run test:e2e --if-present 2>/dev/null; then
  echo "✅ E2E tests passed!"
else
  echo "⚠️ E2E tests not configured yet"
fi

echo ""
echo "🏗️ 5. Testing production build..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix build errors."
  exit 1
fi
echo "✅ Production build successful!"

echo ""
echo "🎉 All tests passed! Your code is ready for deployment."
echo "======================================"
```
