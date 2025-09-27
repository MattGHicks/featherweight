---
description: Automatically fix code quality issues
allowed-tools: Bash(npm:*), Bash(npx:*)
model: claude-3-5-sonnet-20241022
---

# Fix Code Quality Command

Automatically fixes common code quality issues in the Featherweight project.

## What this command fixes:

1. **Code Formatting** - Prettier auto-formatting
2. **Linting Issues** - Auto-fixable ESLint errors
3. **Import Organization** - Sort and organize imports
4. **File Formatting** - Consistent line endings and spacing

```bash
echo "🔧 Fixing code quality issues..."
echo "======================================"

echo "🎨 1. Running Prettier to format code..."
npm run format
echo "✅ Code formatting complete!"

echo ""
echo "📏 2. Auto-fixing ESLint issues..."
npm run lint:fix
echo "✅ ESLint auto-fixes applied!"

echo ""
echo "🔍 3. Checking for remaining issues..."
echo "Running final lint check..."
npm run lint
LINT_EXIT=$?

echo ""
echo "🔷 Running TypeScript check..."
npm run type-check
TYPE_EXIT=$?

echo ""
echo "======================================"
if [ $LINT_EXIT -eq 0 ] && [ $TYPE_EXIT -eq 0 ]; then
  echo "🎉 All quality issues fixed! Code is ready."
else
  echo "⚠️ Some issues remain that require manual attention:"
  if [ $LINT_EXIT -ne 0 ]; then
    echo "  - Linting errors need manual fixes"
  fi
  if [ $TYPE_EXIT -ne 0 ]; then
    echo "  - TypeScript errors need manual fixes"
  fi
  echo ""
  echo "Please review and fix the remaining issues."
fi
```

💡 **Tip**: Run this command before committing to ensure consistent code quality!
