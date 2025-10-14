#!/bin/bash
#
# Patient Slice Validation Script
# Quick validation to ensure Patient Slice migration is complete and functional
#
# Usage: ./scripts/validate-patient-slice.sh
#
# Author: VitalGo DevOps
# Version: 1.0.0
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Logging functions
log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
check() { echo -e "${BLUE}[CHECK]${NC} $1"; }

# Validation counters
PASSED=0
FAILED=0
WARNINGS=0

validate_item() {
    local description="$1"
    local condition="$2"

    check "$description"

    if eval "$condition"; then
        success "✅ PASS: $description"
        ((PASSED++))
    else
        error "❌ FAIL: $description"
        ((FAILED++))
    fi
}

validate_warning() {
    local description="$1"
    local condition="$2"

    check "$description"

    if eval "$condition"; then
        success "✅ PASS: $description"
        ((PASSED++))
    else
        warn "⚠️ WARNING: $description"
        ((WARNINGS++))
    fi
}

echo "==================================================================================="
echo "🔍 Patient Slice Migration Validation"
echo "==================================================================================="
echo ""

log "Project Root: $PROJECT_ROOT"
log "Timestamp: $(date)"
echo ""

#==============================================================================
# FRONTEND STRUCTURE VALIDATION
#==============================================================================

echo "📱 FRONTEND STRUCTURE VALIDATION"
echo "----------------------------------------"

# Patient slice directory structure
validate_item "Patient slice directory exists" "[[ -d '$PROJECT_ROOT/frontend/src/slices/patient' ]]"
validate_item "Patient components directory exists" "[[ -d '$PROJECT_ROOT/frontend/src/slices/patient/components' ]]"
validate_item "Patient atoms directory exists" "[[ -d '$PROJECT_ROOT/frontend/src/slices/patient/components/atoms' ]]"
validate_item "Patient molecules directory exists" "[[ -d '$PROJECT_ROOT/frontend/src/slices/patient/components/molecules' ]]"
validate_item "Patient organisms directory exists" "[[ -d '$PROJECT_ROOT/frontend/src/slices/patient/components/organisms' ]]"
validate_item "Patient hooks directory exists" "[[ -d '$PROJECT_ROOT/frontend/src/slices/patient/hooks' ]]"
validate_item "Patient services directory exists" "[[ -d '$PROJECT_ROOT/frontend/src/slices/patient/services' ]]"
validate_item "Patient types directory exists" "[[ -d '$PROJECT_ROOT/frontend/src/slices/patient/types' ]]"

echo ""

#==============================================================================
# KEY COMPONENT VALIDATION
#==============================================================================

echo "🧩 KEY COMPONENT VALIDATION"
echo "----------------------------------------"

# Essential components
validate_item "PersonalInformationTab component exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/components/organisms/PersonalInformationTab.tsx' ]]"
validate_item "BasicInformationTab component exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/components/organisms/BasicInformationTab.tsx' ]]"
validate_item "PersonalInfoEditModal component exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/components/molecules/PersonalInfoEditModal.tsx' ]]"
validate_item "PersonalInfoProgressBar component exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/components/molecules/PersonalInfoProgressBar.tsx' ]]"
validate_item "PatientProfilePage exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/components/pages/PatientProfilePage.tsx' ]]"

# Atomic components
validate_item "BiologicalSexSelector atom exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/components/atoms/BiologicalSexSelector.tsx' ]]"
validate_item "GenderSelector atom exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/components/atoms/GenderSelector.tsx' ]]"
validate_item "ColombianDepartmentSelector atom exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/components/atoms/ColombianDepartmentSelector.tsx' ]]"
validate_item "HybridCityInput atom exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/components/atoms/HybridCityInput.tsx' ]]"

echo ""

#==============================================================================
# HOOKS AND SERVICES VALIDATION
#==============================================================================

echo "🪝 HOOKS AND SERVICES VALIDATION"
echo "----------------------------------------"

validate_item "usePersonalPatientInfo hook exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/hooks/usePersonalPatientInfo.ts' ]]"
validate_item "useBasicPatientInfo hook exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/hooks/useBasicPatientInfo.ts' ]]"
validate_item "personalApi service exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/services/personalApi.ts' ]]"
validate_item "basicApi service exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/services/basicApi.ts' ]]"
validate_item "Patient types definition exists" "[[ -f '$PROJECT_ROOT/frontend/src/slices/patient/types/index.ts' ]]"

echo ""

#==============================================================================
# BACKEND STRUCTURE VALIDATION
#==============================================================================

echo "⚙️ BACKEND STRUCTURE VALIDATION"
echo "----------------------------------------"

validate_item "Backend patient slice exists" "[[ -d '$PROJECT_ROOT/backend/slices/patient' ]]"
validate_item "Patient domain models exist" "[[ -d '$PROJECT_ROOT/backend/slices/patient/domain/models' ]]"
validate_item "Patient application layer exists" "[[ -d '$PROJECT_ROOT/backend/slices/patient/application' ]]"
validate_item "Patient infrastructure exists" "[[ -d '$PROJECT_ROOT/backend/slices/patient/infrastructure' ]]"
validate_item "Patient API endpoints exist" "[[ -f '$PROJECT_ROOT/backend/slices/patient/infrastructure/api/patient_endpoints.py' ]]"

echo ""

#==============================================================================
# MIGRATION CLEANUP VALIDATION
#==============================================================================

echo "🧹 MIGRATION CLEANUP VALIDATION"
echo "----------------------------------------"

# Check if old profile slice still exists (should be cleaned up)
validate_warning "Old profile slice removed" "[[ ! -d '$PROJECT_ROOT/frontend/src/slices/profile' ]]"

# Check for common import issues (basic grep check)
if [[ -d "$PROJECT_ROOT/frontend/src" ]]; then
    OLD_IMPORTS=$(grep -r "from.*slices/profile" "$PROJECT_ROOT/frontend/src" 2>/dev/null | wc -l)
    validate_warning "No old profile imports found" "[[ $OLD_IMPORTS -eq 0 ]]"

    if [[ $OLD_IMPORTS -gt 0 ]]; then
        warn "Found $OLD_IMPORTS files with old profile imports"
        warn "Run: grep -r 'from.*slices/profile' frontend/src/ to locate them"
    fi
fi

echo ""

#==============================================================================
# INTEGRATION VALIDATION
#==============================================================================

echo "🔗 INTEGRATION VALIDATION"
echo "----------------------------------------"

# Check main profile page integration
validate_item "Main profile page updated" "[[ -f '$PROJECT_ROOT/frontend/src/app/profile/page.tsx' ]]"

# Check if shared hooks are updated
if [[ -f "$PROJECT_ROOT/frontend/src/shared/hooks/useAuthUserWithProfile.ts" ]]; then
    if grep -q "slices/patient" "$PROJECT_ROOT/frontend/src/shared/hooks/useAuthUserWithProfile.ts"; then
        success "✅ PASS: Shared hook updated to use patient slice"
        ((PASSED++))
    else
        error "❌ FAIL: Shared hook still using old profile import"
        ((FAILED++))
    fi
else
    warn "⚠️ WARNING: useAuthUserWithProfile.ts not found"
    ((WARNINGS++))
fi

echo ""

#==============================================================================
# TYPESCRIPT VALIDATION
#==============================================================================

echo "📝 TYPESCRIPT VALIDATION"
echo "----------------------------------------"

if [[ -d "$PROJECT_ROOT/frontend" ]] && command -v npm &> /dev/null; then
    check "Running TypeScript compilation check..."

    cd "$PROJECT_ROOT/frontend"

    if npm run type-check &>/dev/null; then
        success "✅ PASS: TypeScript compilation successful"
        ((PASSED++))
    else
        error "❌ FAIL: TypeScript compilation errors detected"
        ((FAILED++))
        warn "Run 'npm run type-check' in frontend directory for details"
    fi

    cd "$PROJECT_ROOT"
else
    warn "⚠️ WARNING: Cannot run TypeScript check (npm not available or frontend missing)"
    ((WARNINGS++))
fi

echo ""

#==============================================================================
# SUMMARY
#==============================================================================

echo "==================================================================================="
echo "📊 VALIDATION SUMMARY"
echo "==================================================================================="
echo ""

log "Validation Results:"
success "✅ Passed: $PASSED"
if [[ $WARNINGS -gt 0 ]]; then
    warn "⚠️ Warnings: $WARNINGS"
fi
if [[ $FAILED -gt 0 ]]; then
    error "❌ Failed: $FAILED"
fi

echo ""

if [[ $FAILED -eq 0 ]]; then
    if [[ $WARNINGS -eq 0 ]]; then
        success "🎉 EXCELLENT! Patient Slice migration is complete and ready!"
    else
        success "✅ GOOD! Patient Slice migration is functional with minor warnings."
        warn "Consider addressing the warnings for optimal setup."
    fi
else
    error "❌ ISSUES DETECTED! Patient Slice migration needs attention."
    log "Please resolve the failed items before proceeding."
fi

echo ""
log "For detailed troubleshooting, run: ./scripts/local-deploy.sh --help"
log "For environment setup, run: ./scripts/local-deploy.sh"

echo ""