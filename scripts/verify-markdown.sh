#!/usr/bin/env bash

# Copyright 2026 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# This script validates Markdown formatting in documentation files.
# It checks for:
# - Incorrect heading hierarchy (e.g., H1 -> H3 skipping H2)
# - Trailing whitespace
# - Empty or malformed links
# - Images without alt text
# - Inconsistent list indentation

set -o errexit
set -o nounset
set -o pipefail

SCRIPT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_ROOT}/.." && pwd)"

# Default to checking all markdown files in content/ directory
TARGET_DIR="${1:-${REPO_ROOT}/content}"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Temp file for collecting results
TEMP_RESULTS=$(mktemp)
trap 'rm -f "$TEMP_RESULTS"' EXIT

echo "Validating Markdown files in ${TARGET_DIR}..."
echo ""

# Find all markdown files and save to temp file
find "${TARGET_DIR}" -name "*.md" -type f | sort > "$TEMP_RESULTS"

TOTAL_ERRORS=0
TOTAL_WARNINGS=0

while IFS= read -r file; do
    FILE_ERRORS=0
    FILE_WARNINGS=0

    # Check 1: Trailing whitespace
    while IFS= read -r line_data; do
        if [[ -n "$line_data" ]]; then
            line_num="${line_data%%:*}"
            echo -e "${YELLOW}[TRAILING_WS]${NC} $file:$line_num - Line has trailing whitespace"
            FILE_WARNINGS=$((FILE_WARNINGS + 1))
        fi
    done < <(grep -n '[[:space:]]$' "$file" 2>/dev/null || true)

    # Check 2: Empty links []() or [text]()
    while IFS= read -r line_data; do
        if [[ -n "$line_data" ]]; then
            line_num="${line_data%%:*}"
            line_content="${line_data#*:}"
            echo -e "${RED}[EMPTY_LINK]${NC} $file:$line_num - Empty link found: $line_content"
            FILE_ERRORS=$((FILE_ERRORS + 1))
        fi
    done < <(grep -n '\[\]\([^)]*\)' "$file" 2>/dev/null || true)

    # Check 3: Links with only whitespace as text [  ]()
    while IFS= read -r line_data; do
        if [[ -n "$line_data" ]]; then
            line_num="${line_data%%:*}"
            line_content="${line_data#*:}"
            echo -e "${RED}[EMPTY_LINK]${NC} $file:$line_num - Link with whitespace text only: $line_content"
            FILE_ERRORS=$((FILE_ERRORS + 1))
        fi
    done < <(grep -n '\[[[:space:]]*\]([^)]*)' "$file" 2>/dev/null || true)

    # Check 4: Images without alt text ![]()
    while IFS= read -r line_data; do
        if [[ -n "$line_data" ]]; then
            line_num="${line_data%%:*}"
            line_content="${line_data#*:}"
            echo -e "${YELLOW}[MISSING_ALT]${NC} $file:$line_num - Image missing alt text: $line_content"
            FILE_WARNINGS=$((FILE_WARNINGS + 1))
        fi
    done < <(grep -n '!\[\]([^)]*)' "$file" 2>/dev/null || true)

    # Check 5: Heading hierarchy (using Python for more complex logic)
    python3 "${SCRIPT_ROOT}/check-markdown.py" "$file" 2>/dev/null || true
    python_result=$?
    if [[ $python_result -gt 0 ]]; then
        FILE_ERRORS=$((FILE_ERRORS + python_result))
    fi

    # Check 6: List indentation inconsistencies
    # Check for tabs in lists (should use spaces)
    while IFS= read -r line_data; do
        if [[ -n "$line_data" ]]; then
            line_num="${line_data%%:*}"
            echo -e "${YELLOW}[LIST_TAB]${NC} $file:$line_num - List item uses tabs instead of spaces"
            FILE_WARNINGS=$((FILE_WARNINGS + 1))
        fi
    done < <(grep -n '^[[:space:]]*[-*+]' "$file" 2>/dev/null | grep $'\t' || true)

    TOTAL_WARNINGS=$((TOTAL_WARNINGS + FILE_WARNINGS))
    TOTAL_ERRORS=$((TOTAL_ERRORS + FILE_ERRORS))
done < "$TEMP_RESULTS"

echo ""
echo "========================================="
echo "Markdown Validation Summary"
echo "========================================="
echo -e "Total Errors:   ${RED}${TOTAL_ERRORS}${NC}"
echo -e "Total Warnings: ${YELLOW}${TOTAL_WARNINGS}${NC}"
echo ""

if [[ $TOTAL_ERRORS -gt 0 ]]; then
    echo -e "${RED}Validation FAILED${NC}"
    exit 1
else
    echo -e "${GREEN}Validation PASSED${NC} (with ${TOTAL_WARNINGS} warnings)"
    exit 0
fi
