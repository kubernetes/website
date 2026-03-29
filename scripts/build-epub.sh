#!/usr/bin/env bash
# Build EPUB files from Kubernetes documentation.
#
# Usage: scripts/build-epub.sh [VERSION] [SECTIONS] [LANG]
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
SECTIONS="${2:-setup concepts tasks tutorials reference contribute}"
LANG="${3:-en}"

COVER_IMAGE="${STATIC_DIR}/images/kubernetes-horizontal-color.png"
EPUB_STYLESHEET="${WEBSITE_DIR}/assets/scss/epub-pandoc.scss"

echo "=== Kubernetes EPUB Builder ==="
echo "Version: ${VERSION}"
echo "Sections: ${SECTIONS}"
echo "Language: ${LANG}"
echo ""

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
        --no-highlight
        --css="${EPUB_STYLESHEET}"
        --resource-path="${PUBLIC_DIR}:${STATIC_DIR}:${WEBSITE_DIR}"
    )

    if [ -f "${COVER_IMAGE}" ]; then
        out_args+=(--epub-cover-image="${COVER_IMAGE}")
    fi
}

build_section_epub() {
    local section="$1"
    local epub_html="${DOCS_PUBLIC_DIR}/${section}/_epub/index.html"

    if [ ! -f "${epub_html}" ]; then
        echo "WARNING: No EPUB HTML found for section '${section}'. Skipping."
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
    python3 "${SCRIPT_DIR}/epub-postprocess.py" \
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

# Step 2: Process each section
echo "--- Step 2: Processing sections ---"
SUCCESSFUL_SECTIONS=()
for section in ${SECTIONS}; do
    if build_section_epub "${section}"; then
        SUCCESSFUL_SECTIONS+=("${section}")
    fi
done
echo ""

# Step 3: Build combined EPUB (excluding reference and contribute)
COMBINE_SECTIONS=()
for section in "${SUCCESSFUL_SECTIONS[@]}"; do
    if [[ "${section}" != "reference" && "${section}" != "contribute" ]]; then
        COMBINE_SECTIONS+=("${section}")
    fi
done

if [ ${#COMBINE_SECTIONS[@]} -gt 1 ]; then
    echo "--- Step 3: Building combined EPUB ---"
    COMBINED_INPUTS=()
    COMBINED_RAW_INPUTS=()
    for section in "${COMBINE_SECTIONS[@]}"; do
        COMBINED_RAW_INPUTS+=("${DOCS_PUBLIC_DIR}/${section}/_epub/index.html")
    done

    COMBINED_INDEX_ARGS=()
    for raw_input in "${COMBINED_RAW_INPUTS[@]}"; do
        COMBINED_INDEX_ARGS+=(--index-html "${raw_input}")
    done

    for i in "${!COMBINE_SECTIONS[@]}"; do
        section="${COMBINE_SECTIONS[$i]}"
        raw_html="${COMBINED_RAW_INPUTS[$i]}"
        combined_staged_html="${STAGING_DIR}/${LANG}/combined/${section}/index.html"

        python3 "${SCRIPT_DIR}/epub-postprocess.py" \
            "${raw_html}" \
            "${combined_staged_html}" \
            --section "${section}" \
            --link-mode combined \
            --static-dir "${STATIC_DIR}" \
            --public-dir "${PUBLIC_DIR}" \
            "${COMBINED_INDEX_ARGS[@]}"

        COMBINED_INPUTS+=("${combined_staged_html}")
    done

    local_lang_suffix=""
    if [ "${LANG}" != "en" ]; then
        local_lang_suffix="-${LANG}"
    fi

    COMBINED_OUTPUT="${OUTPUT_DIR}/kubernetes-docs-${VERSION}${local_lang_suffix}.epub"

    pandoc_combined_args=()
    build_common_pandoc_args "${COMBINED_OUTPUT}" "Kubernetes Documentation - ${VERSION}" pandoc_combined_args

    pandoc "${pandoc_combined_args[@]}" "${COMBINED_INPUTS[@]}"

    combined_size=$(du -h "${COMBINED_OUTPUT}" | cut -f1)
    echo "  Created: ${COMBINED_OUTPUT} (${combined_size})"
    echo ""
fi

# Summary
echo "=== Build complete ==="
echo "EPUBs generated in: ${OUTPUT_DIR}/"
ls -lh "${OUTPUT_DIR}"/*.epub 2>/dev/null || echo "No EPUB files found."
echo ""
echo "To validate: epubcheck ${OUTPUT_DIR}/<file>.epub"
