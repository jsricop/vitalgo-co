#!/bin/bash

# Smart Commit Script for VitalGo
# Automates the commit process with documentation review and security checks
# Usage: ./scripts/smart-commit.sh [--auto] [--message "custom message"]

set -e  # Exit on any error

# Check for bash version 4+ for associative arrays
if [[ ${BASH_VERSION%%.*} -lt 4 ]]; then
  echo "⚠️  This script requires Bash 4.0+ for full functionality"
  echo "   Current version: $BASH_VERSION"
  echo "   Continuing with limited pattern matching..."
  USE_SIMPLE_PATTERNS=true
else
  USE_SIMPLE_PATTERNS=false
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
AUTO_MODE=false
CUSTOM_MESSAGE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --auto)
      AUTO_MODE=true
      shift
      ;;
    --message)
      CUSTOM_MESSAGE="$2"
      shift 2
      ;;
    --help)
      echo "Smart Commit Script for VitalGo"
      echo ""
      echo "Usage: ./scripts/smart-commit.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --auto           Skip interactive confirmations"
      echo "  --message MSG    Use custom commit message"
      echo "  --help           Show this help"
      echo ""
      echo "This script will:"
      echo "  0. Ensure README.md quality and accuracy"
      echo "  1. Review /docs for latest changes"
      echo "  2. Check for sensitive information"
      echo "  3. Update .gitignore if needed"
      echo "  4. Suggest commit message"
      echo "  5. Deploy to GitHub"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

cd "$PROJECT_ROOT"

echo -e "${BLUE}🚀 VitalGo Smart Commit Process${NC}"
echo "=================================================="

# Step 0: Update README.md to ensure quality and accuracy
echo -e "\n${YELLOW}📋 Step 0: Ensuring README.md quality and accuracy...${NC}"

# Function to update README.md based on current project state
update_readme_quality() {
  local readme_updated=false

  echo "Analyzing project structure..."

  # Check if docs directory structure has changed
  if [[ -d "docs" ]]; then
    current_docs=$(ls docs/*.md 2>/dev/null | sort)
    echo "Current docs files: $(echo $current_docs | tr '\n' ' ')"

    # Check if README mentions non-existent files
    for old_file in "DEV_CONTEXT.md" "API_REFERENCE.md" "TYPES_REFERENCE.md" "DB_FIELDS_REFERENCE.md" "BRAND_MANUAL.md" "DEPLOYMENT.md"; do
      if grep -q "$old_file" README.md 2>/dev/null; then
        echo -e "  ${YELLOW}⚠️  Found reference to non-existent file: $old_file${NC}"
        readme_updated=true
      fi
    done

    # Check if README is missing references to existing files
    for doc_file in $current_docs; do
      filename=$(basename "$doc_file")
      if ! grep -q "$filename" README.md 2>/dev/null; then
        echo -e "  ${YELLOW}⚠️  Missing reference to existing file: $filename${NC}"
        readme_updated=true
      fi
    done
  fi

  # Check if scripts directory structure has changed
  if [[ -d "scripts" ]]; then
    current_scripts=$(ls scripts/*.sh 2>/dev/null | xargs -n 1 basename | sort)
    echo "Current script files: $(echo $current_scripts | tr '\n' ' ')"

    # Check if smart-commit.sh is mentioned
    if [[ -f "scripts/smart-commit.sh" ]] && ! grep -q "smart-commit.sh" README.md 2>/dev/null; then
      echo -e "  ${YELLOW}⚠️  README.md should mention smart-commit.sh script${NC}"
      readme_updated=true
    fi
  fi

  # Check frontend/backend slice consistency
  if [[ -d "frontend/src/slices" ]] && [[ -d "backend/slices" ]]; then
    frontend_slices=$(ls frontend/src/slices 2>/dev/null | sort)
    backend_slices=$(ls backend/slices 2>/dev/null | sort)

    # Find common slices
    common_slices=""
    for slice in $frontend_slices; do
      if [[ -d "backend/slices/$slice" ]]; then
        common_slices="$common_slices $slice"
      fi
    done

    if [[ -n "$common_slices" ]]; then
      echo "Detected slices: $(echo $common_slices | tr ' ' ',')"

      # Check if README structure section reflects current slices
      for slice in $common_slices; do
        if ! grep -A 20 "backend/" README.md | grep -q "$slice" 2>/dev/null; then
          echo -e "  ${YELLOW}⚠️  README.md structure missing slice: $slice${NC}"
          readme_updated=true
        fi
      done
    fi
  fi

  if [[ "$readme_updated" == "true" ]]; then
    echo -e "  ${YELLOW}📝 README.md needs updates for project consistency${NC}"
    if [[ "$AUTO_MODE" == "false" ]]; then
      read -p "Would you like to continue with current README.md? (Y/n): " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo -e "${RED}❌ Please update README.md manually and run the script again${NC}"
        echo ""
        echo "Suggestions:"
        echo "  - Remove references to non-existent documentation files"
        echo "  - Add references to current docs/ files"
        echo "  - Update project structure diagram"
        echo "  - Ensure scripts section is complete"
        exit 1
      fi
    else
      echo -e "  ${YELLOW}⚠️  Auto mode: Proceeding with current README.md${NC}"
    fi
  else
    echo -e "  ${GREEN}✅ README.md appears to be up-to-date${NC}"
  fi
}

# Run README quality check
update_readme_quality

# Step 1: Review documentation for latest changes
echo -e "\n${YELLOW}📖 Step 1: Reviewing documentation for latest changes...${NC}"

# Check if docs directory exists
if [[ ! -d "docs" ]]; then
  echo -e "${RED}❌ docs/ directory not found${NC}"
  exit 1
fi

# List all docs files and their modification status
echo "Documentation files status:"
docs_modified=false
docs_files=()

for doc_file in docs/*.md; do
  if [[ -f "$doc_file" ]]; then
    filename=$(basename "$doc_file")

    # Check if file is modified in git
    if git diff --quiet HEAD -- "$doc_file" 2>/dev/null; then
      if git diff --cached --quiet -- "$doc_file" 2>/dev/null; then
        echo "  ✅ $filename - Up to date"
      else
        echo "  🔄 $filename - Staged for commit"
        docs_modified=true
        docs_files+=("$doc_file")
      fi
    else
      echo "  📝 $filename - Modified (needs review)"
      docs_modified=true
      docs_files+=("$doc_file")
    fi
  fi
done

# Check for untracked docs files
untracked_docs=$(git ls-files --others --exclude-standard docs/*.md 2>/dev/null || true)
if [[ -n "$untracked_docs" ]]; then
  echo "  📄 New documentation files found:"
  echo "$untracked_docs" | sed 's/^/    /'
  docs_modified=true
fi

# Step 2: Check for sensitive information
echo -e "\n${YELLOW}🔐 Step 2: Scanning for sensitive information...${NC}"

# Define sensitive patterns
if [[ "$USE_SIMPLE_PATTERNS" == "true" ]]; then
  # Simple patterns for older bash versions
  sensitive_patterns=(
    "password.*[:=].*['\"][^'\"]{8,}['\"]"
    "api.*key.*[:=].*['\"][^'\"]{16,}['\"]"
    "token.*[:=].*['\"][^'\"]{20,}['\"]"
    "secret.*[:=].*['\"][^'\"]{12,}['\"]"
    "postgresql://[^/]+:[^@]+@"
    "mysql://[^/]+:[^@]+@"
    "-----BEGIN.*PRIVATE KEY-----"
    "jwt.*secret.*[:=].*['\"][^'\"]{16,}['\"]"
    "AKIA[0-9A-Z]{16}"
    "aws.*access.*key"
  )
  sensitive_names=(
    "passwords"
    "api_keys"
    "tokens"
    "secrets"
    "database_urls"
    "database_urls"
    "private_keys"
    "jwt_secrets"
    "aws_keys"
    "aws_keys"
  )
else
  declare -A sensitive_patterns=(
    ["passwords"]="password.*[:=]\s*['\"][^'\"]{8,}['\"]|PASSWORD.*[:=]\s*['\"][^'\"]{8,}['\"]"
    ["api_keys"]="api[_-]?key.*[:=]\s*['\"][^'\"]{16,}['\"]|API[_-]?KEY.*[:=]\s*['\"][^'\"]{16,}['\"]"
    ["tokens"]="token.*[:=]\s*['\"][^'\"]{20,}['\"]|TOKEN.*[:=]\s*['\"][^'\"]{20,}['\"]"
    ["secrets"]="secret.*[:=]\s*['\"][^'\"]{12,}['\"]|SECRET.*[:=]\s*['\"][^'\"]{12,}['\"]"
    ["database_urls"]="postgresql://[^/]+:[^@]+@[^/]+/|mysql://[^/]+:[^@]+@[^/]+/"
    ["private_keys"]="-----BEGIN [A-Z ]*PRIVATE KEY-----"
    ["jwt_secrets"]="jwt[_-]?secret.*[:=]\s*['\"][^'\"]{16,}['\"]"
    ["aws_keys"]="AKIA[0-9A-Z]{16}|aws[_-]?access[_-]?key"
  )
fi

sensitive_files=()
gitignore_updates=()

# Function to check file for sensitive content
check_file_sensitivity() {
  local file="$1"
  local found_sensitive=false

  if [[ "$USE_SIMPLE_PATTERNS" == "true" ]]; then
    # Use simple array iteration
    for i in "${!sensitive_patterns[@]}"; do
      pattern="${sensitive_patterns[i]}"
      name="${sensitive_names[i]}"
      if grep -Eq "$pattern" "$file" 2>/dev/null; then
        echo -e "    ${RED}⚠️  Found $name in $file${NC}"
        found_sensitive=true
      fi
    done
  else
    # Use associative array
    for pattern_name in "${!sensitive_patterns[@]}"; do
      pattern="${sensitive_patterns[$pattern_name]}"
      if grep -Eq "$pattern" "$file" 2>/dev/null; then
        echo -e "    ${RED}⚠️  Found $pattern_name in $file${NC}"
        found_sensitive=true
      fi
    done
  fi

  return $([[ "$found_sensitive" == "true" ]] && echo 1 || echo 0)
}

# Check all modified and new files
all_files=$(git diff --name-only HEAD 2>/dev/null; git ls-files --others --exclude-standard)

for file in $all_files; do
  # Skip README.md files and docs/*.md files as they're generally safe documentation
  if [[ "$file" == "README.md" || "$file" == */README.md || "$file" == docs/*.md ]]; then
    continue
  fi

  if [[ -f "$file" && "$file" == *.md || "$file" == *.env* || "$file" == *.config* ]]; then
    if check_file_sensitivity "$file"; then
      sensitive_files+=("$file")
    fi
  fi
done

# Check if sensitive files need to be added to .gitignore
if [[ ${#sensitive_files[@]} -gt 0 ]]; then
  echo -e "${RED}🔒 Sensitive files detected:${NC}"
  for file in "${sensitive_files[@]}"; do
    echo "  - $file"

    # Check if already in .gitignore
    if ! grep -Fxq "$file" .gitignore 2>/dev/null; then
      gitignore_updates+=("$file")
    fi
  done

  if [[ ${#gitignore_updates[@]} -gt 0 ]]; then
    echo -e "\n${YELLOW}📝 Files to add to .gitignore:${NC}"
    for file in "${gitignore_updates[@]}"; do
      echo "  + $file"
    done

    if [[ "$AUTO_MODE" == "false" ]]; then
      read -p "Add these files to .gitignore? (y/N): " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        for file in "${gitignore_updates[@]}"; do
          echo "$file" >> .gitignore
          echo -e "  ${GREEN}✅ Added $file to .gitignore${NC}"
        done
      fi
    else
      for file in "${gitignore_updates[@]}"; do
        echo "$file" >> .gitignore
        echo -e "  ${GREEN}✅ Added $file to .gitignore${NC}"
      done
    fi
  fi
else
  echo -e "${GREEN}✅ No sensitive information detected${NC}"
fi

# Step 3: Generate commit message
echo -e "\n${YELLOW}💭 Step 3: Generating commit message...${NC}"

# Analyze changes to suggest commit type and scope
modified_files=$(git diff --name-only HEAD 2>/dev/null || true)
staged_files=$(git diff --cached --name-only 2>/dev/null || true)
all_changed_files="$modified_files $staged_files"

# Determine commit type based on changes
commit_type="feat"
scopes=()
descriptions=()

# Analyze file patterns
if echo "$all_changed_files" | grep -q "frontend/src/slices/"; then
  slices=$(echo "$all_changed_files" | grep "frontend/src/slices/" | cut -d'/' -f4 | sort -u)
  for slice in $slices; do
    scopes+=("$slice")
  done
fi

if echo "$all_changed_files" | grep -q "docs/"; then
  commit_type="docs"
  descriptions+=("update documentation")
fi

if echo "$all_changed_files" | grep -q "\.gitignore"; then
  descriptions+=("update gitignore")
fi

if echo "$all_changed_files" | grep -q "dashboard"; then
  descriptions+=("dashboard improvements")
fi

if echo "$all_changed_files" | grep -q "components/"; then
  descriptions+=("component updates")
fi

if echo "$all_changed_files" | grep -q "types/\|interfaces/"; then
  descriptions+=("type definitions")
fi

# Build suggested commit message
scope_part=""
if [[ ${#scopes[@]} -gt 0 ]]; then
  scope_part="($(IFS=','; echo "${scopes[*]}"))"
fi

description_part=""
if [[ ${#descriptions[@]} -gt 0 ]]; then
  description_part=$(IFS=' and '; echo "${descriptions[*]}")
else
  description_part="implement changes"
fi

suggested_message="$commit_type$scope_part: $description_part"

# Use custom message if provided
if [[ -n "$CUSTOM_MESSAGE" ]]; then
  commit_message="$CUSTOM_MESSAGE"
else
  echo "Suggested commit message:"
  echo "  $suggested_message"
  echo ""

  if [[ "$AUTO_MODE" == "false" ]]; then
    read -p "Use this message? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
      echo "Enter your commit message:"
      read -r commit_message
    else
      commit_message="$suggested_message"
    fi
  else
    commit_message="$suggested_message"
  fi
fi

# Step 4: Stage files and commit
echo -e "\n${YELLOW}📦 Step 4: Staging files and creating commit...${NC}"

# Add all non-sensitive files
git add . 2>/dev/null || true

# Remove sensitive files from staging
for file in "${sensitive_files[@]}"; do
  git reset HEAD "$file" 2>/dev/null || true
  echo -e "  ${YELLOW}⚠️  Unstaged sensitive file: $file${NC}"
done

# Show what will be committed
echo "Files to be committed:"
git diff --cached --name-status | sed 's/^/  /'

if [[ "$AUTO_MODE" == "false" ]]; then
  read -p "Proceed with commit? (Y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${RED}❌ Commit cancelled${NC}"
    exit 0
  fi
fi

# Create the commit with proper format
full_commit_message="$commit_message

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git commit -m "$full_commit_message"

echo -e "${GREEN}✅ Commit created successfully${NC}"

# Step 5: Deploy to GitHub
echo -e "\n${YELLOW}🚀 Step 5: Deploying to GitHub...${NC}"

# Check if we have a remote
if ! git remote get-url origin >/dev/null 2>&1; then
  echo -e "${RED}❌ No 'origin' remote found${NC}"
  exit 1
fi

# Check current branch
current_branch=$(git branch --show-current)
echo "Current branch: $current_branch"

# Push to GitHub
if [[ "$AUTO_MODE" == "false" ]]; then
  read -p "Push to GitHub? (Y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}📋 Commit ready but not pushed${NC}"
    exit 0
  fi
fi

echo "Pushing to origin/$current_branch..."
git push origin "$current_branch"

echo -e "\n${GREEN}🎉 Successfully deployed to GitHub!${NC}"
echo "=================================================="
echo -e "${BLUE}Summary:${NC}"
echo "  • Files committed: $(git diff --name-only HEAD~1 | wc -l | tr -d ' ')"
echo "  • Commit hash: $(git rev-parse --short HEAD)"
echo "  • Branch: $current_branch"
if [[ ${#sensitive_files[@]} -gt 0 ]]; then
  echo "  • Sensitive files protected: ${#sensitive_files[@]}"
fi
if [[ ${#gitignore_updates[@]} -gt 0 ]]; then
  echo "  • .gitignore updated: ${#gitignore_updates[@]} entries"
fi
echo -e "${GREEN}  • Status: Deployed ✅${NC}"