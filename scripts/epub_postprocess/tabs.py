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

"""Tabset flattening for EPUB-friendly output."""

import html
import re


def _extract_div_block(source: str, start_idx: int):
    """Return (block, end_idx) for a nested <div>...</div> block."""
    tag_pattern = re.compile(r"</?div\b[^>]*>", flags=re.IGNORECASE)
    depth = 0
    start = None

    for match in tag_pattern.finditer(source, start_idx):
        token = match.group(0)
        is_close = token.startswith("</")
        if start is None:
            start = match.start()
        if not is_close:
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return source[start:match.end()], match.end()
    return None, None


def _strip_tags(text: str) -> str:
    no_tags = re.sub(r"<[^>]+>", "", text, flags=re.DOTALL)
    return html.unescape(" ".join(no_tags.split()))


def _strip_outer_div(block: str) -> str:
    open_tag = re.match(r"<div\b[^>]*>", block, flags=re.IGNORECASE)
    if not open_tag:
        return block
    close_tag = re.search(r"</div>\s*$", block, flags=re.IGNORECASE)
    if not close_tag:
        return block
    return block[open_tag.end() : close_tag.start()]


def flatten_tabs(doc_html: str) -> str:
    """Convert nav tabs and tab panes into static heading+content blocks."""
    nav_tabs_pattern = re.compile(
        r'<ul[^>]*class="[^"]*\bnav-tabs\b[^"]*"[^>]*>.*?</ul>',
        flags=re.DOTALL | re.IGNORECASE,
    )
    tab_content_open_pattern = re.compile(
        r'<div[^>]*class="[^"]*\btab-content\b[^"]*"[^>]*>',
        flags=re.IGNORECASE,
    )
    pane_open_pattern = re.compile(
        r'<div[^>]*class="[^"]*\btab-pane\b[^"]*"[^>]*>',
        flags=re.IGNORECASE,
    )

    result = []
    cursor = 0
    search_pos = 0

    while True:
        nav_match = nav_tabs_pattern.search(doc_html, search_pos)
        if not nav_match:
            break

        tab_content_open = tab_content_open_pattern.search(doc_html, nav_match.end())
        if not tab_content_open:
            search_pos = nav_match.end()
            continue

        between = doc_html[nav_match.end() : tab_content_open.start()]
        if between.strip():
            search_pos = nav_match.end()
            continue

        tab_block, tab_block_end = _extract_div_block(doc_html, tab_content_open.start())
        if not tab_block:
            search_pos = nav_match.end()
            continue

        labels = []
        for link in re.finditer(
            r'<a[^>]*href="#([^"]+)"[^>]*>(.*?)</a>',
            nav_match.group(0),
            flags=re.DOTALL | re.IGNORECASE,
        ):
            labels.append((link.group(1), _strip_tags(link.group(2))))

        panes = {}
        tab_inner = _strip_outer_div(tab_block)
        pane_pos = 0
        while True:
            pane_open = pane_open_pattern.search(tab_inner, pane_pos)
            if not pane_open:
                break
            pane_block, pane_end = _extract_div_block(tab_inner, pane_open.start())
            if not pane_block:
                break
            pane_id_match = re.search(r'\bid="([^"]+)"', pane_block, flags=re.IGNORECASE)
            pane_id = pane_id_match.group(1) if pane_id_match else None
            if pane_id:
                panes[pane_id] = _strip_outer_div(pane_block).strip()
            pane_pos = pane_end

        if not labels or not panes:
            search_pos = nav_match.end()
            continue

        flattened = ['<div class="epub-tabset">']
        for pane_id, label in labels:
            pane_html = panes.get(pane_id, "").strip()
            if not pane_html:
                continue
            flattened.append(f'<h5 class="epub-tab-title">{label}</h5>')
            flattened.append(pane_html)
        flattened.append("</div>")

        result.append(doc_html[cursor : nav_match.start()])
        result.append("\n".join(flattened))
        cursor = tab_block_end
        search_pos = tab_block_end

    result.append(doc_html[cursor:])
    return "".join(result)
