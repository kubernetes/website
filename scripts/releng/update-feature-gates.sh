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

# This script updates feature gate documentation from versioned_feature_list.yaml
# in kubernetes/kubernetes repository.
#
# Usage:
#   ./scripts/releng/update-feature-gates.sh /path/to/versioned_feature_list.yaml
#
# To generate the YAML file, run from the kubernetes repo:
#   go run ./cmd/genfeaturegates -format=yaml -output=/tmp/versioned_feature_list.yaml

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Default to fetching from upstream kubernetes/kubernetes
YAML_URL="https://raw.githubusercontent.com/kubernetes/kubernetes/master/test/compatibility_lifecycle/reference/versioned_feature_list.yaml"
TEMP_YAML="./versioned_feature_list.yaml"

echo "Fetching feature gates data from kubernetes/kubernetes..." >&2
if ! curl -fsSL "${YAML_URL}" -o "${TEMP_YAML}"; then
    echo "Error: Failed to fetch YAML file from ${YAML_URL}" >&2
    exit 1
fi

cd "${REPO_ROOT}"

# Run the Go tool
go run ./scripts/releng/update-feature-gates "${TEMP_YAML}"

# Clean up
rm -f "${TEMP_YAML}"
echo "Feature gates documentation updated successfully."
echo ""
echo "Next steps:"
echo "  1. Review changes with: git diff content/en/docs/reference/command-line-tools-reference/feature-gates"
echo "  2. Add changes with: git add content/en/docs/reference/command-line-tools-reference/feature-gates"
echo "  3. Commit with a descriptive message"
