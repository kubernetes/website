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

# Update feature gate docs from upstream kubernetes/kubernetes data.
#
# Intended usage: run once per Kubernetes release, after versioned_feature_list.yaml
# is updated upstream and before manual feature gate doc edits for that release.
#
# Recommended entrypoint (via Makefile):
#   make update-feature-gates
#   make update-feature-gates TAG=v1.34.2              # Example
#
# Direct usage:
#   ./scripts/releng/update-feature-gates.sh [tag]
#
# Examples:
#   ./scripts/releng/update-feature-gates.sh           # uses latest release tag
#   ./scripts/releng/update-feature-gates.sh v1.34.2   # uses specific tag
#   ./scripts/releng/update-feature-gates.sh master    # uses master branch

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Use provided tag or fetch latest release tag
if [[ $# -ge 1 ]]; then
    TAG="$1"
else
    # Fetch latest stable release tag from kubernetes/kubernetes
    echo "Fetching latest release tag from kubernetes/kubernetes..."
    TAG=$(curl -sSf "https://api.github.com/repos/kubernetes/kubernetes/releases/latest" | grep '"tag_name"' | cut -d'"' -f4)
    if [[ -z "${TAG}" ]]; then
        echo "Error: Failed to fetch latest release tag" >&2
        exit 1
    fi
    echo "Using latest release tag: ${TAG}"
fi

# Default to fetching from upstream kubernetes/kubernetes
YAML_URL="https://raw.githubusercontent.com/kubernetes/kubernetes/${TAG}/test/compatibility_lifecycle/reference/versioned_feature_list.yaml"
TEMP_YAML="${REPO_ROOT}/versioned_feature_list.yaml"

# Ensure cleanup on exit
trap "rm -f ${TEMP_YAML}" EXIT

echo "Fetching versioned_feature_list.yaml from ${TAG}..."

if ! curl -fsSL "${YAML_URL}" -o "${TEMP_YAML}"; then
    echo "Error: Failed to fetch YAML file from ${YAML_URL}" >&2
    echo "Please verify that tag '${TAG}' exists and contains the file." >&2
    exit 1
fi

cd "${REPO_ROOT}"

# Run the Go tool
echo "Running update-feature-gates tool..."
go run ./scripts/releng/update-feature-gates "${TEMP_YAML}"

echo ""
echo "Feature gates documentation updated successfully."
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff content/en/docs/reference/command-line-tools-reference/feature-gates"
echo "  2. Test locally: make container-serve"
echo "  3. Add changes: git add content/en/docs/reference/command-line-tools-reference/feature-gates"
echo "  4. Commit with a descriptive message"
echo "  5. Push to your fork and open a pull request"
echo ""
