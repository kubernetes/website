#!/usr/bin/env python3

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

"""Localization outdatedness triage helper.

Compares each localized Markdown page against its English source and
classifies it as `Strong signal`, `Moderate signal`, or `No signal`.

New locale note:
    Locales under content/ are auto-discovered when scanning all locales.
    New locales should start with the default LocaleProfile. Add explicit
    calibration only after manual report review shows repeated
    locale-specific false positives or false negatives.

Usage:
    # Scan all non-en locales (default)
    python3 scripts/l10n-outdatedness-triage.py
    
    # Scan specific locales
    python3 scripts/l10n-outdatedness-triage.py --lang ko ja zh-cn
    
    # Show GitHub links + per-file indicator details
    python3 scripts/l10n-outdatedness-triage.py --lang ko --link web --verbose

    # Run with `--help` for the full option list.
    python3 scripts/l10n-outdatedness-triage.py --help
"""

import argparse
import datetime
import os
import re
import sys
from collections import Counter
from dataclasses import dataclass, field
from typing import Dict, FrozenSet, List, Optional, Set, Tuple

# --- Constants ---
# These thresholds are empirically set per locale; 
# a statistical approach (median+MAD from structurally-clean files)
# could replace them with auto-calibrated per-locale values.
_LENGTH_GAP_MIN_EN_LINES = 15      # EN files shorter than this skip all length-gap checks
_SHORT_EN_THRESHOLD = 40           # below this, length gap requires a companion indicator
_CJK_SHORT_EN_THRESHOLD = 56       # same guard for CJK (denser text, files run longer)
_LATIN_MIN_EN_LINES = 55           # Latin compactness guard activates only above this

# Empirical boundary: Latin false alarms sit at >=0.94, real ru mismatch at <=0.85.
_LATIN_BODY_RATIO_MIN = 0.90       # body-word ratio floor for "full translation" in Latin guard

_LENGTH_GAP_NONE = ""
_LENGTH_GAP_SILENT = "silent"
_LENGTH_GAP_SMALL = "small"
_LENGTH_GAP_MODERATE = "moderate"
_LENGTH_GAP_LARGE = "large"

# ASCII-only boundary — Python's `\b` treats CJK as word chars, so plain
# `\bv1\.\b` silently missed `v1.22以降` etc. Captures (major, minor) so
# future Kubernetes major versions compare correctly against v1.x.
_VERSION_RE = re.compile(r"(?<![A-Za-z0-9])v(\d+)\.(\d{1,3})(?!\d)")
_ANCHOR_RE = re.compile(r"\{#([^}]+)\}")
_STRIP_FM = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)
_STRIP_CODE = re.compile(r"```.*?```", re.DOTALL)
_STRIP_CMNT = re.compile(r"<!--.*?-->", re.DOTALL)
_STRIP_INLINE = re.compile(r"`[^`\n]+`")

# Unicode-aware body-word counter for the Latin-compactness check; keeps
# `informação` and Cyrillic words intact.
_BODY_WORD_RE = re.compile(r"[^\W_]{2,}", re.UNICODE)

_FS_VERSION_RE = re.compile(r'for_k8s_version="(v\d+\.\d+)"')
_FS_GATE_RE = re.compile(r'feature_gate_name="([A-Za-z_][A-Za-z0-9_]*)"')
_APIVERSION_LINE_RE = re.compile(
    r"^[ \t]*-?[ \t]*apiVersion:\s*\"?([A-Za-z0-9./_-]+)\"?\s*$", re.MULTILINE
)
_KIND_LINE_RE = re.compile(
    r"^[ \t]*-?[ \t]*kind:\s*\"?([A-Z][A-Za-z0-9]+)\"?\s*$", re.MULTILINE
)

_ORPHAN_SKIP_BASENAMES: FrozenSet[str] = frozenset({
    "README.md", "_search.md", "sitemap.md", "_redirects",
})
_ORPHAN_REASON = (
    "No English source found; verify whether this file was renamed/removed "
    "upstream or is intentionally locale-specific."
)

STATUS_STRONG_SIGNAL = "Strong signal"
STATUS_MODERATE_SIGNAL = "Moderate signal"
STATUS_NO_SIGNAL = "No signal"

# Cutoffs for when missing items count as a "strong" outdatedness signal;
# see classify_status() for how strong signals affect the final status.
_STRONG_H2_THRESHOLD = 2              # missing H2 headings
_STRONG_H3_WITH_H2_THRESHOLD = 5      # missing H3s, plus at least one missing H2
_STRONG_CODE_THRESHOLD = 3            # missing code blocks
_STRONG_ANCHOR_THRESHOLD = 5          # missing section anchors
_STRONG_VERSION_THRESHOLD = 3         # missing newer Kubernetes version refs

_STRONG_INDICATORS: FrozenSet[str] = frozenset({
    "empty_stub", "severe_heading_loss", "severe_code_loss",
    "severe_anchor_loss", "severe_version_mismatch",
})
_SUPPORTING_INDICATORS: FrozenSet[str] = frozenset({
    "large_length_gap", "moderate_length_gap",
    "moderate_heading_loss", "moderate_code_loss",
    "moderate_anchor_loss", "moderate_version_mismatch",
})
# `small_length_gap` is excluded from `_SUPPORTING_INDICATORS`: it only
# triggers the dedicated possibly_outdated rule, never pairs with strong
# indicators or pads ≥3-supporting / large_length_gap promotions.
_LENGTH_GAP_INDICATORS: FrozenSet[str] = frozenset(
    {"large_length_gap", "moderate_length_gap", "small_length_gap"}
)
# Structural indicators (headings, code, anchors, versions, API tokens) —
# excludes length-gap indicators. Used as the corroboration gate for
# `small_length_gap` emission and for rule 4 in `classify_status`.
_NON_LENGTH_INDICATORS: FrozenSet[str] = frozenset({
    "moderate_heading_loss", "severe_heading_loss",
    "moderate_code_loss", "severe_code_loss",
    "moderate_anchor_loss", "severe_anchor_loss",
    "moderate_version_mismatch", "severe_version_mismatch",
    "severe_api_and_feature_mismatch",
})

_STATUS_SORT_KEY = {
    STATUS_STRONG_SIGNAL: 0,
    STATUS_MODERATE_SIGNAL: 1,
    STATUS_NO_SIGNAL: 2,
}

# New locale calibration guide:
#
# - Locales under content/ are auto-discovered; adding a locale directory is
#   enough for the script to scan it.
# - Start with the default LocaleProfile. Add an explicit profile only to
#   record known properties such as script or text direction, or after manual
#   review shows repeated locale-specific false alarms / blindspots.
# - Suggested first run:
#     python3 scripts/l10n-outdatedness-triage.py --lang <locale> --verbose
# - Manually compare flagged localized files with their English sources, then
#   classify findings as real drift, false alarm, or mixed.
# - Add calibration only for repeated patterns, and document the reason in
#   the LocaleProfile notes field.

# --- Locale profiles ---

@dataclass(frozen=True)
class LocaleProfile:
    """Centralizes locale-specific calibration so adding a new locale is a
    single map entry rather than a scattering of conditionals."""

    script: str = "unknown"
    direction: str = "ltr"

    # Length-gap behavior
    short_en_threshold: int = _SHORT_EN_THRESHOLD
    min_en_lines_for_length_gap: int = _LENGTH_GAP_MIN_EN_LINES
    ignore_only_length_gap: bool = False

    # Optional compactness guard (Latin-script: word counts behave like EN)
    compactness_guard: bool = False
    compactness_min_en_lines: int = _LATIN_MIN_EN_LINES
    body_word_ratio_min: float = _LATIN_BODY_RATIO_MIN

    # Free-form note recording empirical rationale or future calibration plans.
    notes: str = ""


_DEFAULT_LOCALE_PROFILE = LocaleProfile()

_LOCALE_PROFILES: Dict[str, LocaleProfile] = {
    # CJK: denser glyphs run shorter at the same content volume, so raise
    # the short-EN floor before length gaps are trusted.
    "ko": LocaleProfile(script="cjk", short_en_threshold=_CJK_SHORT_EN_THRESHOLD),
    "ja": LocaleProfile(
        script="cjk",
        short_en_threshold=_CJK_SHORT_EN_THRESHOLD,
        ignore_only_length_gap=True,
        notes=(
            "Japanese can produce line-count-only false alarms because "
            "physical wrapping differs from English; non-length structural "
            "signals are still checked."
        ),
    ),
    "zh-cn": LocaleProfile(script="cjk", short_en_threshold=_CJK_SHORT_EN_THRESHOLD),
    "zh-tw": LocaleProfile(script="cjk", short_en_threshold=_CJK_SHORT_EN_THRESHOLD),

    # Latin-script locales whose word counts behave like EN's: full
    # translations run loose-wrapped at high body-word ratios.
    "pt-br": LocaleProfile(
        script="latin",
        compactness_guard=True,
        notes=(
            "Latin-script compactness guard can suppress line-count-only false "
            "alarms when a localized page has high body-word ratio, because "
            "full translations may wrap differently from English. Non-length "
            "structural signals are still checked."
        ),
    ),
    "es": LocaleProfile(
        script="latin",
        compactness_guard=True,
        notes=(
            "Latin-script compactness guard can suppress line-count-only false "
            "alarms when a localized page has high body-word ratio, because "
            "full translations may wrap differently from English. Non-length "
            "structural signals are still checked."
        ),
    ),
    "de": LocaleProfile(
        script="latin",
        compactness_guard=True,
        notes=(
            "Latin-script compactness guard can suppress line-count-only false "
            "alarms when a localized page has high body-word ratio, because "
            "full translations may wrap differently from English. Non-length "
            "structural signals are still checked."
        ),
    ),
    "fr": LocaleProfile(
        script="latin",
        compactness_guard=True,
        notes=(
            "Latin-script compactness guard can suppress line-count-only false "
            "alarms when a localized page has high body-word ratio, because "
            "full translations may wrap differently from English. Non-length "
            "structural signals are still checked."
        ),
    ),
    "it": LocaleProfile(
        script="latin",
        compactness_guard=True,
        notes=(
            "Latin-script compactness guard can suppress line-count-only false "
            "alarms when a localized page has high body-word ratio, because "
            "full translations may wrap differently from English. Non-length "
            "structural signals are still checked."
        ),
    ),

    # Cyrillic — explicitly opt out of the Latin compactness guard:
    # real ru/uk drift at the same pattern sits at notably lower body ratios.
    "ru": LocaleProfile(script="cyrillic"),
    "uk": LocaleProfile(script="cyrillic"),

    # Persian is the first RTL localization. Initial audit found no
    # RTL-specific parsing issue, so this records metadata only and does not
    # enable RTL-specific heuristics.
    "fa": LocaleProfile(script="arabic", direction="rtl"),
}


def get_locale_profile(locale: str) -> LocaleProfile:
    return _LOCALE_PROFILES.get(locale, _DEFAULT_LOCALE_PROFILE)


# --- Data classes ---

@dataclass(frozen=True)
class ParsedFile:
    visible_lines: int
    h2: int
    h3: int
    code_blocks: int
    anchors: FrozenSet[str]
    versions: FrozenSet[Tuple[int, int]]
    body_words: int = 0
    feature_state_tokens: FrozenSet[str] = frozenset()
    api_kind_tokens: FrozenSet[str] = frozenset()


@dataclass
class FileStats:
    l10n_to_en_line_ratio: float
    l10n_to_en_body_word_ratio: float
    missing_h2: int
    missing_h3: int
    missing_code_blocks: int
    missing_anchors: int
    missing_new_versions: int
    missing_feature_state: int = 0
    missing_api_or_kind: int = 0

@dataclass
class FileReport:
    localized_path: str
    status: str
    reasons: List[str] = field(default_factory=list)
    indicators: List[str] = field(default_factory=list)

# --- Markdown parsing ---

def _is_indented_code_block(raw_para: str) -> bool:
    lines = raw_para.splitlines()
    non_blank = [line for line in lines if line.strip()]
    return bool(non_blank) and all(line[:4] == "    " for line in non_blank)

def _count_visible_lines(text: str) -> int:
    # Code-block contents kept: code volume is legitimate content.
    t = _STRIP_FM.sub("", text, count=1)
    t = _STRIP_CMNT.sub("", t)
    return sum(1 for line in t.splitlines() if line.strip())

def _count_body_words(text: str) -> int:
    # For the Latin-compactness check: separates loose-wrapped full
    # translations from thinned content.
    t = _STRIP_FM.sub("", text, count=1)
    t = _STRIP_CMNT.sub("", t)
    t = _STRIP_CODE.sub("", t)
    kept: List[str] = []
    for raw in re.split(r"\n{2,}", t):
        if _is_indented_code_block(raw):
            continue
        kept.append(raw)
    t = _STRIP_INLINE.sub("", "\n\n".join(kept))
    return len(_BODY_WORD_RE.findall(t))

def _extract_structure(text: str) -> Tuple[int, int, int, FrozenSet[str]]:
    # Strip comments first: some localization teams add comments, e.g., zh-cn uses
    # `<!-- -->` blocks to record the English original, which would desync `in_code`.
    # Toggle on 0-3-space fences (CommonMark); only count column-0 fences.
    lines = _STRIP_CMNT.sub("", text).splitlines()
    h2 = h3 = fences = 0
    anchors: set = set()
    in_code = False
    for line in lines:
        stripped = line.lstrip(' ')
        leading = len(line) - len(stripped)
        if leading < 4 and stripped.startswith("```"):
            if leading == 0:
                fences += 1
            in_code = not in_code
            continue
        if in_code:
            continue
        if line.startswith("### "):
            h3 += 1
        elif line.startswith("## "):
            h2 += 1
        if line.startswith("#"):
            for m in _ANCHOR_RE.finditer(line):
                anchors.add(m.group(1).strip().lower())
    return h2, h3, fences // 2, frozenset(anchors)

def _extract_feature_state_tokens(text: str) -> FrozenSet[str]:
    # Strip comments first: some localization teams add comments, e.g.,
    # zh-cn uses `<!-- -->` blocks to record the English original, which
    # would mask token drift.
    # Prefixes keep version/gate name spaces from colliding.
    no_cmt = _STRIP_CMNT.sub("", text)
    tokens = [f"version:{v}" for v in _FS_VERSION_RE.findall(no_cmt)]
    tokens.extend(f"gate:{g}" for g in _FS_GATE_RE.findall(no_cmt))
    return frozenset(tokens)

def _extract_api_kind_tokens(text: str) -> FrozenSet[str]:
    # Same comment-stripping rationale as feature_state. Prefixes keep
    # apiVersion and kind value spaces separate.
    no_cmt = _STRIP_CMNT.sub("", text)
    tokens = [f"api:{v}" for v in _APIVERSION_LINE_RE.findall(no_cmt)]
    tokens.extend(f"kind:{k}" for k in _KIND_LINE_RE.findall(no_cmt))
    return frozenset(tokens)

def parse_markdown(path: str, locale: str = "") -> ParsedFile:
    # `locale` is retained for call-site stability; no longer consumed.
    del locale
    with open(path, encoding="utf-8", errors="replace") as fh:
        text = fh.read()
    h2, h3, code_blocks, anchors = _extract_structure(text)
    return ParsedFile(
        visible_lines=_count_visible_lines(text),
        h2=h2, h3=h3, code_blocks=code_blocks,
        anchors=anchors,
        versions=frozenset(
            (int(major), int(minor)) for major, minor in _VERSION_RE.findall(text)
        ),
        body_words=_count_body_words(text),
        feature_state_tokens=_extract_feature_state_tokens(text),
        api_kind_tokens=_extract_api_kind_tokens(text),
    )

# --- File comparison / stats ---

def _count_missing_new_versions(
    en_versions: FrozenSet[Tuple[int, int]],
    l10n_versions: FrozenSet[Tuple[int, int]],
) -> int:
    if not l10n_versions:
        return len(en_versions)
    l10n_max = max(l10n_versions)
    return sum(1 for v in en_versions if v > l10n_max)

def compute_stats(en: ParsedFile, l10n: ParsedFile) -> FileStats:
    line_ratio = (
        min(l10n.visible_lines / en.visible_lines, 2.0)
        if en.visible_lines > 0 else 1.0
    )
    body_word_ratio = (
        l10n.body_words / en.body_words if en.body_words > 0 else 1.0
    )

    if l10n.visible_lines > 0:
        missing_feature_state = len(en.feature_state_tokens - l10n.feature_state_tokens)
        missing_api_or_kind = len(en.api_kind_tokens - l10n.api_kind_tokens)
    else:
        missing_feature_state = 0
        missing_api_or_kind = 0

    return FileStats(
        l10n_to_en_line_ratio=line_ratio,
        l10n_to_en_body_word_ratio=body_word_ratio,
        missing_h2=max(0, en.h2 - l10n.h2),
        missing_h3=max(0, en.h3 - l10n.h3),
        missing_code_blocks=max(0, en.code_blocks - l10n.code_blocks),
        missing_anchors=len(en.anchors - l10n.anchors),
        missing_new_versions=_count_missing_new_versions(en.versions, l10n.versions),
        missing_feature_state=missing_feature_state,
        missing_api_or_kind=missing_api_or_kind,
    )

# --- Length-gap classification ---

def _classify_length_gap(l10n_to_en_line_ratio: float) -> str:
    if l10n_to_en_line_ratio < 0.50:
        return _LENGTH_GAP_LARGE
    if l10n_to_en_line_ratio < 0.65:
        return _LENGTH_GAP_MODERATE
    if l10n_to_en_line_ratio < 0.80:
        return _LENGTH_GAP_SMALL
    if l10n_to_en_line_ratio < 0.90:
        return _LENGTH_GAP_SILENT
    return _LENGTH_GAP_NONE

def _build_length_gap_reason(level: str, l10n_to_en_line_ratio: float) -> str:
    if level == _LENGTH_GAP_LARGE:
        inv = (
            f"{1 / l10n_to_en_line_ratio:.1f}×"
            if l10n_to_en_line_ratio > 0 else "∞"
        )
        return (
            f"Localized file is {inv} shorter than EN"
            f"(l10n-to-EN line ratio {l10n_to_en_line_ratio:.2f})"
        )
    if level == _LENGTH_GAP_MODERATE:
        return (
            f"Localized file is substantially shorter than EN"
            f"(l10n-to-EN line ratio {l10n_to_en_line_ratio:.2f})"
        )
    if level == _LENGTH_GAP_SMALL:
        return (
            f"Localized file is moderately shorter than EN"
            f"(l10n-to-EN line ratio {l10n_to_en_line_ratio:.2f})"
        )
    return ""

def _is_only_length_gap(stats: FileStats) -> bool:
    # True when no structural loss is present — only a length gap fired.
    return (stats.missing_h2 == 0
            and stats.missing_h3 == 0
            and stats.missing_code_blocks == 0
            and stats.missing_anchors == 0
            and stats.missing_new_versions == 0)

def _should_ignore_length_gap(
    stats: FileStats, en: ParsedFile, l10n: ParsedFile,
    profile: LocaleProfile, level: str, has_support: bool,
) -> bool:
    """Drop length gap when unreliable (EN shorter than the profile's
    short-EN threshold, no other indicator firing) or expected by locale
    shape. Profile-driven so adding a locale is a single map entry:
    `ignore_only_length_gap` handles locales such as Japanese where visible 
    line counts can differ from English because of Japanese wrapping behavior; 
    `compactness_guard` covers Latin-script locales whose full
    translations run loose-wrapped at high body-word ratios."""
    if level == _LENGTH_GAP_NONE or l10n.visible_lines == 0:
        return False
    if not has_support and en.visible_lines < profile.short_en_threshold:
        return True
    if (level in (_LENGTH_GAP_MODERATE, _LENGTH_GAP_LARGE)
            and _is_only_length_gap(stats)):
        if (profile.ignore_only_length_gap
                and en.visible_lines >= profile.short_en_threshold):
            return True
        if (profile.compactness_guard
                and en.visible_lines >= profile.compactness_min_en_lines
                and stats.l10n_to_en_body_word_ratio >= profile.body_word_ratio_min):
            return True
    return False

# --- Indicator detection ---

def _has_length_gap_support(stats: FileStats) -> bool:
    """Return whether non-length indicators support a length-gap finding."""
    return (
        stats.missing_h2 > 0 or stats.missing_h3 > 0
        or stats.missing_code_blocks > 0 or stats.missing_new_versions > 0
    )

def build_indicators(
    stats: FileStats, en: ParsedFile, l10n: ParsedFile, profile: LocaleProfile,
) -> List[str]:
    indicators: List[str] = []

    if l10n.visible_lines == 0 and en.visible_lines >= 1:
        indicators.append("empty_stub")

    # Empty-stub bypass on the short-EN floor so empty stubs still reach a level.
    if (en.visible_lines >= profile.min_en_lines_for_length_gap
            or l10n.visible_lines == 0):
        level = _classify_length_gap(stats.l10n_to_en_line_ratio)
    else:
        level = _LENGTH_GAP_NONE

    has_support = _has_length_gap_support(stats)

    if _should_ignore_length_gap(stats, en, l10n, profile, level, has_support):
        level = _LENGTH_GAP_NONE

    if level == _LENGTH_GAP_LARGE and l10n.visible_lines > 0:
        indicators.append("large_length_gap")
    elif level == _LENGTH_GAP_MODERATE:
        indicators.append("moderate_length_gap")

    if (stats.missing_h2 >= _STRONG_H2_THRESHOLD
            or (stats.missing_h2 >= 1 and stats.missing_h3 >= _STRONG_H3_WITH_H2_THRESHOLD)):
        indicators.append("severe_heading_loss")
    elif stats.missing_h2 >= 1 or stats.missing_h3 >= 2:
        indicators.append("moderate_heading_loss")

    if stats.missing_code_blocks >= _STRONG_CODE_THRESHOLD:
        indicators.append("severe_code_loss")
    elif stats.missing_code_blocks >= 1:
        indicators.append("moderate_code_loss")

    if stats.missing_anchors >= _STRONG_ANCHOR_THRESHOLD:
        indicators.append("severe_anchor_loss")
    elif stats.missing_anchors >= 1:
        indicators.append("moderate_anchor_loss")

    if stats.missing_new_versions >= _STRONG_VERSION_THRESHOLD:
        indicators.append("severe_version_mismatch")
    elif stats.missing_new_versions >= 1:
        indicators.append("moderate_version_mismatch")

    if stats.missing_feature_state and stats.missing_api_or_kind:
        indicators.append("severe_api_and_feature_mismatch")

    if (level == _LENGTH_GAP_SMALL
            and l10n.visible_lines > 0
            and (any(ind in _NON_LENGTH_INDICATORS for ind in indicators)
                 or stats.missing_feature_state > 0
                 or stats.missing_api_or_kind > 0)):
        indicators.append("small_length_gap")

    return indicators

# --- Status classification ---

def _is_expected_translated_anchor_loss(
    non_length_gap_supporting: Set[str], profile: LocaleProfile,
    l10n_to_en_body_word_ratio: float, missing_anchors: int,
) -> bool:
    # Latin: some locales translate anchor IDs instead of preserving the
    # source identifier — looks compact with a small anchor mismatch but
    # carries full word volume. Without this guard, rule 4 falsely promotes them.
    return (
        profile.compactness_guard
        and l10n_to_en_body_word_ratio >= profile.body_word_ratio_min
        and missing_anchors <= 2
        and len(non_length_gap_supporting) >= 1
        and all(s == "moderate_anchor_loss" for s in non_length_gap_supporting)
    )

def classify_status(
    indicators: List[str], *,
    profile: LocaleProfile, l10n_to_en_body_word_ratio: float, missing_anchors: int,
) -> str:
    """Classification rules, in order:

    1. `empty_stub` or `severe_api_and_feature_mismatch` → Strong signal.
    2. ≥2 strong → Strong signal.
    3. ≥1 strong + ≥1 supporting → Strong signal.
    4. `large_length_gap` + ≥1 non-length-gap supporting → Strong signal
       (guarded against the Latin translated-anchor false-alarm).
    5. ≥3 supporting → Moderate signal.
    6. ≥1 strong or ≥1 supporting → Moderate signal.
    7. `small_length_gap` → Moderate signal.
    8. Otherwise → No signal.
    """
    if not indicators:
        return STATUS_NO_SIGNAL

    indset = set(indicators)
    strong = indset & _STRONG_INDICATORS
    supporting = indset & _SUPPORTING_INDICATORS

    if "empty_stub" in indset:
        return STATUS_STRONG_SIGNAL
    if "severe_api_and_feature_mismatch" in indset:
        return STATUS_STRONG_SIGNAL
    if len(strong) >= 2:
        return STATUS_STRONG_SIGNAL
    if strong and supporting:
        return STATUS_STRONG_SIGNAL
    if "large_length_gap" in indset:
        non_length_gap = supporting - _LENGTH_GAP_INDICATORS
        if non_length_gap and not _is_expected_translated_anchor_loss(
                non_length_gap, profile,
                l10n_to_en_body_word_ratio, missing_anchors):
            return STATUS_STRONG_SIGNAL
    if len(supporting) >= 3:
        return STATUS_MODERATE_SIGNAL
    if strong or supporting:
        return STATUS_MODERATE_SIGNAL
    if "small_length_gap" in indset:
        return STATUS_MODERATE_SIGNAL
    return STATUS_NO_SIGNAL

# --- Reason generation ---

_ONLY_ANCHOR_INDICATOR_SUFFIX = (
    " (only indicator — may reflect anchor naming differences, "
    "typo variants, or structure mismatch; verify manually)"
)

_FALLBACK_REASON = "Content indicators suggest localized file may be outdated"

def build_reasons(
    stats: FileStats, en: ParsedFile, l10n: ParsedFile,
    locale: str, indicators: List[str],
) -> List[str]:
    reasons: List[str] = []
    indset = set(indicators)

    if "large_length_gap" in indset:
        reasons.append(_build_length_gap_reason(_LENGTH_GAP_LARGE, stats.l10n_to_en_line_ratio))
    elif "moderate_length_gap" in indset:
        reasons.append(_build_length_gap_reason(_LENGTH_GAP_MODERATE, stats.l10n_to_en_line_ratio))
    elif "small_length_gap" in indset:
        reasons.append(_build_length_gap_reason(_LENGTH_GAP_SMALL, stats.l10n_to_en_line_ratio))

    if stats.missing_h2 > 0 or stats.missing_h3 > 0:
        parts = []
        if stats.missing_h2:
            parts.append(f"{stats.missing_h2} H2")
        if stats.missing_h3:
            parts.append(f"{stats.missing_h3} H3")
        reasons.append(
            f"Localized file is missing headings present in source ({', '.join(parts)})"
        )

    if stats.missing_code_blocks:
        reasons.append(
            f"Localized file is missing {stats.missing_code_blocks} "
            f"code block(s) present in source"
        )

    if stats.missing_anchors:
        only_anchor = (
            stats.missing_h2 == 0 and stats.missing_h3 == 0
            and stats.missing_code_blocks == 0
            and stats.missing_new_versions == 0
            and not (indset & _LENGTH_GAP_INDICATORS)
        )
        r = (
            f"Localized file is missing {stats.missing_anchors} "
            f"section anchor(s) present in source"
        )
        if only_anchor:
            r += _ONLY_ANCHOR_INDICATOR_SUFFIX
        reasons.append(r)

    if stats.missing_new_versions:
        reasons.append(
            f"Localized file is missing {stats.missing_new_versions} "
            f"Kubernetes version reference(s) present in source"
        )

    if stats.missing_feature_state and stats.missing_api_or_kind:
        reasons.append(
            "Content mismatch: feature-state AND apiVersion/kind value(s) "
            "present in source are missing from localized"
        )

    return reasons or [_FALLBACK_REASON]

# --- Per-file analysis ---

def analyze_file_pair(
    en_path: str, l10n_path: str, locale: str,
) -> FileReport:
    profile = get_locale_profile(locale)
    en = parse_markdown(en_path)
    l10n = parse_markdown(l10n_path)
    stats = compute_stats(en, l10n)
    indicators = build_indicators(stats, en, l10n, profile)
    status = classify_status(
        indicators,
        profile=profile,
        l10n_to_en_body_word_ratio=stats.l10n_to_en_body_word_ratio,
        missing_anchors=stats.missing_anchors,
    )
    reasons = (
        build_reasons(stats, en, l10n, locale, indicators)
        if status != STATUS_NO_SIGNAL else []
    )
    return FileReport(
        localized_path=l10n_path,
        status=status,
        reasons=reasons,
        indicators=indicators,
    )

# --- Locale scanning ---

def _is_candidate_orphan(l10n_path: str, locale: str) -> bool:
    fname = os.path.basename(l10n_path)
    if fname in _ORPHAN_SKIP_BASENAMES:
        return False
    rel = l10n_path.split(f"content/{locale}/", 1)[-1]
    return rel.startswith("docs/")

def scan_locale(
    locale: str, repo_root: str,
) -> Tuple[List[FileReport], List[str]]:
    locale_dir = os.path.join(repo_root, "content", locale)
    if not os.path.isdir(locale_dir):
        print(f"error: locale directory not found: {locale_dir}", file=sys.stderr)
        sys.exit(1)

    pairs: List[Tuple[str, str]] = []
    orphan_paths: List[str] = []
    for root, _, files in os.walk(locale_dir):
        for fname in sorted(files):
            if not fname.endswith(".md"):
                continue
            l10n_path = os.path.join(root, fname)
            en_path = re.sub(r"content/[^/]+/", "content/en/", l10n_path)
            if os.path.exists(en_path):
                pairs.append((en_path, l10n_path))
            elif _is_candidate_orphan(l10n_path, locale):
                orphan_paths.append(l10n_path)

    reports: List[FileReport] = []

    total = len(pairs)
    if total:
        print(f"  [{locale}] evaluating {total} file pairs ...", file=sys.stderr)
    for i, (en_path, l10n_path) in enumerate(pairs, 1):
        if i % 100 == 0:
            print(f"  [{locale}] {i}/{total}", file=sys.stderr)
        reports.append(analyze_file_pair(en_path, l10n_path, locale))

    reports.sort(
        key=lambda fr: (_STATUS_SORT_KEY[fr.status], fr.localized_path)
    )
    orphan_paths.sort()
    return reports, orphan_paths

# --- Report formatting ---

_GITHUB_BASE = "https://github.com/kubernetes/website/blob"

def build_file_links(
    rel_path: str, locale: str, link_mode: str,
    branch: str, output_dir: str, repo_root: str,
    locale_first: bool = False,
) -> str:
    """Build the "[(en)] [(locale)]" link pair shown after each file entry.
    `local` mode emits report-relative paths; otherwise GitHub blob URLs.
    `locale_first=True` swaps order for orphan entries."""
    en_rel = re.sub(rf"^content/{re.escape(locale)}/", "content/en/", rel_path)
    if link_mode == "local":
        en_target = os.path.relpath(os.path.join(repo_root, en_rel), output_dir)
        loc_target = os.path.relpath(os.path.join(repo_root, rel_path), output_dir)
    else:
        base = f"{_GITHUB_BASE}/{branch}"
        en_target = f"{base}/{en_rel}?plain=1"
        loc_target = f"{base}/{rel_path}?plain=1"
    en_link = f"[(en)]({en_target})"
    loc_link = f"[({locale})]({loc_target})"
    pair = f"{loc_link} {en_link}" if locale_first else f"{en_link} {loc_link}"
    return f"  {pair}"

def _to_rel_path(path: str, repo_root: str) -> str:
    try:
        return os.path.relpath(path, repo_root)
    except ValueError:
        return path

def _extract_doc_area(path: str, locale: str) -> str:
    m = re.search(rf"content/{re.escape(locale)}/([^/]+(?:/[^/]+)?)", path)
    if not m:
        return "(other)/"
    seg = m.group(1)
    if "." in seg.split("/")[-1]:
        seg = "/".join(seg.split("/")[:-1])
    return seg.rstrip("/") + "/"

def count_files_by_status(
    evaluated: List[FileReport],
) -> Tuple[int, int, int]:
    c = Counter(fr.status for fr in evaluated)
    return (
        c[STATUS_STRONG_SIGNAL],
        c[STATUS_MODERATE_SIGNAL],
        c[STATUS_NO_SIGNAL],
    )

def _build_locale_profile_note(profile: LocaleProfile) -> List[str]:
    if not profile.notes:
        return []
    return [
        "**Locale-specific calibration note:**",
        "",
        f"> {profile.notes}",
        "",
    ]


def _build_report_disclaimer() -> List[str]:
    """Triage disclaimer + status-meaning block included in every per-locale report."""
    return [
        "> This report is a signal-based triage aid, not a final localization review.",
        "> It checks page structure and outdatedness indicators such as headings, code blocks,",
        "> anchors, Kubernetes versions, and API / feature-state values. It does not",
        "> check translation meaning or quality. Please manually verify flagged files.",
        "",
        "**Triage category meanings:**",
        "",
        "- `Orphan`: no matching English source; verify whether this is expected.",
        "- `Strong signal`: high-confidence signal; likely needs review or update.",
        "- `Moderate signal`: medium-confidence signal; verify manually.",
        "- `No signal`: no signal found; lowest priority, not a guarantee that the translation is current.",
        "",
    ]

def build_locale_report(
    locale: str,
    evaluated: List[FileReport],
    orphans: List[str],
    repo_root: str,
    date: str,
    detailed: bool,
    link_mode: Optional[str] = None,
    branch: str = "main",
    output_dir: str = ".",
) -> str:
    profile = get_locale_profile(locale)
    strong, moderate, no_signal = count_files_by_status(evaluated)
    total = len(evaluated) + len(orphans)
    w = max(len(STATUS_STRONG_SIGNAL), len(STATUS_MODERATE_SIGNAL),
            len(STATUS_NO_SIGNAL), len("Evaluated"), len("Orphan"))
    lines: List[str] = [
        f"## Localization triage: `{locale}`",
        "",
        f"Generated: {date}  ",
        "Method: checks page structure and outdatedness indicators  ",
        "Script: `l10n-outdatedness-triage.py`",
        "",
    ]
    lines.extend(_build_report_disclaimer())
    lines.extend(_build_locale_profile_note(profile))
    lines.extend([
        "| Triage category | Count |",
        "|---|---:|",
        f"| {'Evaluated':<{w}} | {total} |",
        f"| {STATUS_NO_SIGNAL:<{w}} | {no_signal} |",
        f"| {'Orphan':<{w}} | {len(orphans)} |",
        f"| {STATUS_STRONG_SIGNAL:<{w}} | {strong} |",
        f"| {STATUS_MODERATE_SIGNAL:<{w}} | {moderate} |",
        "",
    ])

    area_counts: Counter = Counter(
        _extract_doc_area(fr.localized_path, locale)
        for fr in evaluated
        if fr.status != STATUS_NO_SIGNAL
    )
    if area_counts:
        lines.extend(["**Top affected areas (flagged files):**", ""])
        for area, count in area_counts.most_common(8):
            lines.append(f"- `{area}`: {count} files")
        lines.append("")

    by_status: Dict[str, List[FileReport]] = {
        STATUS_STRONG_SIGNAL: [],
        STATUS_MODERATE_SIGNAL: [],
        STATUS_NO_SIGNAL: [],
    }
    for fr in evaluated:
        by_status[fr.status].append(fr)

    lines.extend([
        f"### Orphan localized files, no English source ({len(orphans)})",
        "",
    ])
    if orphans:
        lines.append(f"_{_ORPHAN_REASON}_")
        lines.append("")
        for path in orphans:
            rel = _to_rel_path(path, repo_root)
            links = "\n" + build_file_links(rel, locale, link_mode, branch, output_dir, repo_root, locale_first=True) if link_mode else ""
            lines.append(f"- `{rel}`{links}")
        lines.append("")
    else:
        lines.extend(["_None_", ""])

    for key in (STATUS_STRONG_SIGNAL, STATUS_MODERATE_SIGNAL):
        items = by_status[key]
        lines.extend([f"### {key} ({len(items)})", ""])
        if not items:
            lines.extend(["_None_", ""])
            continue
        for fr in items:
            path = _to_rel_path(fr.localized_path, repo_root)
            links = (
                "\n" + build_file_links(path, locale, link_mode, branch, output_dir, repo_root)
                if link_mode else ""
            )
            if detailed and fr.reasons:
                lines.append(f"**`{path}`** — triage: {fr.status}{links}")
                lines.extend(f"- {r}" for r in fr.reasons)
                if fr.indicators:
                    lines.append(f"- Indicators: {', '.join(fr.indicators)}")
                lines.append("")
            else:
                first = fr.reasons[0] if fr.reasons else "(no indicators)"
                lines.append(f"- `{path}` — {fr.status}: {first}{links}")
        if not detailed:
            lines.append("")

    return "\n".join(lines)

def build_index_report(
    results: List[Tuple[str, List[FileReport], List[str]]], date: str,
) -> str:
    lines = [
        "## Localization triage index",
        "",
        f"Generated: {date}",
        "",
        f"| Locale | Report | Evaluated | {STATUS_NO_SIGNAL} | Orphan | {STATUS_STRONG_SIGNAL} | {STATUS_MODERATE_SIGNAL} |",
        "|---|---|---:|---:|---:|---:|---:|",
    ]
    for locale, evaluated, orphans in results:
        strong, moderate, no_signal = count_files_by_status(evaluated)
        total = len(evaluated) + len(orphans)
        fname = f"l10n-status-{locale}.md"
        lines.append(
            f"| `{locale}` | [{fname}]({fname}) | {total} |"
            f" {no_signal} | {len(orphans)} | {strong} | {moderate} |"
        )
    lines.append("")
    return "\n".join(lines)

# --- CLI / orchestration ---

def _auto_detect_repo_root() -> Optional[str]:
    d = os.path.abspath(os.getcwd())
    while True:
        if os.path.isdir(os.path.join(d, "content", "en")):
            return d
        parent = os.path.dirname(d)
        if parent == d:
            return None
        d = parent

def _resolve_locales(args: argparse.Namespace, repo_root: str) -> List[str]:
    if args.lang:
        return args.lang
    content_dir = os.path.join(repo_root, "content")
    return sorted(
        d for d in os.listdir(content_dir)
        if os.path.isdir(os.path.join(content_dir, d)) and d != "en"
    )

def _build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Localization outdatedness triage helper. Classifies "
            "localized files by status using page structure and outdatedness indicators "
            "and emits compact reports; orphan localized docs are "
            "listed in a separate section."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    group = parser.add_mutually_exclusive_group(required=False)
    group.add_argument(
        "--lang", metavar="CODE", nargs="+",
        help="One or more locales to scan (e.g. --lang ko  or  --lang ko zh-cn ja)",
    )
    group.add_argument(
        "--all", action="store_true",
        help="Scan all locales under content/ except en (default when no option given)",
    )
    parser.add_argument(
        "--repo-root", default=None, metavar="DIR",
        help=(
            "Path to kubernetes/website repo root (auto-detected if omitted). "
            "Accepts relative paths, e.g. --repo-root ../website"
        ),
    )
    parser.add_argument(
        "--output-dir", "-o", default=".", metavar="DIR",
        help="Directory for report files (default: current directory)",
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true",
        help="Show all indicator lines per file (default: one compact line)",
    )
    parser.add_argument(
        "--link", default=None, metavar="MODE", choices=["web", "local"],
        help=(
            "Add [(en)] and [(<locale>)] links after each file entry. "
            "MODE: 'web' for GitHub URLs (opens code view); "
            "'local' for paths relative to the output directory."
        ),
    )
    parser.add_argument(
        "--branch", default="main", metavar="BRANCH",
        help="Branch for GitHub links (default: main)",
    )
    return parser

def main() -> None:
    args = _build_arg_parser().parse_args()

    if args.repo_root:
        repo_root = os.path.abspath(args.repo_root)
    else:
        repo_root = _auto_detect_repo_root()
        if repo_root is None:
            print(
                "error: could not auto-detect repo root (no content/en found "
                "above cwd). Use --repo-root to specify it explicitly.",
                file=sys.stderr,
            )
            sys.exit(1)

    date = datetime.date.today().isoformat()
    locales = _resolve_locales(args, repo_root)
    os.makedirs(args.output_dir, exist_ok=True)
    abs_output_dir = os.path.abspath(args.output_dir)

    all_results: List[Tuple[str, List[FileReport], List[str]]] = []
    for locale in locales:
        print(f"Scanning content/{locale}/ ...", file=sys.stderr)
        evaluated, orphans = scan_locale(locale, repo_root)
        all_results.append((locale, evaluated, orphans))
        out_path = os.path.join(
            args.output_dir, f"l10n-status-{locale}.md"
        )
        with open(out_path, "w", encoding="utf-8") as fh:
            fh.write(build_locale_report(
                locale, evaluated, orphans, repo_root, date, args.verbose,
                link_mode=args.link, branch=args.branch,
                output_dir=abs_output_dir,
            ))
        strong, moderate, no_signal = count_files_by_status(evaluated)
        print(
            f"Wrote {out_path}  "
            f"({len(orphans)} orphans, {strong} {STATUS_STRONG_SIGNAL}, "
            f"{moderate} {STATUS_MODERATE_SIGNAL}, {no_signal} {STATUS_NO_SIGNAL})",
            file=sys.stderr,
        )

    if len(locales) > 1:
        index_path = os.path.join(args.output_dir, "l10n-status-all.md")
        with open(index_path, "w", encoding="utf-8") as fh:
            fh.write(build_index_report(all_results, date))
        print(f"Wrote {index_path}", file=sys.stderr)

if __name__ == "__main__":
    main()
