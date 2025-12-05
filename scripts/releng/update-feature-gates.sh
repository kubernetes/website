#!/usr/bin/env bash

# Copyright 2025 The Kubernetes Authors.
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

# This script updates feature gate documentation from a JSON file generated
# by genfeaturegates (in kubernetes/kubernetes).
#
# Usage:
#   ./scripts/releng/update-feature-gates.sh /path/to/feature-gates.json
#
# To generate the JSON file, run from the kubernetes repo:
#   go run ./cmd/genfeaturegates -format=json -output=/tmp/feature-gates.json

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <feature-gates.json>"
    echo ""
    echo "Updates feature gate markdown files from JSON data."
    echo ""
    echo "To generate the JSON file, run from the kubernetes repo:"
    echo "  go run ./cmd/genfeaturegates -format=json -output=/tmp/feature-gates.json"
    exit 1
fi

JSON_FILE="$1"

if [[ ! -f "${JSON_FILE}" ]]; then
    echo "Error: JSON file not found: ${JSON_FILE}"
    exit 1
fi

cd "${REPO_ROOT}"

# Run the Go tool
go run ./scripts/releng/update-feature-gates "${JSON_FILE}"

echo ""
echo "Next steps:"
echo "  1. Review changes with: git diff content/en/docs/reference/command-line-tools-reference/feature-gates"
echo "  2. Add changes with: git add content/en/docs/reference/command-line-tools-reference/feature-gates"
echo "  3. Commit with a descriptive message"