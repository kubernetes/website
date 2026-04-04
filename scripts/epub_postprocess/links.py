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

"""Internal link rewriting for Kubernetes reference and full EPUB outputs."""

import html
import re
from urllib.parse import urlsplit


def normalize_docs_path(path: str) -> str:
    split = urlsplit(path)
    normalized = split.path or ""
    if not normalized.startswith("/"):
        normalized = f"/{normalized}"
    normalized = re.sub(r"/index\.html$", "/", normalized, flags=re.IGNORECASE)
    normalized = re.sub(r"//+", "/", normalized)
    if len(normalized) > 1 and normalized.endswith("/"):
        normalized = normalized[:-1]
    return normalized.lower()


def is_section_root_path(path: str, section: str) -> bool:
    docs_path = re.compile(r"^/(?:[a-z]{2}(?:-[a-z0-9]+)*/)?docs/([^/#?]+)$", flags=re.IGNORECASE)
    match = docs_path.match(normalize_docs_path(path))
    return bool(match and match.group(1) == section.lower())


def build_docs_anchor_index(html_docs: list[str]):
    page_pattern = re.compile(
        r'<h[1-4]\b(?=[^>]*\bid="pg-([a-f0-9]+)")(?=[^>]*\bdata-docs-path="([^"]+)")[^>]*>',
        flags=re.IGNORECASE,
    )
    heading_pattern = re.compile(r'<h[1-6]\b[^>]*\bid="([^"]+)"[^>]*>', flags=re.IGNORECASE)
    intro_heading_pattern = re.compile(r'<h[2-6]\b[^>]*\bid="([^"]+)"[^>]*>', flags=re.IGNORECASE)

    path_to_uid: dict[str, str] = {}
    uid_to_heading_ids: dict[str, set[str]] = {}
    intro_heading_ids: set[str] = set()

    for html_doc in html_docs:
        page_matches = list(page_pattern.finditer(html_doc))
        first_page_start = page_matches[0].start() if page_matches else len(html_doc)
        intro_part = html_doc[:first_page_start]
        for match in intro_heading_pattern.finditer(intro_part):
            intro_heading_ids.add(match.group(1))

        for idx, page_match in enumerate(page_matches):
            uid = page_match.group(1)
            docs_path = normalize_docs_path(html.unescape(page_match.group(2)))
            path_to_uid[docs_path] = uid

            page_start = page_match.end()
            page_end = page_matches[idx + 1].start() if idx + 1 < len(page_matches) else len(html_doc)
            page_content = html_doc[page_start:page_end]
            heading_ids = {
                m.group(1)
                for m in heading_pattern.finditer(page_content)
                if not m.group(1).startswith("pg-")
            }
            uid_to_heading_ids[uid] = heading_ids

    return path_to_uid, uid_to_heading_ids, intro_heading_ids


def rewrite_internal_links_with_mapping(
    doc_html: str,
    section: str,
    base_url: str,
    link_mode: str,
    index_html: list[str],
) -> str:
    """Rewrite docs links to internal anchors when possible.

    In `section` mode (used for reference-only EPUB builds), only same-section
    docs links become internal anchors.
    In `combined` mode (used for full EPUB builds), links to any indexed docs
    page become internal anchors.
    """
    docs_path = re.compile(r"^/(?:([a-z]{2}(?:-[a-z0-9]+)*)/)?docs(?:/([^/#?]+))?", flags=re.IGNORECASE)
    html_docs_for_index = [doc_html]
    for path in index_html:
        if not path:
            continue
        with open(path, "r", encoding="utf-8") as file_handle:
            html_docs_for_index.append(file_handle.read())
    path_to_uid, uid_to_heading_ids, intro_heading_ids = build_docs_anchor_index(html_docs_for_index)

    def to_external(href: str) -> str:
        return f"{base_url}{href}"

    def fix_href(match: re.Match[str]) -> str:
        quote = match.group(1)
        href = match.group(2)
        if href.startswith(("http://", "https://", "#", "mailto:")):
            return match.group(0)

        split = urlsplit(href)
        path_part = split.path
        fragment = split.fragment.strip()
        docs_match = docs_path.match(path_part)

        if docs_match:
            target_section = (docs_match.group(2) or "").lower()
            normalized_path = normalize_docs_path(path_part)

            if link_mode == "combined":
                should_internalize = normalized_path in path_to_uid
            else:
                should_internalize = target_section == section.lower() and normalized_path in path_to_uid

            if should_internalize:
                uid = path_to_uid[normalized_path]
                if fragment:
                    if fragment in uid_to_heading_ids.get(uid, set()):
                        return f'href={quote}#{uid}-{fragment}{quote}'
                    if is_section_root_path(path_part, section):
                        intro_id = f"intro-{fragment}"
                        if intro_id in intro_heading_ids:
                            return f'href={quote}#{intro_id}{quote}'
                return f'href={quote}#pg-{uid}{quote}'
            return f'href={quote}{to_external(href)}{quote}'

        if path_part.startswith("/"):
            return f'href={quote}{to_external(href)}{quote}'
        return match.group(0)

    return re.sub(r'href=(["\'])([^"\']*)\1', fix_href, doc_html)


def rewrite_internal_links(doc_html: str, section: str, base_url: str) -> str:
    """Rewrite links without an external index map (single-section mode helper)."""
    return rewrite_internal_links_with_mapping(
        doc_html=doc_html,
        section=section,
        base_url=base_url,
        link_mode="section",
        index_html=[],
    )
