#!/usr/bin/env bash
# task0-verify.sh
# Verifies that CONVENTIONS.md exists and contains all required sections.
# Exit 0 = pass. Exit 1 = fail.
set -euo pipefail

CONVENTIONS="CONVENTIONS.md"
ERRORS=0

check() {
  local label="$1"
  local pattern="$2"
  if grep -q "$pattern" "$CONVENTIONS"; then
    echo "  ✓ $label"
  else
    echo "  ✗ MISSING: $label"
    ERRORS=$((ERRORS + 1))
  fi
}

echo "=== task0-verify: CONVENTIONS.md check ==="

# File existence
if [ ! -f "$CONVENTIONS" ]; then
  echo "  ✗ CONVENTIONS.md does not exist at repo root"
  exit 1
fi
echo "  ✓ CONVENTIONS.md exists"

# Required sections
check "Naming section"               "## Naming"
check "Folder structure section"     "## Folder structure"
check "Error handling section"       "## Error handling"
check "Styling section"              "## Styling"
check "Verification tooling section" "## Verification"
check "Environment contract section" "## Environment"
check "Must never do section"        "must never"
check "Tailwind declared"            "Tailwind"
check "Playwright declared"          "Playwright"
check "browser_app declared"         "browser_app"
check "data-testid convention"       "data-testid"
check "setup_command present"        "setup_command"
check "dev_command present"          "dev_command"
check "verify_command present"       "verify_command"

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "PASS — CONVENTIONS.md valid ($(($(grep -c "^" "$CONVENTIONS"))) lines)"
  exit 0
else
  echo "FAIL — $ERRORS required element(s) missing from CONVENTIONS.md"
  exit 1
fi
