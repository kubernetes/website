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

# Build EPUB files from Kubernetes documentation.
#
# Usage: scripts/build-epub.sh [VERSION] [MODE] [LANG]
#
# Prerequisites: hugo, pandoc, python3

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PUBLIC_DIR="${WEBSITE_DIR}/public"
STAGING_DIR="${WEBSITE_DIR}/build/epub/staging"
OUTPUT_DIR="${WEBSITE_DIR}/build/epub/output"
STATIC_DIR="${WEBSITE_DIR}/static"

# Extract version from hugo.toml if not provided
VERSION="${1:-$(grep '^version = ' "${WEBSITE_DIR}/hugo.toml" | head -1 | sed 's/.*"\(.*\)"/\1/')}"
MODE="${2:-full}"
LANG="${3:-en}"
FULL_SECTIONS=(setup concepts tasks tutorials)

COVER_IMAGE="${STATIC_DIR}/images/kubernetes-horizontal-color.png"
EPUB_STYLESHEET="${WEBSITE_DIR}/assets/scss/epub-pandoc.scss"

echo "=== Kubernetes EPUB Builder ==="
echo "Version: ${VERSION}"
echo "Mode: ${MODE}"
echo "Language: ${LANG}"
echo ""

if [[ "${MODE}" != "full" && "${MODE}" != "reference" ]]; then
    echo "ERROR: Unsupported mode '${MODE}'. Allowed values: full, reference."
    exit 1
fi

# Check prerequisites
for cmd in hugo pandoc python3; do
    if ! command -v "${cmd}" &> /dev/null; then
        echo "ERROR: ${cmd} is required but not found in PATH."
        exit 1
    fi
done

# Step 1: Build Hugo site
echo "--- Step 1: Building Hugo site (${LANG}) ---"
cd "${WEBSITE_DIR}"
hugo --cleanDestinationDir --environment development --renderSegments "${LANG}" 2>&1 | tail -5
echo "Hugo build complete."
echo ""

# Determine content path in public directory
if [ "${LANG}" = "en" ]; then
    DOCS_PUBLIC_DIR="${PUBLIC_DIR}/docs"
else
    DOCS_PUBLIC_DIR="${PUBLIC_DIR}/${LANG}/docs"
fi

mkdir -p "${STAGING_DIR}" "${OUTPUT_DIR}"

build_common_pandoc_args() {
    local output_file="$1"
    local title="$2"
    local -n out_args="$3"

    out_args=(
        --from=html
        --to=epub3
        --output="${output_file}"
        --epub-metadata="${SCRIPT_DIR}/epub-metadata.xml"
        --metadata="title:${title}"
        --metadata="creator:The Kubernetes Authors"
        --metadata="lang:${LANG}"
        --metadata="date:$(date +%Y-%m-%d)"
        --toc
        --toc-depth=4
        --split-level=1
        --section-divs
        --syntax-highlighting=none
        --css="${EPUB_STYLESHEET}"
        --resource-path="${PUBLIC_DIR}:${STATIC_DIR}:${WEBSITE_DIR}"
    )

    if [ -f "${COVER_IMAGE}" ]; then
        out_args+=(--epub-cover-image="${COVER_IMAGE}")
    fi
}

build_reference_epub() {
    local section="$1"
    local epub_html="${DOCS_PUBLIC_DIR}/${section}/_epub/index.html"

    if [ ! -f "${epub_html}" ]; then
        echo "ERROR: No EPUB HTML found for section '${section}'."
        return 1
    fi

    local lang_suffix=""
    if [ "${LANG}" != "en" ]; then
        lang_suffix="-${LANG}"
    fi

    local staged_html="${STAGING_DIR}/${LANG}/${section}/index.html"
    local output_epub="${OUTPUT_DIR}/kubernetes-${section}-${VERSION}${lang_suffix}.epub"

    echo "  Processing section: ${section}"

    # Post-process HTML
    python3 "${SCRIPT_DIR}/epub_postprocess/main.py" \
        "${epub_html}" \
        "${staged_html}" \
        --section "${section}" \
        --link-mode section \
        --static-dir "${STATIC_DIR}" \
        --public-dir "${PUBLIC_DIR}"

    # Convert to EPUB with pandoc
    local pandoc_args=()
    build_common_pandoc_args "${output_epub}" "Kubernetes ${section^} - ${VERSION}" pandoc_args

    pandoc "${pandoc_args[@]}" "${staged_html}"

    local size
    size=$(du -h "${output_epub}" | cut -f1)
    echo "  Created: ${output_epub} (${size})"
    return 0
}

build_full_epub() {
    echo "--- Step 2: Building full EPUB ---"
    local -a COMBINED_INPUTS=()
    local -a COMBINED_RAW_INPUTS=()
    for section in "${FULL_SECTIONS[@]}"; do
        local raw_html="${DOCS_PUBLIC_DIR}/${section}/_epub/index.html"
        if [ ! -f "${raw_html}" ]; then
            echo "ERROR: Missing required section HTML for full mode: '${section}' (${raw_html})"
            return 1
        fi
        COMBINED_RAW_INPUTS+=("${DOCS_PUBLIC_DIR}/${section}/_epub/index.html")
    done

    local -a COMBINED_INDEX_ARGS=()
    for raw_input in "${COMBINED_RAW_INPUTS[@]}"; do
        COMBINED_INDEX_ARGS+=(--index-html "${raw_input}")
    done

    for i in "${!FULL_SECTIONS[@]}"; do
        local section="${FULL_SECTIONS[$i]}"
        local raw_html="${COMBINED_RAW_INPUTS[$i]}"
        local combined_staged_html="${STAGING_DIR}/${LANG}/full/${section}/index.html"

        python3 "${SCRIPT_DIR}/epub_postprocess/main.py" \
            "${raw_html}" \
            "${combined_staged_html}" \
            --section "${section}" \
            --link-mode combined \
            --static-dir "${STATIC_DIR}" \
            --public-dir "${PUBLIC_DIR}" \
            "${COMBINED_INDEX_ARGS[@]}"

        COMBINED_INPUTS+=("${combined_staged_html}")
    done

    local local_lang_suffix=""
    if [ "${LANG}" != "en" ]; then
        local_lang_suffix="-${LANG}"
    fi

    local combined_output="${OUTPUT_DIR}/kubernetes-docs-${VERSION}${local_lang_suffix}.epub"

    local -a pandoc_combined_args=()
    build_common_pandoc_args "${combined_output}" "Kubernetes Documentation - ${VERSION}" pandoc_combined_args

    pandoc "${pandoc_combined_args[@]}" "${COMBINED_INPUTS[@]}"

    local combined_size
    combined_size=$(du -h "${combined_output}" | cut -f1)
    echo "  Created: ${combined_output} (${combined_size})"
    echo ""
}

if [ "${MODE}" = "reference" ]; then
    echo "--- Step 2: Building reference EPUB ---"
    build_reference_epub "reference"
    echo ""
else
    build_full_epub
fi

# Summary
echo "=== Build complete ==="
echo "EPUBs generated in: ${OUTPUT_DIR}/"
ls -lh "${OUTPUT_DIR}"/*.epub 2>/dev/null || echo "No EPUB files found."
echo ""
echo "To validate: epubcheck ${OUTPUT_DIR}/<file>.epub"
