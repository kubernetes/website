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

"""Heading ID normalization and deduplication helpers."""

import re


def _prefix_local_anchors(content: str, prefix: str, heading_ids: set[str]) -> str:
    """Prefix #fragment links that target headings in the same content block."""

    def prefix_href(match: re.Match[str]) -> str:
        quote = match.group(1)
        old_anchor = match.group(2)
        if old_anchor.startswith("pg-"):
            return match.group(0)
        if old_anchor in heading_ids:
            return f'href={quote}#{prefix}-{old_anchor}{quote}'
        return match.group(0)

    return re.sub(r'href=(["\'])#([^"\']+)\1', prefix_href, content)


def deduplicate_heading_ids(doc_html: str) -> str:
    """Prefix per-page heading IDs to avoid collisions after HTML concatenation."""
    page_pattern = re.compile(r'<h[1-4]\b[^>]*\bid="pg-([a-f0-9]+)"[^>]*>', flags=re.IGNORECASE)
    page_matches = list(page_pattern.finditer(doc_html))
    if not page_matches:
        return doc_html

    def prefix_heading_ids(content: str, uid: str) -> str:
        heading_pattern = re.compile(
            r'<(h[1-6])\b([^>]*?)\bid="([^"]+)"([^>]*)>',
            flags=re.IGNORECASE,
        )
        heading_ids = {
            match.group(3)
            for match in heading_pattern.finditer(content)
            if not match.group(3).startswith("pg-")
        }

        def prefix_id(match: re.Match[str]) -> str:
            heading_id = match.group(3)
            if heading_id.startswith("pg-"):
                return match.group(0)
            return f'<{match.group(1)}{match.group(2)}id="{uid}-{heading_id}"{match.group(4)}>'

        content = heading_pattern.sub(prefix_id, content)
        return _prefix_local_anchors(content, uid, heading_ids)

    first_page = page_matches[0]
    intro = doc_html[: first_page.start()]
    intro = re.sub(
        r'<(h[2-6])\b([^>]*?)\bid="([^"]+)"([^>]*)>',
        lambda match: f'<{match.group(1)}{match.group(2)}id="intro-{match.group(3)}"{match.group(4)}>',
        intro,
        flags=re.IGNORECASE,
    )
    intro = re.sub(
        r'href=(["\'])#([^"\']+)\1',
        lambda match: (
            match.group(0)
            if match.group(2).startswith(("pg-", "intro-"))
            else f'href={match.group(1)}#intro-{match.group(2)}{match.group(1)}'
        ),
        intro,
    )

    result = [intro]
    for idx, page_match in enumerate(page_matches):
        uid = page_match.group(1)
        content_start = page_match.end()
        content_end = page_matches[idx + 1].start() if idx + 1 < len(page_matches) else len(doc_html)
        result.append(page_match.group(0))
        result.append(prefix_heading_ids(doc_html[content_start:content_end], uid))

    return "".join(result)


def resolve_remaining_duplicate_ids(doc_html: str) -> str:
    """Append -2, -3, etc to remaining duplicate IDs."""
    seen_ids: dict[str, int] = {}

    def make_unique_id(match: re.Match[str]) -> str:
        full_match = match.group(0)
        id_value = match.group(1)
        if id_value in seen_ids:
            seen_ids[id_value] += 1
            return full_match.replace(f'id="{id_value}"', f'id="{id_value}-{seen_ids[id_value]}"')
        seen_ids[id_value] = 1
        return full_match

    return re.sub(r'id="([^"]+)"', make_unique_id, doc_html)
