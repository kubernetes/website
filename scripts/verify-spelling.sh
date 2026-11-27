#!/usr/bin/env bash

# Copyright 2019 The Kubernetes Authors.
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
##########
# This script verifies mispellings in location. Today it only supports
# verifying English locale but can be modified in a future to support
# other locales also
# You need to run this script inside the root directory of "website" git repo.
#
# Syntax: verify-spelling.sh LOCALE
# Example: verify-spelling.sh en
# If no locale is passed, it will assume "en"
#
# Requirements:
# - go v1.14 or superior version



set -o errexit
set -o nounset
set -o pipefail

TOOL_VERSION="v0.3.4"

KUBE_ROOT=$(dirname "${BASH_SOURCE[0]}")/..

LANGUAGE="${1:-en}"
# cd to the root path
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "${ROOT}"

# create a temporary directory
TMP_DIR=$(mktemp -d)

# cleanup
exitHandler() (
  echo "Cleaning up..."
  rm -rf "${TMP_DIR}"
)
trap exitHandler EXIT

# install misspell into the temp dir so we don't pollute the repo
GOBIN="${TMP_DIR}" go install "github.com/client9/misspell/cmd/misspell@${TOOL_VERSION}"
export PATH="${TMP_DIR}:${PATH}"

# check spelling
RES=0
echo "Checking spelling..."
ERROR_LOG="${TMP_DIR}/errors.log"

# NOTE we usually don't correct old blog articles, so we ignore them in
# this file.
skipping_file="${KUBE_ROOT}/scripts/.spelling_failures"
failing_packages=$(sed "s| | -e |g" "${skipping_file}")

# Build a comma-separated list of words to ignore from .spelling_exceptions
MISSPELL_FLAGS=""
exceptions_file="${KUBE_ROOT}/scripts/.spelling_exceptions"
if [[ -f "${exceptions_file}" ]]; then
  ignore_words=$(grep -v '^#' "${exceptions_file}" | grep -v '^$' | paste -sd, - || true)
  if [[ -n "${ignore_words}" ]]; then
    MISSPELL_FLAGS="-i ${ignore_words}"
  fi
fi

# Skip blog posts older than current year (only check current and next year's posts)
CURRENT_YEAR=$(date +%Y)
BLOG_YEAR_EXCLUDE=""
for year_dir in content/${LANGUAGE}/blog/_posts/*/; do
  year=$(basename "${year_dir}")
  if [[ "${year}" =~ ^[0-9]{4}$ ]] && [[ "${year}" -lt "${CURRENT_YEAR}" ]]; then
    BLOG_YEAR_EXCLUDE="${BLOG_YEAR_EXCLUDE} -e content/${LANGUAGE}/blog/_posts/${year}/"
  fi
done

# Collect files, excluding skipped, old blog posts, and auto-generated ones
FILES_TO_CHECK="${TMP_DIR}/files.txt"
git ls-files -z | grep --null-data "^content/${LANGUAGE}" | grep --null-data -v -e "${failing_packages}" ${BLOG_YEAR_EXCLUDE} | xargs -0 -r grep -rL "auto_generated: true" > "${FILES_TO_CHECK}" || true

if [[ -s "${FILES_TO_CHECK}" ]]; then
  xargs misspell ${MISSPELL_FLAGS} < "${FILES_TO_CHECK}" > "${ERROR_LOG}"
fi
if [[ -s "${ERROR_LOG}" ]]; then
  sed 's/^/error: /' "${ERROR_LOG}" # add 'error' to each line to highlight in e2e status
  echo "Found spelling errors!" >&2
  RES=1
fi
exit "${RES}"
