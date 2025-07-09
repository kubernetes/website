#!/usr/bin/env bash

# Generate dynamic redirects for Kubernetes API reference
# This script detects the latest version from hugo.toml and updates the _redirects file
# to redirect /docs/reference/generated/kubernetes-api/latest/ to the current latest version.
#
# Usage: ./scripts/generate-api-redirects.sh
# 
# This script is automatically called during the build process via Makefile targets.

set -euo pipefail

# Get the latest version from hugo.toml
if [[ ! -f "hugo.toml" ]]; then
    echo "Error: hugo.toml not found. Run this script from the website root directory." >&2
    exit 1
fi

LATEST_VERSION=$(grep '^latest = ' hugo.toml | cut -d '"' -f 2 | tr -d '\n\r')

if [[ -z "$LATEST_VERSION" ]]; then
    echo "Error: Could not detect latest version from hugo.toml" >&2
    echo "Expected format: latest = \"v1.xx\"" >&2
    exit 1
fi

# Validate version format
if [[ ! "$LATEST_VERSION" =~ ^v[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format: $LATEST_VERSION" >&2
    echo "Expected format: v1.xx" >&2
    exit 1
fi

echo "Detected latest version: $LATEST_VERSION"

# Define the redirect rule
REDIRECT_RULE="/docs/reference/generated/kubernetes-api/latest/   /docs/reference/generated/kubernetes-api/$LATEST_VERSION/   301!"

# Check if _redirects file exists
REDIRECTS_FILE="static/_redirects"
if [[ ! -f "$REDIRECTS_FILE" ]]; then
    echo "Error: $REDIRECTS_FILE not found" >&2
    exit 1
fi

# Remove any existing latest API redirect
sed -i.bak '/^\/docs\/reference\/generated\/kubernetes-api\/latest\//d' "$REDIRECTS_FILE"

# Add the new redirect at the top of the file (after the header comments)
# Find the line number after the header comments
HEADER_END=$(grep -n "^$" "$REDIRECTS_FILE" | head -1 | cut -d: -f1)
if [[ -z "$HEADER_END" ]]; then
    HEADER_END=1
fi

# Insert the redirect after the header
{
    head -n "$HEADER_END" "$REDIRECTS_FILE"
    echo "$REDIRECT_RULE"
    tail -n +$((HEADER_END + 1)) "$REDIRECTS_FILE"
} > "${REDIRECTS_FILE}.tmp" && mv "${REDIRECTS_FILE}.tmp" "$REDIRECTS_FILE"

# Clean up backup file
rm -f "${REDIRECTS_FILE}.bak"

echo "Added redirect: $REDIRECT_RULE"
echo "Updated $REDIRECTS_FILE successfully"