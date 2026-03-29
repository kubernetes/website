#!/usr/bin/env python3
"""
Content-based outdated detection for Kubernetes localized documentation.

Detects potentially outdated translations by structurally comparing the current
English and localized files, rather than relying on commit chronology or timestamps.

This approach fixes two failure modes of existing tools:
  - False positives: cosmetic upstream edits (formatting, links, shortcodes)
    that do not require translation updates
  - False negatives: localized typo-fix commits that mask real upstream drift
    by advancing the "sync point"

Usage:
    python3 content_based_outdated.py content/ko/docs/tasks/foo.md
    python3 content_based_outdated.py content/ko/docs/ --format json
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional, Tuple


# ---------------------------------------------------------------------------
# Layer 1: File Discovery & Path Mapping
# ---------------------------------------------------------------------------

def to_english_path(localized_path: str) -> str:
    """Map a localized content path to its English counterpart.

    Reuses the pattern from lsync.sh (sed) and upstream_changes.py (find_reference).
    Handles variable-length language codes (e.g. ko, zh-cn, pt-br).

    Examples:
        content/ko/docs/foo.md  -> content/en/docs/foo.md
        content/zh-cn/docs/a.md -> content/en/docs/a.md
    """
    return re.sub(r'content/[^/]+/', 'content/en/', localized_path)


def discover_file_pairs(path: str) -> List[Tuple[str, str]]:
    """Discover (english_path, localized_path) pairs.

    If path is a file, returns a single pair.
    If path is a directory, walks all .md files and pairs each with its English
    counterpart (inspired by report-outdated-by-mod.py get_file_info()).
    """
    pairs = []

    if os.path.isfile(path):
        en_path = to_english_path(path)
        pairs.append((en_path, path))
    elif os.path.isdir(path):
        for root, _dirs, files in os.walk(path):
            for fname in sorted(files):
                if not fname.endswith('.md'):
                    continue
                l10n_path = os.path.join(root, fname)
                en_path = to_english_path(l10n_path)
                pairs.append((en_path, l10n_path))
    else:
        print(f"Error: path not found: {path}", file=sys.stderr)
        sys.exit(1)

    return pairs


# ---------------------------------------------------------------------------
# Layer 2: Structural Comparison Engine
# ---------------------------------------------------------------------------

class BlockType(Enum):
    HEADING = "heading"
    PARAGRAPH = "paragraph"
    CODE_BLOCK = "code_block"
    SHORTCODE = "shortcode"
    LIST_ITEM = "list_item"


@dataclass
class Block:
    """A structural block parsed from a markdown document."""
    block_type: BlockType
    content: str
    heading_level: int = 0  # only for HEADING blocks
    anchor: Optional[str] = None  # extracted {#anchor} from heading


@dataclass
class Section:
    """A section is a heading plus all blocks under it until the next heading."""
    heading: Optional[Block]
    blocks: List[Block] = field(default_factory=list)
    position: int = 0  # ordinal position among sibling headings


# -- Stage 1: Normalization --------------------------------------------------

def normalize_markdown(text: str) -> str:
    """Strip frontmatter, HTML comments, and normalize whitespace.

    Reuses the comment-stripping pattern from report-outdated-by-mod.py
    calculate_similarity().
    """
    # Strip YAML frontmatter
    text = re.sub(r'^---\n.*?\n---\n', '', text, count=1, flags=re.DOTALL)

    # Strip HTML comments
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)

    # Normalize whitespace: collapse multiple blank lines into one
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Strip trailing whitespace per line
    text = '\n'.join(line.rstrip() for line in text.split('\n'))

    return text.strip()


# -- Stage 2: Block Parsing --------------------------------------------------

# Regex patterns
_HEADING_RE = re.compile(r'^(#{1,6})\s+(.+)$')
_FENCE_RE = re.compile(r'^```')
_SHORTCODE_OPEN_RE = re.compile(r'^\{\{[<%]\s*.*\s*[>%]\}\}')
_SHORTCODE_CLOSE_RE = re.compile(r'^\{\{[<%]\s*/.*\s*[>%]\}\}')
_LIST_RE = re.compile(r'^(\s*[-*+]|\s*\d+\.)\s+')

# Intra-paragraph drift heuristics
# Matches a documentation note/warning callout at the start of a sentence:
#   "...previous text. Note that this may change..." or standalone "Warning: ..."
# These patterns are commonly appended to EN paragraphs without a corresponding
# localization update, making them a lightweight signal for prose drift.
_DOC_NOTE_SENTENCE_RE = re.compile(
    r'(?:^|(?<=\. ))(?:Note that |Note: |Warning: |Caution: |Important: |Deprecated: |Tip: )',
    re.IGNORECASE,
)

# Heading drift heuristic: trailing parenthetical qualifier in EN heading text.
# Matches patterns like "(Updated)", "(Deprecated)", "(New)" that are often
# appended to headings without a corresponding localization update.
_HEADING_QUALIFIER_RE = re.compile(r'\(([A-Za-z][A-Za-z\s]{0,25})\)\s*$')


def parse_blocks(text: str) -> List[Block]:
    """Parse normalized markdown into a flat sequence of typed blocks."""
    blocks: List[Block] = []
    lines = text.split('\n')
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]

        # Skip blank lines
        if not line.strip():
            i += 1
            continue

        # Heading
        m = _HEADING_RE.match(line)
        if m:
            heading_content = m.group(2).strip()
            anchor = None
            
            # Extract {#anchor} if present
            anchor_match = re.search(r'\{#([^}]+)\}', heading_content)
            if anchor_match:
                anchor = anchor_match.group(1).strip()
                # Remove anchor from the content for exact text matching
                heading_content = heading_content[:anchor_match.start()].strip()
            
            blocks.append(Block(
                block_type=BlockType.HEADING,
                content=heading_content,
                heading_level=len(m.group(1)),
                anchor=anchor,
            ))
            i += 1
            continue

        # Fenced code block
        if _FENCE_RE.match(line):
            code_lines = [line]
            i += 1
            while i < n and not _FENCE_RE.match(lines[i]):
                code_lines.append(lines[i])
                i += 1
            if i < n:
                code_lines.append(lines[i])
                i += 1
            blocks.append(Block(
                block_type=BlockType.CODE_BLOCK,
                content='\n'.join(code_lines),
            ))
            continue

        # Shortcode (opening or closing)
        if _SHORTCODE_OPEN_RE.match(line) or _SHORTCODE_CLOSE_RE.match(line):
            blocks.append(Block(
                block_type=BlockType.SHORTCODE,
                content=line.strip(),
            ))
            i += 1
            continue

        # List item — one block per top-level item so that adding or removing
        # individual items changes the count and is detectable by comparison.
        if _LIST_RE.match(line):
            item_lines = [line]
            i += 1
            # Consume only indented continuation lines belonging to this item.
            # A new unindented list item starts the next block.
            while i < n and lines[i].strip() and lines[i].startswith('  '):
                item_lines.append(lines[i])
                i += 1
            blocks.append(Block(
                block_type=BlockType.LIST_ITEM,
                content='\n'.join(item_lines),
            ))
            continue

        # Paragraph: contiguous non-blank lines
        para_lines = [line]
        i += 1
        while i < n and lines[i].strip() and not _HEADING_RE.match(lines[i]) \
                and not _FENCE_RE.match(lines[i]) \
                and not _SHORTCODE_OPEN_RE.match(lines[i]) \
                and not _SHORTCODE_CLOSE_RE.match(lines[i]) \
                and not _LIST_RE.match(lines[i]):
            para_lines.append(lines[i])
            i += 1
        blocks.append(Block(
            block_type=BlockType.PARAGRAPH,
            content='\n'.join(para_lines),
        ))

    return blocks


# -- Stage 3: Section Alignment ----------------------------------------------

def group_into_sections(blocks: List[Block]) -> List[Section]:
    """Group blocks into sections based on headings.

    The first section (before any heading) is the "root" section.
    """
    sections: List[Section] = []
    current = Section(heading=None, position=0)

    heading_counter = 0
    for block in blocks:
        if block.block_type == BlockType.HEADING:
            # Save the current section if it has content
            if current.blocks or current.heading is not None:
                sections.append(current)
            heading_counter += 1
            current = Section(heading=block, position=heading_counter)
        else:
            current.blocks.append(block)

    # Don't forget the last section
    if current.blocks or current.heading is not None:
        sections.append(current)

    return sections


def normalize_heading(text: str) -> str:
    """Normalize heading text for alignment."""
    text = text.strip().lower()
    text = re.sub(r'\s+', ' ', text)
    return text


def extract_technical_tokens(text: str) -> set:
    """Extract language-neutral technical identifiers from heading text.

    These tokens are typically preserved verbatim in translations:
      - ALL_CAPS identifiers (e.g. JOB_COMPLETION_INDEX, HTTP)
      - CamelCase identifiers (e.g. ConfigMap, StatefulSet)
      - Backtick-quoted terms
      - Version strings (e.g. v1.21)
      - Kubernetes resource paths (e.g. batch.kubernetes.io/job-completion-index)
    """
    tokens: set = set()
    # Backtick-quoted terms
    for m in re.finditer(r'`([^`]+)`', text):
        tokens.add(m.group(1).strip())
    # ALL_CAPS identifiers (3+ chars, may include digits/underscores)
    for m in re.finditer(r'\b([A-Z][A-Z0-9_]{2,})\b', text):
        tokens.add(m.group(1))
    # CamelCase identifiers (two or more capital letters interspersed, like ConfigMap)
    for m in re.finditer(r'\b([A-Z][a-z]+(?:[A-Z][a-z]*)+)\b', text):
        tokens.add(m.group(1))
    # Version strings
    for m in re.finditer(r'\bv\d+\.\d+\b', text):
        tokens.add(m.group(0))
    # Kubernetes-style dotted/slashed paths (e.g. batch.kubernetes.io/...)
    for m in re.finditer(r'\b[a-z][a-z0-9-]+\.[a-z][a-z0-9.-]+(?:/[a-z][a-z0-9-]*)?\b', text):
        tokens.add(m.group(0))
    return tokens


def extract_code_tokens(code_content: str) -> set:
    """Extract significant non-comment tokens from a fenced code block.

    Strips:
      - Fence lines (``` or ~~~)
      - Pure comment lines (starting with #, //, --)
      - Inline shell comments (everything after ' # ' on a command line)
    Returns the remaining whitespace-split tokens of length > 1.
    """
    tokens: set = set()
    for line in code_content.split('\n'):
        stripped = line.strip()
        # Skip fence markers
        if stripped.startswith('```') or stripped.startswith('~~~'):
            continue
        # Skip blank lines
        if not stripped:
            continue
        # Skip pure comment lines
        if (stripped.startswith('#') or stripped.startswith('//')
                or stripped.startswith('--')):
            continue
        # Strip inline shell comments
        for sep in (' # ', ' // '):
            if sep in line:
                line = line[:line.index(sep)]
        for tok in line.split():
            if len(tok) > 1:
                tokens.add(tok)
    return tokens


def split_root_and_headed(sections: List[Section]) -> Tuple[Optional[Section], List[Section]]:
    """Split sections into an optional root section and a list of headed sections."""
    root = None
    headed = []
    for sec in sections:
        if sec.heading is None:
            root = sec
        else:
            headed.append(sec)
    return root, headed


def align_sections(
    en_sections: List[Section],
    l10n_sections: List[Section],
) -> List[Tuple[Optional[Section], Optional[Section], str]]:
    """Align English sections with localized sections using a four-pass strategy.

    Pass 1 — Anchor match (highest confidence)
        Sections that share an explicit {#anchor} are matched first.

    Pass 2 — Exact normalized heading text match
        Catches headings preserved verbatim across languages, such as Hugo
        shortcode headings like {{% heading "prerequisites" %}}.

    Pass 3 — Technical token overlap
        Matches headings that share preserved technical identifiers
        (CamelCase, ALL_CAPS, backtick terms, version strings) even when
        surrounding text is translated.

    Pass 4 — Positional fallback
        Remaining unmatched sections are aligned by ordinal position among
        sections at the same heading depth.  This is the key fix for
        documents where all headings are translated: without positional
        alignment, every translated section would be reported as
        "missing", producing false positives on every NOT_OUTDATED scenario.
    """
    en_root, en_headed = split_root_and_headed(en_sections)
    l10n_root, l10n_headed = split_root_and_headed(l10n_sections)

    aligned = []

    # --- Root sections ---
    if en_root or l10n_root:
        aligned.append((en_root, l10n_root, "root"))

    # Index l10n sections for fast lookup
    l10n_by_anchor: dict = {}
    l10n_by_name: dict = {}
    for idx, sec in enumerate(l10n_headed):
        if sec.heading.anchor:
            l10n_by_anchor.setdefault(sec.heading.anchor.lower(), []).append((idx, sec))
        l10n_by_name.setdefault(
            normalize_heading(sec.heading.content), []
        ).append((idx, sec))

    used_en: set = set()
    used_l10n: set = set()

    # --- Pass 1: Anchor match ---
    for en_idx, en_sec in enumerate(en_headed):
        if not en_sec.heading.anchor:
            continue
        for l10n_idx, l10n_sec in l10n_by_anchor.get(en_sec.heading.anchor.lower(), []):
            if l10n_idx not in used_l10n:
                aligned.append((en_sec, l10n_sec, "anchor_match"))
                used_en.add(en_idx)
                used_l10n.add(l10n_idx)
                break

    # --- Pass 2: Exact normalized heading text match ---
    for en_idx, en_sec in enumerate(en_headed):
        if en_idx in used_en:
            continue
        key = normalize_heading(en_sec.heading.content)
        for l10n_idx, l10n_sec in l10n_by_name.get(key, []):
            if l10n_idx not in used_l10n:
                aligned.append((en_sec, l10n_sec, "heading_match"))
                used_en.add(en_idx)
                used_l10n.add(l10n_idx)
                break

    # --- Pass 3: Technical token overlap ---
    # Build per-token index over still-unmatched l10n sections
    l10n_token_index: dict = {}  # token -> [(l10n_idx, sec), ...]
    for l10n_idx, l10n_sec in enumerate(l10n_headed):
        if l10n_idx in used_l10n:
            continue
        for tok in extract_technical_tokens(l10n_sec.heading.content):
            l10n_token_index.setdefault(tok, []).append((l10n_idx, l10n_sec))

    for en_idx, en_sec in enumerate(en_headed):
        if en_idx in used_en:
            continue
        en_tokens = extract_technical_tokens(en_sec.heading.content)
        if not en_tokens:
            continue
        # Score each candidate l10n section by token overlap
        scores: dict = {}  # l10n_idx -> overlap_count
        for tok in en_tokens:
            for l10n_idx, _ in l10n_token_index.get(tok, []):
                if l10n_idx not in used_l10n:
                    scores[l10n_idx] = scores.get(l10n_idx, 0) + 1
        if not scores:
            continue
        best_l10n_idx = max(scores, key=lambda k: scores[k])
        best_l10n_sec = l10n_headed[best_l10n_idx]
        aligned.append((en_sec, best_l10n_sec, "token_match"))
        used_en.add(en_idx)
        used_l10n.add(best_l10n_idx)
        # Remove matched l10n section from token index
        for tok in extract_technical_tokens(best_l10n_sec.heading.content):
            l10n_token_index[tok] = [
                (i, s) for (i, s) in l10n_token_index.get(tok, [])
                if i != best_l10n_idx
            ]

    # --- Pass 4: Positional fallback by heading depth ---
    # Collect remaining unmatched sections preserving document order.
    en_remaining = [(i, s) for i, s in enumerate(en_headed) if i not in used_en]
    l10n_remaining = [(i, s) for i, s in enumerate(l10n_headed) if i not in used_l10n]

    # Group by heading level and align within each level.
    # Within each level, sections appear in document order, so ordinal
    # position is a reliable proxy for "same section" in translated docs.
    en_by_level: dict = {}
    for i, s in en_remaining:
        en_by_level.setdefault(s.heading.heading_level, []).append((i, s))
    l10n_by_level: dict = {}
    for i, s in l10n_remaining:
        l10n_by_level.setdefault(s.heading.heading_level, []).append((i, s))

    positional_used_l10n: set = set()
    for level, en_group in en_by_level.items():
        l10n_group = [
            (i, s) for (i, s) in l10n_by_level.get(level, [])
            if i not in positional_used_l10n
        ]
        for rank, (en_idx, en_sec) in enumerate(en_group):
            if rank < len(l10n_group):
                l10n_idx, l10n_sec = l10n_group[rank]
                aligned.append((en_sec, l10n_sec, "position_match"))
                used_en.add(en_idx)
                positional_used_l10n.add(l10n_idx)
                used_l10n.add(l10n_idx)
            else:
                aligned.append((en_sec, None, "missing_section"))

    # Any l10n sections still unmatched are extra
    for l10n_idx, l10n_sec in l10n_remaining:
        if l10n_idx not in used_l10n:
            aligned.append((None, l10n_sec, "extra_localized_section"))

    return aligned


def _block_type_counts(section: Optional[Section]) -> dict:
    """Count block types in a section (excluding the heading itself)."""
    if section is None:
        return {}
    counts = {}
    for b in section.blocks:
        counts[b.block_type] = counts.get(b.block_type, 0) + 1
    return counts


def _is_navigation_section(section: Optional[Section]) -> bool:
    """Return True if this section is a navigation/links section.

    The Kubernetes docs use ``{{% heading "whatsnext" %}}`` for a trailing
    section that lists related pages.  Translations frequently omit or add
    links there without any corresponding need to re-translate the main
    content, so list-count differences in that section should not be treated
    as structural drift.
    """
    if section is None or section.heading is None:
        return False
    return 'whatsnext' in section.heading.content.lower()


# -- Stage 4 & 5: Comparison + Cosmetic Filtering ----------------------------

@dataclass
class SectionDiff:
    """Describes a structural difference in one section."""
    section_name: str
    signals: List[str] = field(default_factory=list)
    is_low_severity: bool = False


@dataclass
class FileResult:
    """Result of comparing one (english, localized) file pair."""
    localized_path: str
    english_path: str
    status: str  # "up_to_date" or "candidate_outdated" or "outdated_low_severity"
    section_diffs: List[SectionDiff] = field(default_factory=list)
    error: Optional[str] = None


def _section_display_name(section: Section) -> str:
    if section.heading is None:
        return "(root)"
    return section.heading.content


def compare_file_pair(en_path: str, l10n_path: str) -> FileResult:
    """Compare an English file with its localized counterpart structurally."""

    # Handle missing files
    if not os.path.exists(en_path):
        return FileResult(
            localized_path=l10n_path,
            english_path=en_path,
            status="no_english_version",
            error=f"English source not found: {en_path}",
        )
    if not os.path.exists(l10n_path):
        return FileResult(
            localized_path=l10n_path,
            english_path=en_path,
            status="not_translated",
            error=f"Localized file not found: {l10n_path}",
        )

    # Read and normalize
    with open(en_path, 'r', encoding='utf-8') as f:
        en_text = normalize_markdown(f.read())
    with open(l10n_path, 'r', encoding='utf-8') as f:
        l10n_text = normalize_markdown(f.read())

    # Parse blocks
    en_blocks = parse_blocks(en_text)
    l10n_blocks = parse_blocks(l10n_text)

    # Group into sections
    en_sections = group_into_sections(en_blocks)
    l10n_sections = group_into_sections(l10n_blocks)

    # Align sections 
    aligned_pairs = align_sections(en_sections, l10n_sections)
    diffs: List[SectionDiff] = []

    for en_sec, l10n_sec, match_type in aligned_pairs:
        # Handle matching missing/extra logic based on match_type
        if match_type in ("missing_section", "alignment_uncertainty"):
            name = _section_display_name(en_sec)
            msg = f"Section \"{name}\" exists in English but is missing in localized file"
            if match_type == "alignment_uncertainty":
                msg = f"Alignment uncertainty: Section \"{name}\" exists elsewhere but couldn't be cleanly matched"
                
            diffs.append(SectionDiff(
                section_name=name,
                signals=[msg],
            ))
            continue
            
        if match_type == "extra_localized_section":
            continue

        if en_sec is None and l10n_sec is not None:
            continue
            
        if en_sec is not None and l10n_sec is None:
            if match_type != "root":
                name = _section_display_name(en_sec)
                diffs.append(SectionDiff(
                    section_name=name,
                    signals=[f"Section \"{name}\" exists in English but is missing in localized file"],
                ))
                continue

        # Both exist — compare block type counts
        en_counts = _block_type_counts(en_sec)
        l10n_counts = _block_type_counts(l10n_sec)

        section_name = _section_display_name(en_sec) if en_sec is not None else "(root)"
        signals = []
        only_shortcode_diffs = True

        for btype in BlockType:
            if btype == BlockType.HEADING:
                continue  # headings are section delimiters, not compared here
            # Skip list-item counting for "whatsnext" navigation sections.
            # Translations often omit or add navigation links there without
            # the main content requiring a re-translation, so a list-count
            # delta in that section is not a reliable signal of staleness.
            if btype == BlockType.LIST_ITEM and _is_navigation_section(en_sec):
                continue
            en_count = en_counts.get(btype, 0)
            l10n_count = l10n_counts.get(btype, 0)

            if en_count > l10n_count:
                diff_count = en_count - l10n_count
                type_label = btype.value.replace('_', ' ')
                signals.append(
                    f"English has {en_count} {type_label}(s), "
                    f"localized has {l10n_count} "
                    f"(+{diff_count} in English)"
                )
                if btype != BlockType.SHORTCODE:
                    only_shortcode_diffs = False

        # Intra-block: compare code block content when counts are equal.
        # Code blocks are language-neutral, so content differences signal
        # that the English source was updated after the translation was done.
        # Comments are stripped before comparison (translators localize them).
        en_codes = [b for b in en_sec.blocks if b.block_type == BlockType.CODE_BLOCK]
        l10n_codes = [b for b in l10n_sec.blocks if b.block_type == BlockType.CODE_BLOCK]
        if en_codes and len(en_codes) == len(l10n_codes):
            for i, (en_cb, l10n_cb) in enumerate(zip(en_codes, l10n_codes)):
                en_toks = extract_code_tokens(en_cb.content)
                l10n_toks = extract_code_tokens(l10n_cb.content)
                new_in_en = en_toks - l10n_toks
                # Filter noise: keep tokens that look like commands/flags/identifiers
                significant = {
                    t for t in new_in_en
                    if len(t) >= 2 and re.search(r'[a-zA-Z0-9]', t)
                }
                if significant:
                    sample = ', '.join(sorted(significant)[:5])
                    signals.append(
                        f"Code block {i + 1} content changed: "
                        f"EN has tokens not in localized version ({sample})"
                    )
                    only_shortcode_diffs = False

        # --- Heading drift: trailing parenthetical qualifier ---
        # Detects when the EN heading gained a qualifier like "(Updated)" or
        # "(Deprecated)" that the localized heading may not yet reflect.
        # Intentionally does NOT clear only_shortcode_diffs so that heading-only
        # drift produces outdated_low_severity rather than candidate_outdated.
        if en_sec is not None and en_sec.heading is not None:
            hm = _HEADING_QUALIFIER_RE.search(en_sec.heading.content)
            if hm:
                qualifier = hm.group(1).strip()
                signals.append(
                    f'EN heading has trailing qualifier "({qualifier})" '
                    f'not reflected in localized heading'
                )

        # --- Intra-paragraph prose drift ---
        # Two heuristics for prose growth inside aligned paragraph pairs.
        # Both require l10n_sec to be non-None (guarded below).
        if l10n_sec is not None:
            en_para_blocks = [b for b in en_sec.blocks if b.block_type == BlockType.PARAGRAPH]
            l10n_para_blocks = [b for b in l10n_sec.blocks if b.block_type == BlockType.PARAGRAPH]
            for en_pb, l10n_pb in zip(en_para_blocks, l10n_para_blocks):
                en_plines = en_pb.content.split('\n')
                l10n_plines = l10n_pb.content.split('\n')

                # Heuristic A: exactly one new line in EN paragraph.
                # delta > 1 is more likely a paragraph reorder artifact; delta == 1
                # is the fingerprint of a single sentence insertion.
                if len(en_plines) - len(l10n_plines) == 1:
                    signals.append(
                        f'English paragraph has 1 more line than localized '
                        f'({len(en_plines)} vs {len(l10n_plines)}) '
                        f'— possible sentence insertion not yet translated'
                    )
                    only_shortcode_diffs = False

                # Heuristic B: EN paragraph ends with a documentation note or
                # warning sentence (e.g. "Note that ...", "Warning: ...").
                # These callouts are frequently appended to EN paragraphs without
                # a corresponding localization update.
                en_last = en_plines[-1]
                if _DOC_NOTE_SENTENCE_RE.search(en_last):
                    signals.append(
                        f'EN paragraph ends with an unlocalized '
                        f'documentation note or warning sentence'
                    )
                    only_shortcode_diffs = False

        if signals:
            diffs.append(SectionDiff(
                section_name=section_name,
                signals=signals,
                is_low_severity=only_shortcode_diffs,
            ))

    if not diffs:
        status = "up_to_date"
    elif all(sd.is_low_severity for sd in diffs):
        status = "outdated_low_severity"
    else:
        status = "candidate_outdated"
        
    return FileResult(
        localized_path=l10n_path,
        english_path=en_path,
        status=status,
        section_diffs=diffs,
    )


# ---------------------------------------------------------------------------
# Output Formatting
# ---------------------------------------------------------------------------

def format_text(results: List[FileResult]) -> str:
    """Format results as human-readable text."""
    lines = []
    for r in results:
        if r.error:
            lines.append(f"{r.localized_path}: {r.status.upper()} ({r.error})")
            continue
        if r.status == "up_to_date":
            lines.append(f"{r.localized_path}: UP_TO_DATE")
        elif r.status == "outdated_low_severity":
            lines.append(f"🔵 {r.localized_path}: OUTDATED (LOW SEVERITY - shortcodes only)")
        else:
            lines.append(f"🟡 {r.localized_path}: OUTDATED")
            
        for sd in r.section_diffs:
            severity_mark = "[LOW] " if sd.is_low_severity else ""
            lines.append(f"  {severity_mark}Section \"{sd.section_name}\":")
            for sig in sd.signals:
                lines.append(f"    - {sig}")
    return '\n'.join(lines)


def format_json(results: List[FileResult]) -> str:
    """Format results as JSON."""
    output = []
    for r in results:
        entry = {
            "file": r.localized_path,
            "status": r.status,
        }
        if r.error:
            entry["error"] = r.error
        if r.section_diffs:
            entry["changed_sections"] = [sd.section_name for sd in r.section_diffs]
            entry["signals"] = []
            for sd in r.section_diffs:
                for sig in sd.signals:
                    entry["signals"].append(f"{sd.section_name}: {sig}")
        output.append(entry)
    return json.dumps(output, indent=2, ensure_ascii=False)


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Detect potentially outdated localized Kubernetes documentation "
                    "using content-based structural comparison.",
    )
    # Two usage modes:
    #   Mode A (eval-runner contract):  script.py <en_path> <l10n_path>
    #   Mode B (legacy single-path):    script.py <l10n_path_or_dir> [--format text|json]
    parser.add_argument(
        "path",
        help="Localized file or directory (legacy mode), or English file path "
             "when l10n_path is also supplied (eval-runner mode).",
    )
    parser.add_argument(
        "l10n_path",
        nargs="?",
        default=None,
        help="Localized file path (eval-runner mode: script.py <en_path> <l10n_path>).",
    )
    parser.add_argument(
        "--format",
        choices=["text", "json"],
        default="text",
        dest="output_format",
        help="Output format (default: text).  Ignored in eval-runner mode "
             "(JSON is always emitted when l10n_path is supplied).",
    )
    args = parser.parse_args()

    if args.l10n_path is not None:
        # Eval-runner mode: two explicit paths, always emit JSON.
        pairs = [(args.path, args.l10n_path)]
        results = [compare_file_pair(en, l10n) for en, l10n in pairs]
        print(format_json(results))
    else:
        # Legacy mode: discover pairs from a localized path or directory.
        pairs = discover_file_pairs(args.path)
        if not pairs:
            print("No .md files found.", file=sys.stderr)
            sys.exit(1)
        results = [compare_file_pair(en, l10n) for en, l10n in pairs]
        if args.output_format == "json":
            print(format_json(results))
        else:
            print(format_text(results))

    # Exit with non-zero if any file is outdated
    if any(r.status == "candidate_outdated" for r in results):
        sys.exit(1)
    sys.exit(0)


if __name__ == '__main__':
    main()
