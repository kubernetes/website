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

"""HTML cleanup steps for EPUB generation."""

import re


def remove_scripts(doc_html: str) -> str:
    """Remove all script tags and inline JS."""
    return re.sub(r"<script[^>]*>.*?</script>", "", doc_html, flags=re.DOTALL | re.IGNORECASE)


def remove_external_stylesheets(doc_html: str) -> str:
    """Remove external stylesheet links, keeping inline styles."""
    return re.sub(
        r'<link[^>]*rel=["\']stylesheet["\'][^>]*/?>',
        "",
        doc_html,
        flags=re.IGNORECASE,
    )


def remove_whats_next_sections(doc_html: str) -> str:
    """Remove What's next sections to reduce noisy link-heavy content."""
    return re.sub(
        r'<h[2-6][^>]*id="[^"]*what-?s-?next[^"]*"[^>]*>.*?'
        r'(?=<h[1-4][^>]*id="pg-[^"]*"|<h[12][ >]|</body>)',
        "",
        doc_html,
        flags=re.DOTALL | re.IGNORECASE,
    )


def strip_docsy_ui_elements(doc_html: str) -> str:
    """Strip interactive Docsy elements that do not make sense in EPUB."""
    patterns = [
        r'<div[^>]*class="[^"]*d-print-none[^"]*"[^>]*>.*?</div>',
        r'<div[^>]*class="[^"]*pageinfo[^"]*"[^>]*>.*?</div>',
        r'<div[^>]*id="feedback"[^>]*>.*?</div>',
        r'<a[^>]*class="[^"]*td-page-meta--edit[^"]*"[^>]*>.*?</a>',
        r'<button[^>]*class="[^"]*copy-code[^"]*"[^>]*>.*?</button>',
    ]
    for pattern in patterns:
        doc_html = re.sub(pattern, "", doc_html, flags=re.DOTALL | re.IGNORECASE)

    return re.sub(
        r'<img[^>]*src="[^"]*copycode[^"]*"[^>]*/?>',
        "",
        doc_html,
        flags=re.IGNORECASE,
    )


def demote_content_headings(doc_html: str) -> str:
    """Demote content headings so EPUB TOC follows sidebar hierarchy."""

    def demote_heading(match: re.Match[str]) -> str:
        tag = match.group(1)
        attrs = match.group(2)
        content = match.group(3)
        if 'id="pg-' in attrs:
            return match.group(0)

        level = int(tag[1])
        new_level = min(level + 3, 6)
        return f"<h{new_level}{attrs}>{content}</h{new_level}>"

    return re.sub(
        r"<(h[2-6])([^>]*)>(.*?)</(h[2-6])>",
        demote_heading,
        doc_html,
        flags=re.DOTALL,
    )


def clean_empty_elements(doc_html: str) -> str:
    """Remove empty tags left behind after other cleanup steps."""
    doc_html = re.sub(r"<div[^>]*>\s*</div>", "", doc_html)
    doc_html = re.sub(r"<span[^>]*>\s*</span>", "", doc_html)
    return doc_html
