#!/usr/bin/env bash

# Test script for API redirect generation
# This script validates that the redirect generation works correctly

set -euo pipefail

echo "Testing API redirect generation..."

# Save original _redirects file
cp static/_redirects static/_redirects.test-backup

# Test 1: Generate redirects
echo "Test 1: Generating redirects..."
bash scripts/generate-api-redirects.sh

# Test 2: Check redirect exists
echo "Test 2: Checking redirect exists..."
if grep -q "kubernetes-api/latest/" static/_redirects; then
    echo "✓ Redirect found in _redirects file"
else
    echo "✗ Redirect not found in _redirects file"
    exit 1
fi

# Test 3: Check redirect format
echo "Test 3: Checking redirect format..."
REDIRECT_LINE=$(grep "kubernetes-api/latest/" static/_redirects)
if [[ "$REDIRECT_LINE" =~ ^/docs/reference/generated/kubernetes-api/latest/[[:space:]]+/docs/reference/generated/kubernetes-api/v[0-9]+\.[0-9]+/[[:space:]]+301! ]]; then
    echo "✓ Redirect format is correct: $REDIRECT_LINE"
else
    echo "✗ Redirect format is incorrect: $REDIRECT_LINE"
    exit 1
fi

# Test 4: Check no duplicates
echo "Test 4: Checking for duplicates..."
REDIRECT_COUNT=$(grep -c "kubernetes-api/latest/" static/_redirects)
if [[ "$REDIRECT_COUNT" -eq 1 ]]; then
    echo "✓ No duplicate redirects found"
else
    echo "✗ Found $REDIRECT_COUNT redirects (expected 1)"
    exit 1
fi

# Test 5: Run script again to test idempotency
echo "Test 5: Testing idempotency..."
bash scripts/generate-api-redirects.sh
REDIRECT_COUNT_AFTER=$(grep -c "kubernetes-api/latest/" static/_redirects)
if [[ "$REDIRECT_COUNT_AFTER" -eq 1 ]]; then
    echo "✓ Script is idempotent (no duplicates after second run)"
else
    echo "✗ Script created duplicates on second run"
    exit 1
fi

# Restore original file
mv static/_redirects.test-backup static/_redirects

echo "All tests passed! ✓"