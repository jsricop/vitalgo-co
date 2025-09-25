# VitalGo Scripts

This directory contains automation scripts for the VitalGo project.

## smart-commit.sh

Automates the complete commit process with documentation review and security checks.

### Features

✅ **Documentation Review**: Automatically checks `/docs` files for modifications
✅ **Security Scanning**: Detects sensitive information (passwords, API keys, tokens, etc.)
✅ **Auto .gitignore**: Automatically adds sensitive files to .gitignore
✅ **Smart Commit Messages**: Generates intelligent commit messages based on changes
✅ **GitHub Integration**: Pushes changes to GitHub with confirmation

### Usage

```bash
# Interactive mode (recommended for manual use)
./scripts/smart-commit.sh

# Auto mode (for CI/CD or automated workflows)
./scripts/smart-commit.sh --auto

# Custom commit message
./scripts/smart-commit.sh --message "feat(auth): implement OAuth2 integration"

# Help
./scripts/smart-commit.sh --help
```

### Process Flow

1. **📖 Documentation Review**
   - Scans all `.md` files in `/docs`
   - Reports modification status
   - Identifies new documentation files

2. **🔐 Security Check**
   - Scans for sensitive patterns:
     - Passwords and secrets
     - API keys and tokens
     - Database URLs
     - Private keys
     - JWT secrets
     - AWS credentials

3. **📝 .gitignore Update**
   - Automatically adds sensitive files to .gitignore
   - Never deletes existing entries
   - Prevents accidental commits of secrets

4. **💭 Commit Message Generation**
   - Analyzes changed files
   - Suggests commit type (`feat`, `fix`, `docs`, `refactor`)
   - Identifies scope based on modified slices
   - Follows conventional commit format

5. **🚀 GitHub Deployment**
   - Stages appropriate files
   - Creates commit with proper formatting
   - Pushes to origin remote
   - Provides deployment summary

### Security Features

- **Pattern Detection**: Uses regex patterns to identify sensitive data
- **Safe Staging**: Automatically unstages files with sensitive content
- **Gitignore Protection**: Adds sensitive files to .gitignore before commit
- **Never Delete**: Only adds to .gitignore, never removes existing entries

### Examples

```bash
# Example output
🚀 VitalGo Smart Commit Process
==================================================

📖 Step 1: Reviewing documentation for latest changes...
  ✅ BRAND.md - Up to date
  📝 DB.md - Modified (needs review)
  📄 New documentation files found: docs/API_GUIDE.md

🔐 Step 2: Scanning for sensitive information...
  ⚠️  Found passwords in .env.local
  + Adding .env.local to .gitignore

💭 Step 3: Generating commit message...
Suggested: feat(auth,dashboard): implement changes and update documentation

📦 Step 4: Staging files and creating commit...
Files to be committed:
  M  frontend/src/slices/auth/components/LoginForm.tsx
  A  docs/API_GUIDE.md

🚀 Step 5: Deploying to GitHub...
Pushing to origin/main...

🎉 Successfully deployed to GitHub!
Summary:
  • Files committed: 15
  • Commit hash: a1b2c3d
  • Branch: main
  • Sensitive files protected: 1
  • .gitignore updated: 1 entries
  • Status: Deployed ✅
```

### Integration with Development Workflow

This script is designed to be used instead of manual git commands for commits:

```bash
# Instead of:
git add .
git commit -m "some message"
git push

# Use:
./scripts/smart-commit.sh
```

### Requirements

- Git repository with remote origin
- Bash 4.0+ (macOS/Linux)
- Standard Unix tools (grep, sed, cut)

### Error Handling

The script includes comprehensive error handling:
- Exits on any command failure (`set -e`)
- Validates git repository status
- Checks for remote origin
- Confirms sensitive file detection
- Provides clear error messages with colors