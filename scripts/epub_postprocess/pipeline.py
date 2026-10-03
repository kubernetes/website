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

"""Composable post-processing pipeline for Kubernetes EPUB HTML."""

import os

from .assets import rewrite_image_paths
from .cleanup import (
    clean_empty_elements,
    demote_content_headings,
    remove_external_stylesheets,
    remove_scripts,
    remove_whats_next_sections,
    strip_docsy_ui_elements,
)
from .headings import deduplicate_heading_ids, resolve_remaining_duplicate_ids
from .links import rewrite_internal_links_with_mapping
from .tabs import flatten_tabs


def postprocess(
    input_path: str,
    output_path: str,
    section: str,
    static_dir: str,
    public_dir: str = "",
    base_url: str = "https://kubernetes.io",
    link_mode: str = "section",
    index_html: list[str] | None = None,
) -> None:
    """Run the EPUB post-processing pipeline.

    `link_mode="section"` is used for reference-only EPUB builds.
    `link_mode="combined"` is used for full EPUB builds.
    """
    if index_html is None:
        index_html = []

    with open(input_path, "r", encoding="utf-8") as file_handle:
        doc_html = file_handle.read()

    doc_html = remove_scripts(doc_html)
    doc_html = remove_external_stylesheets(doc_html)
    doc_html = remove_whats_next_sections(doc_html)
    doc_html = strip_docsy_ui_elements(doc_html)
    doc_html = flatten_tabs(doc_html)
    doc_html = rewrite_image_paths(doc_html, static_dir, public_dir)
    doc_html = rewrite_internal_links_with_mapping(
        doc_html=doc_html,
        section=section,
        base_url=base_url,
        link_mode=link_mode,
        index_html=index_html,
    )
    doc_html = deduplicate_heading_ids(doc_html)
    doc_html = demote_content_headings(doc_html)
    doc_html = resolve_remaining_duplicate_ids(doc_html)
    doc_html = clean_empty_elements(doc_html)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as file_handle:
        file_handle.write(doc_html)

    print(f"Post-processed: {input_path} -> {output_path}")
