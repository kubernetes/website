#!/usr/bin/env python3
"""Post-process Hugo-generated EPUB HTML for pandoc conversion.

Cleans the HTML by removing scripts, external styles, UI elements,
"What's Next" sections, and deduplicating heading IDs across pages.
"""

import argparse
import html
import os
import re
import sys
from urllib.parse import urlsplit

def remove_scripts(html: str) -> str:
    """Remove all <script> tags and their contents."""
    return re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)

def remove_external_stylesheets(html: str) -> str:
    """Remove external <link rel='stylesheet'> tags (keep inline <style>)."""
    return re.sub(r'<link[^>]*rel=["\']stylesheet["\'][^>]*/?>',
                  '', html, flags=re.IGNORECASE)

def remove_whats_next_sections(html: str) -> str:
    """Remove 'What's next' sections — they're link-heavy and break reader flow."""
    # Remove the section up to the next page marker (id="pg-*"), next top section
    # heading, or end-of-document.
    #
    # Why this boundary matters:
    # - EPUB page titles are emitted as h1..h4 with id="pg-..."
    # - a broad "until next h2" pattern can eat real content under nested pages
    # - stopping at the next pg marker preserves the next logical chapter/page
    return re.sub(
        r'<h[2-6][^>]*id="[^"]*what-?s-?next[^"]*"[^>]*>.*?'
        r'(?=<h[1-4][^>]*id="pg-[^"]*"|<h[12][ >]|</body>)',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )

def strip_docsy_ui_elements(html: str) -> str:
    """Remove Docsy-specific interactive UI elements."""
    # Remove elements with d-print-none class (print-hidden UI)
    html = re.sub(
        r'<div[^>]*class="[^"]*d-print-none[^"]*"[^>]*>.*?</div>',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )
    # Remove pageinfo blocks (the "this is a printable version" notice)
    html = re.sub(
        r'<div[^>]*class="[^"]*pageinfo[^"]*"[^>]*>.*?</div>',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )
    # Remove feedback sections
    html = re.sub(
        r'<div[^>]*id="feedback"[^>]*>.*?</div>',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )
    # Remove "edit this page" links
    html = re.sub(
        r'<a[^>]*class="[^"]*td-page-meta--edit[^"]*"[^>]*>.*?</a>',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )
    # Remove copy-code buttons
    html = re.sub(
        r'<button[^>]*class="[^"]*copy-code[^"]*"[^>]*>.*?</button>',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )
    html = re.sub(
        r'<img[^>]*src="[^"]*copycode[^"]*"[^>]*/?>',
        '', html, flags=re.IGNORECASE
    )
    return html


def _extract_div_block(source: str, start_idx: int):
    """Return (block, end_idx) for a <div>...</div> block at start_idx."""
    tag_pattern = re.compile(r'</?div\b[^>]*>', flags=re.IGNORECASE)
    depth = 0
    start = None

    for match in tag_pattern.finditer(source, start_idx):
        token = match.group(0)
        is_close = token.startswith('</')
        if start is None:
            start = match.start()
        if not is_close:
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                end = match.end()
                return source[start:end], end
    return None, None


def _strip_tags(text: str) -> str:
    no_tags = re.sub(r'<[^>]+>', '', text, flags=re.DOTALL)
    return html.unescape(' '.join(no_tags.split()))


def _strip_outer_div(block: str) -> str:
    open_tag = re.match(r'<div\b[^>]*>', block, flags=re.IGNORECASE)
    if not open_tag:
        return block
    close_tag = re.search(r'</div>\s*$', block, flags=re.IGNORECASE)
    if not close_tag:
        return block
    return block[open_tag.end():close_tag.start()]


def flatten_tabs(html_doc: str) -> str:
    """Convert JS tabs into static EPUB-friendly sections.

    Keeps all pane content and replaces interactive tab controls with headings.
    """
    nav_tabs_pattern = re.compile(
        r'<ul[^>]*class="[^"]*\bnav-tabs\b[^"]*"[^>]*>.*?</ul>',
        flags=re.DOTALL | re.IGNORECASE
    )
    tab_content_open_pattern = re.compile(
        r'<div[^>]*class="[^"]*\btab-content\b[^"]*"[^>]*>',
        flags=re.IGNORECASE
    )
    pane_open_pattern = re.compile(
        r'<div[^>]*class="[^"]*\btab-pane\b[^"]*"[^>]*>',
        flags=re.IGNORECASE
    )

    result = []
    cursor = 0
    search_pos = 0

    while True:
        nav_match = nav_tabs_pattern.search(html_doc, search_pos)
        if not nav_match:
            break

        tab_content_open = tab_content_open_pattern.search(html_doc, nav_match.end())
        if not tab_content_open:
            search_pos = nav_match.end()
            continue

        between = html_doc[nav_match.end():tab_content_open.start()]
        if between.strip():
            search_pos = nav_match.end()
            continue

        tab_block, tab_block_end = _extract_div_block(html_doc, tab_content_open.start())
        if not tab_block:
            search_pos = nav_match.end()
            continue

        labels = []
        for link in re.finditer(
            r'<a[^>]*href="#([^"]+)"[^>]*>(.*?)</a>',
            nav_match.group(0),
            flags=re.DOTALL | re.IGNORECASE
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
            pane_inner = _strip_outer_div(pane_block)
            if pane_id:
                panes[pane_id] = pane_inner.strip()
            pane_pos = pane_end

        if not labels or not panes:
            search_pos = nav_match.end()
            continue

        flat_parts = ['<div class="epub-tabset">']
        for pane_id, label in labels:
            pane_html = panes.get(pane_id, '').strip()
            if not pane_html:
                continue
            flat_parts.append(f'<h5 class="epub-tab-title">{label}</h5>')
            flat_parts.append(pane_html)
        flat_parts.append('</div>')
        flattened = '\n'.join(flat_parts)

        result.append(html_doc[cursor:nav_match.start()])
        result.append(flattened)
        cursor = tab_block_end
        search_pos = tab_block_end

    result.append(html_doc[cursor:])
    return ''.join(result)


def rewrite_image_paths(html: str, static_dir: str, public_dir: str = '') -> str:
    """Rewrite absolute image paths to filesystem paths for pandoc."""

    def fix_src(match):
        attr = match.group(1)
        path = match.group(2)
        clean_path = path.split('?')[0] if '?' in path else path
        if clean_path.startswith(('http://', 'https://', 'data:')):
            return match.group(0)
        if clean_path.startswith('/'):
            stripped = clean_path.lstrip('/')
            static_path = os.path.join(static_dir, stripped)
            if os.path.exists(static_path):
                return f'{attr}="{static_path}"'
            if public_dir:
                public_path = os.path.join(public_dir, stripped)
                if os.path.exists(public_path):
                    return f'{attr}="{public_path}"'
        return match.group(0)

    return re.sub(r'((?:src|data-src))="([^"]*)"', fix_src, html)

def rewrite_internal_links(html: str, section: str, base_url: str) -> str:
    """Rewrite internal links. Cross-section links become absolute URLs."""
    # Match both:
    # - /docs/<section>/...
    # - /<lang>/docs/<section>/... (for localized docs sets)
    #
    # We keep same-section links internal so EPUB navigation stays offline-friendly.
    # Cross-section links are rewritten to absolute URLs on kubernetes.io.
    return rewrite_internal_links_with_mapping(
        html=html,
        section=section,
        base_url=base_url,
        link_mode="section",
        index_html=[],
    )


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
    docs_path = re.compile(
        r'^/(?:[a-z]{2}(?:-[a-z0-9]+)*/)?docs/([^/#?]+)$',
        flags=re.IGNORECASE,
    )
    match = docs_path.match(normalize_docs_path(path))
    return bool(match and match.group(1) == section.lower())


def build_docs_anchor_index(html_docs):
    page_pattern = re.compile(
        r'<h[1-4]\b(?=[^>]*\bid="pg-([a-f0-9]+)")(?=[^>]*\bdata-docs-path="([^"]+)")[^>]*>',
        flags=re.IGNORECASE
    )
    heading_pattern = re.compile(r'<h[1-6]\b[^>]*\bid="([^"]+)"[^>]*>', flags=re.IGNORECASE)
    intro_heading_pattern = re.compile(r'<h[2-6]\b[^>]*\bid="([^"]+)"[^>]*>', flags=re.IGNORECASE)

    path_to_uid = {}
    uid_to_heading_ids = {}
    intro_heading_ids = set()

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
    html: str,
    section: str,
    base_url: str,
    link_mode: str,
    index_html,
) -> str:
    docs_path = re.compile(
        r'^/(?:([a-z]{2}(?:-[a-z0-9]+)*)/)?docs(?:/([^/#?]+))?',
        flags=re.IGNORECASE
    )
    html_docs_for_index = [html]
    for path in index_html:
        if path:
            with open(path, 'r', encoding='utf-8') as f:
                html_docs_for_index.append(f.read())
    path_to_uid, uid_to_heading_ids, intro_heading_ids = build_docs_anchor_index(html_docs_for_index)

    def make_external(href: str) -> str:
        return f'href="{base_url}{href}"'

    def fix_href(match):
        href = match.group(1)
        if href.startswith(('http://', 'https://', '#', 'mailto:')):
            return match.group(0)

        split = urlsplit(href)
        path_part = split.path
        fragment = split.fragment
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
                    fragment_id = fragment.strip()
                    page_heading_id = f"{uid}-{fragment_id}"
                    if page_heading_id in uid_to_heading_ids.get(uid, set()):
                        return f'href="#{page_heading_id}"'
                    if is_section_root_path(path_part, section):
                        intro_id = f"intro-{fragment_id}"
                        if intro_id in intro_heading_ids:
                            return f'href="#{intro_id}"'
                return f'href="#pg-{uid}"'

            return make_external(href)

        if path_part.startswith('/'):
            return make_external(href)
        return match.group(0)

    return re.sub(r'href="([^"]*)"', fix_href, html)


def deduplicate_heading_ids(html: str) -> str:
    """Prefix heading IDs with the parent page's unique ID to avoid collisions.

    When all doc pages merge into one HTML, headings like 'objectives' and
    'before-you-begin' appear hundreds of times. This prefixes each with
    the page's pg-<hash> to make them unique.
    """
    page_pattern = re.compile(
        r'<h[1-4]\b[^>]*\bid="pg-([a-f0-9]+)"[^>]*>',
        flags=re.IGNORECASE
    )
    # Page boundaries are h1..h4 (not only h1), because EPUB TOC hierarchy mirrors
    # sidebar depth. We split by these markers so heading IDs are scoped per page.
    page_matches = list(page_pattern.finditer(html))

    if not page_matches:
        return html

    def prefix_heading_ids(content: str, uid: str):
        heading_pattern = re.compile(r'<(h[1-6])\b([^>]*?)\bid="([^"]+)"([^>]*)>',
                                     flags=re.IGNORECASE)
        # Collect only non-page-title IDs. pg-* is a structural chapter marker and
        # should never be rewritten, or cross-page anchors will break.
        heading_ids = {
            m.group(3) for m in heading_pattern.finditer(content)
            if not m.group(3).startswith('pg-')
        }

        def prefix_id(m):
            heading_id = m.group(3)
            if heading_id.startswith('pg-'):
                return m.group(0)
            return f'<{m.group(1)}{m.group(2)}id="{uid}-{heading_id}"{m.group(4)}>'

        content = heading_pattern.sub(prefix_id, content)

        def prefix_href(m):
            old_anchor = m.group(1)
            if old_anchor.startswith('pg-'):
                return m.group(0)
            if old_anchor in heading_ids:
                return f'href="#{uid}-{old_anchor}"'
            return m.group(0)

        content = re.sub(r'href="#([^"]+)"', prefix_href, content)
        return content

    # Prefix IDs in the section intro (before first page marker).
    first_page = page_matches[0]
    intro = html[:first_page.start()]
    intro = re.sub(
        r'<(h[2-6])\b([^>]*?)\bid="([^"]+)"([^>]*)>',
        lambda m: f'<{m.group(1)}{m.group(2)}id="intro-{m.group(3)}"{m.group(4)}>',
        intro,
        flags=re.IGNORECASE
    )
    intro = re.sub(
        r'href="#([^"]+)"',
        lambda m: m.group(0) if m.group(1).startswith(('pg-', 'intro-')) else f'href="#intro-{m.group(1)}"',
        intro
    )
    result = [intro]

    for idx, page_match in enumerate(page_matches):
        uid = page_match.group(1)
        content_start = page_match.end()
        content_end = page_matches[idx + 1].start() if idx + 1 < len(page_matches) else len(html)

        result.append(page_match.group(0))
        result.append(prefix_heading_ids(html[content_start:content_end], uid))

    return ''.join(result)

def resolve_remaining_duplicate_ids(html: str) -> str:
    """Append -2, -3, etc. to any still-duplicate IDs."""
    seen_ids = {}

    def make_unique_id(match):
        full_match = match.group(0)
        id_val = match.group(1)
        if id_val in seen_ids:
            seen_ids[id_val] += 1
            new_id = f'{id_val}-{seen_ids[id_val]}'
            return full_match.replace(f'id="{id_val}"', f'id="{new_id}"')
        else:
            seen_ids[id_val] = 1
            return full_match

    return re.sub(r'id="([^"]+)"', make_unique_id, html)

def demote_content_headings(html: str) -> str:
    """Demote non-page-title headings so they don't appear in the EPUB TOC.

    Page titles have id="pg-<hash>" and use h1-h4 based on depth.
    Content headings within pages (h2-h6 without pg- prefix) get demoted
    to h5/h6 so pandoc's --toc-depth=4 skips them. This makes the TOC
    match the website sidebar — only page titles, no internal headings.
    """

    def demote_heading(match):
        tag = match.group(1)       # opening tag name: h2, h3, etc.
        attrs = match.group(2)     # attributes
        content = match.group(3)   # heading text
        # Skip page-title headings (they have id="pg-...")
        if 'id="pg-' in attrs:
            return match.group(0)

        # Demote: h2->h5, h3->h6, h4->h6, h5->h6, h6->h6
        level = int(tag[1])
        new_level = min(level + 3, 6)
        return f'<h{new_level}{attrs}>{content}</h{new_level}>'

    return re.sub(
        r'<(h[2-6])([^>]*)>(.*?)</(h[2-6])>',
        demote_heading, html, flags=re.DOTALL
    )


def clean_empty_elements(html: str) -> str:
    """Remove empty divs and spans left after stripping."""
    html = re.sub(r'<div[^>]*>\s*</div>', '', html)
    html = re.sub(r'<span[^>]*>\s*</span>', '', html)
    return html

def postprocess(input_path: str, output_path: str, section: str,
                static_dir: str, public_dir: str = '',
                base_url: str = "https://kubernetes.io",
                link_mode: str = "section",
                index_html=None) -> None:
    """Run all post-processing steps on the HTML file."""
    if index_html is None:
        index_html = []
    with open(input_path, 'r', encoding='utf-8') as f:
        html = f.read()

    html = remove_scripts(html)
    html = remove_external_stylesheets(html)
    html = remove_whats_next_sections(html)
    html = strip_docsy_ui_elements(html)
    html = flatten_tabs(html)
    html = rewrite_image_paths(html, static_dir, public_dir)
    html = rewrite_internal_links_with_mapping(
        html=html,
        section=section,
        base_url=base_url,
        link_mode=link_mode,
        index_html=index_html,
    )
    html = deduplicate_heading_ids(html)
    html = demote_content_headings(html)
    html = resolve_remaining_duplicate_ids(html)
    html = clean_empty_elements(html)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Post-processed: {input_path} -> {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description='Post-process Hugo HTML for EPUB conversion')
    parser.add_argument('input', help='Input HTML file path')
    parser.add_argument('output', help='Output HTML file path')
    parser.add_argument('--section', required=True,
                        help='Documentation section name (e.g., concepts)')
    parser.add_argument('--static-dir', required=True,
                        help='Path to Hugo static directory')
    parser.add_argument('--public-dir', default='',
                        help='Path to Hugo public (output) directory')
    parser.add_argument('--base-url', default='https://kubernetes.io',
                        help='Base URL for cross-section links')
    parser.add_argument(
        '--link-mode',
        choices=['section', 'combined'],
        default='section',
        help='Link rewrite mode: section or combined',
    )
    parser.add_argument(
        '--index-html',
        action='append',
        default=[],
        help='Additional HTML files to build link-mapping index from (repeatable)',
    )
    args = parser.parse_args()

    postprocess(args.input, args.output, args.section,
                args.static_dir, args.public_dir, args.base_url, args.link_mode, args.index_html)


if __name__ == '__main__':
    main()
