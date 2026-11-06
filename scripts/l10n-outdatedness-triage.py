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
classifies it as `Strong signal`, `Moderate signal`,
`Weak signal (lastmod only)`, or `No signal`.

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
import subprocess
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
_VERSION_L10N_RE = re.compile(
    r"(?<![A-Za-z0-9])v(\d+)\.(\d{1,3})(?!\d)|(?<![A-Za-z0-9.:/])(1)\.([1-4]\d)(?![.\d])"
)
_ANCHOR_RE = re.compile(r"\{#([^}]+)\}")
_STRIP_FM = re.compile(r"^\s*---\s*\n.*?\n---\s*(?:\n|$)", re.DOTALL)
_STRIP_CODE = re.compile(r"```.*?```", re.DOTALL)
_STRIP_CMNT = re.compile(r"<!--.*?-->", re.DOTALL)
_STRIP_CMNT_LINE = re.compile(r"<!--.*?-->[ \t]*\n?", re.DOTALL)
_STRIP_INLINE = re.compile(r"`[^`\n]+`")

# Unicode-aware body-word counter for the Latin-compactness check; keeps
# `informação` and Cyrillic words intact.
_BODY_WORD_RE = re.compile(r"[^\W_]{2,}", re.UNICODE)

_FS_VERSION_RE = re.compile(r'for_k8s_version="(v?\d+\.\d+)"')
_FS_GATE_RE = re.compile(r'feature_gate_name="([A-Za-z_][A-Za-z0-9_]*)"')
_FS_STATE_RE = re.compile(
    r'\{\{[<%][ \t]*-?feature[-_]state\b[^}>%]*?\bstate="([A-Za-z]+)"', re.DOTALL
)
_FS_STAGE_BLOCK_RE = re.compile(
    r"^\s*-\s*stage:\s*(\S+)|^\s*(fromVersion|toVersion|defaultValue|removed):\s*\"?([^\"\n#]+)\"?",
    re.MULTILINE,
)
_APIVERSION_LINE_RE = re.compile(
    r"^[ \t]*-?[ \t]*apiVersion:\s*\"?([A-Za-z0-9./_-]+)\"?\s*$", re.MULTILINE
)
_KIND_LINE_RE = re.compile(
    r"^[ \t]*-?[ \t]*kind:\s*\"?([A-Z][A-Za-z0-9]+)\"?\s*$", re.MULTILINE
)
_IMAGE_TAG_LINE_RE = re.compile(
    r"^[ \t]*-?[ \t]*image:[ \t]*\"?([A-Za-z0-9._/-]+:[A-Za-z0-9._-]+)\"?[ \t]*(?:#.*)?$",
    re.MULTILINE,
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
STATUS_LASTMOD_ONLY = "Weak signal (lastmod only)"
STATUS_NO_SIGNAL = "No signal"
_LASTMOD_ONLY_NOTE = (
    "English source has a newer git commit timestamp (`lastmod`) than the "
    "localized file, but no structural or token signal was found (may be minor "
    "typo/link edits or prose-only updates)."
)

# Cutoffs for when missing items count as a "strong" outdatedness signal;
# see classify_status() for how strong signals affect the final status.
_STRONG_H2_THRESHOLD = 2              # missing H2 headings
_STRONG_H3_WITH_H2_THRESHOLD = 5      # missing H3s, plus at least one missing H2
_STRONG_CODE_THRESHOLD = 3            # missing code blocks
_STRONG_ANCHOR_THRESHOLD = 5          # missing section anchors
_STRONG_VERSION_THRESHOLD = 3         # missing newer Kubernetes version refs
_STRONG_MARKUP_THRESHOLD = 4               # distinct mismatching markup tokens
_STRONG_SHORTCODE_THRESHOLD = 3            # missing shortcode attribute/target tokens
_STRONG_LINK_THRESHOLD = 4                 # missing internal/official link targets
_STRONG_CODE_IDENTIFIER_THRESHOLD = 3      # missing CLI flags/commands or technical keys
_STRONG_EXAMPLE_THRESHOLD = 3              # outdated local example files

# Structural markup tokens compared between English and localized body text.
_MARKUP_TOKENS: Tuple[str, ...] = (
    "[", "]", "bullet_list", "numbered_list", "{{", "}}", "<", ">", "http", "|", "=",
)
_MARKUP_BULLET_LIST_RE = re.compile(r"^[ \t]*[-*+][ \t]+", re.MULTILINE)
_MARKUP_BR_BULLET_RE = re.compile(r"<br\s*/?>[ \t]*-[ \t]+", re.IGNORECASE)
_MARKUP_NUMBERED_LIST_RE = re.compile(r"^[ \t]*\d+[.)][ \t]+", re.MULTILINE)
_MARKUP_CODE_TAG_RE = re.compile(r"<code>.*?</code>", re.DOTALL)
_MARKUP_REF_LINK_BRACKET_RE = re.compile(r"\]\[[^\]]*\]")
_MARKUP_HTTP_URL_RE = re.compile(r"https?://", re.IGNORECASE)
_MARKUP_MISMATCH_MIN_RATIO = 0.25
_MARKUP_MISMATCH_MIN_DIFF = 2

# Front-matter keys and structural values compared between English and localized pages.
_FRONT_MATTER_BLOCK_RE = re.compile(r"^\s*---\s*\n(.*?)\n---\s*(?:\n|$)", re.DOTALL)
_FRONT_MATTER_KEY_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_-]*):", re.MULTILINE)
_FRONT_MATTER_SCALAR_RE = re.compile(
    r"^([A-Za-z_][A-Za-z0-9_-]*):[ \t]*([^#\n]+?)[ \t]*(?:#.*)?$",
    re.MULTILINE,
)
_FRONT_MATTER_NESTED_STRUCTURAL_RE = re.compile(
    r"^\s*(list|render|apiVersion|kind|import|major|minor|latest|ReleaseType):\s*\"?([^\"\n#]+?)\"?\s*(?:#.*)?$",
    re.MULTILINE,
)
_FRONT_MATTER_OPTIONAL_KEYS: FrozenSet[str] = frozenset({
    "reviewers", "approvers", "auto_generated",
    "author", "Author", "authors",
    "url", "draft",
})
_FRONT_MATTER_TRANSLATABLE_KEYS: FrozenSet[str] = frozenset({
    "title", "Title", "linkTitle", "linktitle",
    "description", "Description", "short_description",
    "summary", "overview", "subheading", "heading_title_text",
    "manualLinkTitle", "quote",
})
_FRONT_MATTER_IGNORED_VALUE_KEYS: FrozenSet[str] = (
    _FRONT_MATTER_OPTIONAL_KEYS
    | _FRONT_MATTER_TRANSLATABLE_KEYS
    | frozenset({
        "slug", "aliases", "former_titles", "canonicalUrl", "translator",
        "date", "lastmod", "modified_time",
        "tags", "card", "cards", "menu", "stages", "api_metadata",
        "_build", "release_announcement", "feature", "sitemap",
        "related", "outputs", "resources",
    })
)
_FRONT_MATTER_NESTED_PARENT_KEYS: Dict[str, str] = {
    "nested:list": "_build",
    "nested:render": "_build",
    "nested:import": "feature",
    "nested:major": "release_announcement",
    "nested:minor": "release_announcement",
    "nested:latest": "release_announcement",
    "nested:ReleaseType": "release_announcement",
}

# Shortcode attributes, internal/official links, CLI/code identifiers, and example files.
_SHORTCODE_CALL_RE = re.compile(
    r"\{\{[<%][ \t]*(-?[A-Za-z0-9_/-]+)(.*?)[>%]\}\}", re.DOTALL
)
_SHORTCODE_ATTR_RE = re.compile(r'([A-Za-z0-9_-]+)="([^"]*)"')
_SHORTCODE_TRACKED_INLINE_RE = re.compile(
    r"\{\{[<%][ \t]*-?(?:glossary_tooltip|glossary_definition|code_sample|codenew|code|"
    r"api-reference|page-api-reference|feature-state|feature_state|feature-gate-description|"
    r"include|heading|skew|param|ref|relref|figure|youtube)\b.*?[>%]\}\}",
    re.DOTALL,
)
_SHORTCODE_TRANSLATABLE_ATTRS: FrozenSet[str] = frozenset({
    "text", "alt", "caption", "title", "name", "prepend", "summary", "attr",
    "src", "image", "link",
})
_SHORTCODE_POSITIONAL_NAMES: FrozenSet[str] = frozenset({
    "ref", "relref", "heading", "skew", "include", "param", "youtube",
})
_SHORTCODE_BARE_NAMES: FrozenSet[str] = frozenset({
    "caution", "warning", "thirdparty-content", "version-check",
})

_LINK_MARKDOWN_TARGET_RE = re.compile(
    r'\]\(\s*([^\s\)\"]+)\s*(?:\"[^\"]*\")?\s*\)|^\[[^\]]+\]:\s*(\S+)',
    re.MULTILINE,
)
_LINK_SITE_ROOT_RE = re.compile(
    r"^https?://(?:(?:www\.)?kubernetes\.io|k8s\.io(?=/(?:docs|blog|community|releases|training|partners|case-studies|includes)(?:/|$)))/"
)
_LINK_SECTION_PATH_RE = re.compile(
    r"^/(?:docs|blog|community|releases|training|partners|case-studies|includes)(?:/|$)"
)
_LINK_LOCALE_PREFIX_RE = re.compile(
    r"^(https?://(?!(?:www\.)?github\.com/)[^/]+)?/[a-z]{2}(?:-[a-z]{2})?(?=/)"
)
_LINK_OFFICIAL_EXTERNAL_RE = re.compile(
    r"^https?://(?:(?:www\.)?github\.com/(?:kubernetes|kubernetes-sigs|kubernetes-client|kubernetes-csi|cncf|etcd-io|containerd|cri-o|coredns)/|"
    r"(?:[a-z0-9-]+\.)*k8s\.io/)[^\s\)\"#?]+"
)

_CODE_IDENTIFIER_SPAN_OR_BLOCK_RE = re.compile(
    r"```.*?```|`[^`\n]+`|<code>.*?</code>|<td\b[^>]*>.*?</td>", re.DOTALL
)
_CODE_IDENTIFIER_CLI_FLAG_RE = re.compile(
    r"(?<![A-Za-z0-9_/-])(--[a-z][a-z0-9-]{1,40})(?![A-Za-z0-9_/-])"
)
_CODE_IDENTIFIER_CLI_COMMAND_RE = re.compile(
    r"\b((?:dnf|yum|apt-get)[ \t]+(?:install|update|upgrade|downgrade|remove|list|config-manager)|"
    r"(?:kubectl|kubeadm|crictl)[ \t]+(?:apply|create|delete|get|describe|logs|exec|edit|patch|"
    r"rollout|scale|autoscale|cordon|drain|uncordon|taint|label|annotate|auth|debug|diff|events|"
    r"explain|expose|kustomize|port-forward|proxy|replace|run|set|top|wait|init|join|reset|token|"
    r"certs|kubeconfig|config|upgrade|alpha))\b"
)
_CODE_IDENTIFIER_SYSCTL_OR_K8S_KEY_RE = re.compile(
    r"(?<![:/A-Za-z0-9_.-])((?:net\.ipv4|net\.ipv6|vm|fs|kernel)\.[a-z0-9_.-]+|"
    r"(?:[a-z0-9-]+\.)+kubernetes\.io/[a-z0-9._-]+|"
    r"kubernetes\.io/(?!docs\b|[a-z]{2}(?:-[a-z]{2})?/)[a-z0-9._-]+)\b"
)

_EXAMPLE_SHORTCODE_FILE_RE = re.compile(
    r'\{\{[<%][ \t]*-?(?:code_sample|codenew|code)\b[^>%\}]*\bfile="([^"]+)"[^>%\}]*[>%]\}\}',
    re.DOTALL,
)

_STRONG_INDICATORS: FrozenSet[str] = frozenset({
    "empty_stub",
    "severe_heading_loss", "moderate_heading_loss",
    "severe_code_loss", "moderate_code_loss",
    "severe_version_mismatch", "moderate_version_mismatch",
    "severe_api_and_feature_mismatch", "moderate_api_or_feature_mismatch",
    "missing_front_matter_keys", "front_matter_value_mismatch",
    "severe_shortcode_mismatch", "moderate_shortcode_mismatch",
    "severe_internal_link_loss", "moderate_internal_link_loss",
    "severe_code_identifier_mismatch", "moderate_code_identifier_mismatch",
    "severe_example_file_mismatch", "moderate_example_file_mismatch",
    "severe_anchor_loss", "severe_markup_token_loss",
})
_SUPPORTING_INDICATORS: FrozenSet[str] = frozenset({
    "large_length_gap", "moderate_length_gap",
    "moderate_anchor_loss", "moderate_markup_token_loss",
})
_STRUCTURAL_LOSS_INDICATORS: FrozenSet[str] = frozenset({
    "empty_stub",
    "large_length_gap",
    "severe_heading_loss", "moderate_heading_loss",
    "severe_code_loss", "moderate_code_loss",
})
_MAJOR_FIX_INDICATORS: FrozenSet[str] = _STRUCTURAL_LOSS_INDICATORS | frozenset({
    "moderate_length_gap",
    "severe_markup_token_loss",
})
_MINOR_FIX_MAX_ITEMS = 4

_STATUS_SORT_KEY = {
    STATUS_STRONG_SIGNAL: 0,
    STATUS_MODERATE_SIGNAL: 1,
    STATUS_LASTMOD_ONLY: 2,
    STATUS_NO_SIGNAL: 3,
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
    h4: int = 0
    paragraphs: int = 0
    markup_tokens: FrozenSet[Tuple[str, int]] = frozenset()
    front_matter_keys: FrozenSet[str] = frozenset()
    front_matter_values: FrozenSet[Tuple[str, str]] = frozenset()
    shortcode_values: FrozenSet[str] = frozenset()
    internal_links: FrozenSet[str] = frozenset()
    code_identifiers: FrozenSet[str] = frozenset()
    example_files: FrozenSet[str] = frozenset()


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
    extra_headings: int = 0
    heading_level_shift: bool = False
    markup_token_mismatches: Tuple[Tuple[str, int, int], ...] = ()
    missing_front_matter_keys: FrozenSet[str] = frozenset()
    missing_front_matter_values: FrozenSet[Tuple[str, str]] = frozenset()
    missing_shortcode_values: FrozenSet[str] = frozenset()
    missing_internal_links: FrozenSet[str] = frozenset()
    missing_code_identifiers: FrozenSet[str] = frozenset()
    outdated_local_examples: FrozenSet[str] = frozenset()

@dataclass
class FileReport:
    localized_path: str
    status: str
    reasons: List[str] = field(default_factory=list)
    indicators: List[str] = field(default_factory=list)
    is_minor_fix: bool = False
    en_lastmod: int = 0
    l10n_lastmod: int = 0

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

def _extract_structure(text: str) -> Tuple[int, int, int, int, FrozenSet[str]]:
    # Strip comments first: some localization teams add comments, e.g., zh-cn uses
    # `<!-- -->` blocks to record the English original, which would desync `in_code`.
    # Toggle on 0-3-space fences (CommonMark); only count column-0 fences.
    t = _STRIP_FM.sub("", text, count=1)
    lines = _STRIP_CMNT.sub("", t).splitlines()
    h2 = h3 = h4 = fences = 0
    anchors: set = set()
    in_code = False
    for line in lines:
        stripped = line.strip()
        leading = len(line) - len(line.lstrip(" "))
        if stripped.startswith("```"):
            if len(stripped) > 6 and stripped.endswith("```"):
                continue
            if leading == 0:
                fences += 1
            in_code = not in_code
            continue
        elif in_code and stripped.endswith("```"):
            if leading == 0:
                fences += 1
            in_code = False
            continue
        if in_code:
            continue
        if re.match(r"^####\s+\S", line):
            h4 += 1
        elif re.match(r"^###\s+\S", line):
            h3 += 1
        elif re.match(r"^##\s+\S", line):
            h2 += 1
        if line.startswith("#"):
            for m in _ANCHOR_RE.finditer(line):
                anchors.add(m.group(1).strip().lower())
    return h2, h3, h4, fences // 2, frozenset(anchors)

def _extract_feature_state_tokens(text: str) -> FrozenSet[str]:
    # Strip comments first: some localization teams add comments, e.g.,
    # zh-cn uses `<!-- -->` blocks to record the English original, which
    # would mask token drift.
    # Prefixes keep version/gate name spaces from colliding.
    text_no_comments = _STRIP_CMNT.sub("", text)
    tokens = [f"version:{v}" for v in _FS_VERSION_RE.findall(text_no_comments)]
    tokens.extend(f"gate:{g}" for g in _FS_GATE_RE.findall(text_no_comments))
    tokens.extend(f"state:{s.lower()}" for s in _FS_STATE_RE.findall(text_no_comments))
    front_matter_match = _FRONT_MATTER_BLOCK_RE.match(text)
    if front_matter_match:
        for stage_match in _FS_STAGE_BLOCK_RE.finditer(front_matter_match.group(1)):
            if stage_match.group(1):
                tokens.append(f"stage:{stage_match.group(1).strip()}")
            else:
                tokens.append(
                    f"stage_{stage_match.group(2)}:{stage_match.group(3).strip()}"
                )
    return frozenset(tokens)

def _extract_api_kind_tokens(text: str) -> FrozenSet[str]:
    # Same comment-stripping rationale as feature_state. Prefixes keep
    # apiVersion and kind value spaces separate.
    text_no_comments = _STRIP_CMNT.sub("", text)
    tokens = [f"api:{v}" for v in _APIVERSION_LINE_RE.findall(text_no_comments)]
    tokens.extend(f"kind:{k}" for k in _KIND_LINE_RE.findall(text_no_comments))
    tokens.extend(f"image:{image}" for image in _IMAGE_TAG_LINE_RE.findall(text_no_comments))
    return frozenset(tokens)

def _count_paragraphs(text: str) -> int:
    body = _STRIP_FM.sub("", text, count=1)
    body = _STRIP_CMNT_LINE.sub("", body)
    body = _STRIP_CODE.sub("\n\nCODE_BLOCK\n\n", body)
    return sum(1 for para in re.split(r"\n[ \t]*\n+", body.strip()) if para.strip())

def _count_markup_tokens(text: str) -> FrozenSet[Tuple[str, int]]:
    # Strip front matter, comments, code blocks/spans, and tracked shortcodes.
    body = _STRIP_FM.sub("", text, count=1)
    body = _STRIP_CMNT.sub("", body)
    body = _STRIP_CODE.sub("", body)
    body = _MARKUP_CODE_TAG_RE.sub("", body)
    body = _STRIP_INLINE.sub("", body)
    normalized_bullets_body = _MARKUP_BR_BULLET_RE.sub("\n- ", body)
    normalized_brackets_body = _MARKUP_REF_LINK_BRACKET_RE.sub("]", body)
    body_without_shortcodes = _SHORTCODE_CALL_RE.sub("", body)
    body_without_tracked_shortcodes = _SHORTCODE_TRACKED_INLINE_RE.sub("", body)
    counts: List[Tuple[str, int]] = []
    for token in _MARKUP_TOKENS:
        if token == "bullet_list":
            counts.append((token, len(_MARKUP_BULLET_LIST_RE.findall(normalized_bullets_body))))
        elif token == "numbered_list":
            counts.append((token, len(_MARKUP_NUMBERED_LIST_RE.findall(body))))
        elif token in ("<", ">", "="):
            counts.append((token, body_without_shortcodes.count(token)))
        elif token in ("{{", "}}"):
            counts.append((token, body_without_tracked_shortcodes.count(token)))
        elif token in ("[", "]"):
            counts.append((token, normalized_brackets_body.count(token)))
        elif token == "http":
            counts.append((token, len(_MARKUP_HTTP_URL_RE.findall(body))))
        else:
            counts.append((token, body.count(token)))
    return frozenset(counts)

def _normalize_internal_link(url: str, allow_bare_section: bool = False) -> str:
    url = url.strip().strip("\"'")
    if not url or url.startswith("#") or url.startswith("mailto:"):
        return ""
    url = _LINK_SITE_ROOT_RE.sub("/", url)
    if allow_bare_section and _LINK_SECTION_PATH_RE.match("/" + url):
        url = "/" + url
    clean_url = url.split("#")[0].split("?")[0].rstrip("/")
    clean_url = _LINK_LOCALE_PREFIX_RE.sub(r"\1", clean_url)
    if (
        _LINK_OFFICIAL_EXTERNAL_RE.match(clean_url)
        and "code-of-conduct-languages" not in clean_url
    ):
        return clean_url
    if _LINK_SECTION_PATH_RE.match(clean_url):
        return clean_url
    return ""

def _extract_front_matter_keys(text: str) -> FrozenSet[str]:
    match = _FRONT_MATTER_BLOCK_RE.match(text)
    if not match:
        return frozenset()
    return frozenset(_FRONT_MATTER_KEY_RE.findall(match.group(1)))

def _extract_front_matter_values(text: str) -> FrozenSet[Tuple[str, str]]:
    match = _FRONT_MATTER_BLOCK_RE.match(text)
    if not match:
        return frozenset()
    block = _STRIP_CMNT.sub("", match.group(1))
    pairs: Set[Tuple[str, str]] = set()
    for key, raw_val in _FRONT_MATTER_SCALAR_RE.findall(block):
        if key in _FRONT_MATTER_IGNORED_VALUE_KEYS:
            continue
        val = raw_val.strip().strip("\"'")
        if not val or val in (">", ">-", "|", "|-"):
            continue
        if key in ("full_link", "full-link"):
            normalized_val = _normalize_internal_link(val, allow_bare_section=True)
            val = normalized_val or _LINK_LOCALE_PREFIX_RE.sub(r"\1", val.rstrip("/"))
        elif val.lower() in ("true", "false"):
            val = val.lower()
        pairs.add((key, val))
    for nested_key, nested_val in _FRONT_MATTER_NESTED_STRUCTURAL_RE.findall(block):
        if nested_key in ("apiVersion", "kind"):
            continue
        pairs.add((f"nested:{nested_key}", nested_val.strip().strip("\"'")))
    return frozenset(pairs)

def _extract_shortcode_values(text: str) -> FrozenSet[str]:
    body = _STRIP_CODE.sub(
        "", _STRIP_CMNT.sub("", _STRIP_FM.sub("", text, count=1))
    )
    tokens: Set[str] = set()
    for shortcode_match in _SHORTCODE_CALL_RE.finditer(body):
        name = shortcode_match.group(1).lstrip("-")
        if name.startswith("/") or name in ("feature_state", "feature-state"):
            continue
        args = shortcode_match.group(2).strip().rstrip("-").strip()
        attr_pairs = _SHORTCODE_ATTR_RE.findall(args)
        if attr_pairs:
            for attr_key, attr_val in attr_pairs:
                if attr_key in _SHORTCODE_TRANSLATABLE_ATTRS and not (
                    name == "feature-gate-description" and attr_key == "name"
                ):
                    continue
                val = attr_val.strip()
                if attr_key == "term_id":
                    val = val.lower()
                elif attr_key in ("path", "url"):
                    val = _normalize_internal_link(val, allow_bare_section=True) or val
                tokens.add(f"{name}:{attr_key}={val}")
        elif args and name in _SHORTCODE_POSITIONAL_NAMES:
            val = args.strip().strip("\"'")
            if name in ("ref", "relref"):
                val = (
                    _normalize_internal_link(val, allow_bare_section=True)
                    or val.split("#")[0].rstrip("/")
                )
            elif name == "include":
                val = val.lstrip("/")
            tokens.add(f"{name}={val}")
        elif not args and name in _SHORTCODE_BARE_NAMES:
            tokens.add(name)
    return frozenset(tokens)

def _extract_internal_links(text: str) -> FrozenSet[str]:
    body = _STRIP_INLINE.sub(
        "",
        _STRIP_CODE.sub(
            "", _STRIP_CMNT.sub("", _STRIP_FM.sub("", text, count=1))
        ),
    )
    links: Set[str] = set()
    for link_match in _LINK_MARKDOWN_TARGET_RE.finditer(body):
        raw_url = link_match.group(1) or link_match.group(2) or ""
        normalized_url = _normalize_internal_link(raw_url, allow_bare_section=True)
        if normalized_url:
            links.add(normalized_url)
    return frozenset(links)

def _extract_code_identifiers(text: str) -> FrozenSet[str]:
    text_no_comments = _STRIP_CMNT.sub("", _STRIP_FM.sub("", text, count=1))
    tokens: Set[str] = set()
    for code_match in _CODE_IDENTIFIER_SPAN_OR_BLOCK_RE.finditer(text_no_comments):
        chunk = code_match.group(0)
        for match in _CODE_IDENTIFIER_CLI_FLAG_RE.finditer(chunk):
            tokens.add(f"flag:{match.group(1)}")
        for match in _CODE_IDENTIFIER_CLI_COMMAND_RE.finditer(chunk):
            tokens.add(f"cmd:{' '.join(match.group(1).split())}")
        for match in _CODE_IDENTIFIER_SYSCTL_OR_K8S_KEY_RE.finditer(chunk):
            tokens.add(f"key:{match.group(1)}")
    return frozenset(tokens)

def _extract_example_files(text: str) -> FrozenSet[str]:
    body = _STRIP_CODE.sub(
        "", _STRIP_CMNT.sub("", _STRIP_FM.sub("", text, count=1))
    )
    return frozenset(
        match.group(1).strip().lstrip("/")
        for match in _EXAMPLE_SHORTCODE_FILE_RE.finditer(body)
        if match.group(1).strip()
    )

_NORMALIZED_EXAMPLE_CACHE: Dict[str, Optional[str]] = {}

def _normalize_example_code(path: str) -> Optional[str]:
    if path in _NORMALIZED_EXAMPLE_CACHE:
        return _NORMALIZED_EXAMPLE_CACHE[path]
    if not os.path.isfile(path):
        _NORMALIZED_EXAMPLE_CACHE[path] = None
        return None
    try:
        with open(path, encoding="utf-8-sig", errors="replace") as fh:
            raw = fh.read()
    except OSError:
        _NORMALIZED_EXAMPLE_CACHE[path] = None
        return None
    lines: List[str] = []
    for line in raw.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        stripped = re.sub(r"[ \t]+#.*$", "", stripped)
        stripped = re.sub(r"\s+", " ", stripped)
        lines.append(stripped)
    normalized = "\n".join(lines)
    _NORMALIZED_EXAMPLE_CACHE[path] = normalized
    return normalized

def _find_outdated_local_examples(
    example_files: FrozenSet[str],
    en_path: str,
    l10n_path: str,
    locale: str,
) -> FrozenSet[str]:
    if not example_files or "content/en/" not in en_path:
        return frozenset()
    en_prefix = en_path.split("content/en/")[0]
    l10n_marker = f"content/{locale}/"
    l10n_prefix = (
        l10n_path.split(l10n_marker)[0] if l10n_marker in l10n_path else en_prefix
    )
    en_examples_dir = os.path.join(en_prefix, "content", "en", "examples")
    l10n_examples_dir = os.path.join(l10n_prefix, "content", locale, "examples")
    outdated: Set[str] = set()
    for rel_example_path in example_files:
        l10n_example_path = os.path.join(l10n_examples_dir, rel_example_path)
        l10n_normalized = _normalize_example_code(l10n_example_path)
        if l10n_normalized is None:
            continue
        en_example_path = os.path.join(en_examples_dir, rel_example_path)
        en_normalized = _normalize_example_code(en_example_path)
        if en_normalized is not None and l10n_normalized != en_normalized:
            outdated.add(rel_example_path)
    return frozenset(outdated)

def parse_markdown(path: str, locale: str = "") -> ParsedFile:
    # `locale` is retained for call-site stability; no longer consumed.
    del locale
    with open(path, encoding="utf-8-sig", errors="replace") as fh:
        text = fh.read()
    is_l10n = "content/en/" not in path.replace("\\", "/")
    text_no_comments = _STRIP_CMNT.sub("", text)
    if is_l10n:
        versions = frozenset(
            (int(match.group(1) or match.group(3)), int(match.group(2) or match.group(4)))
            for match in _VERSION_L10N_RE.finditer(text_no_comments)
        )
    else:
        versions = frozenset(
            (int(major), int(minor)) for major, minor in _VERSION_RE.findall(text_no_comments)
        )
    h2, h3, h4, code_blocks, anchors = _extract_structure(text)
    return ParsedFile(
        visible_lines=_count_visible_lines(text),
        h2=h2, h3=h3, code_blocks=code_blocks,
        anchors=anchors,
        versions=versions,
        body_words=_count_body_words(text),
        feature_state_tokens=_extract_feature_state_tokens(text),
        api_kind_tokens=_extract_api_kind_tokens(text),
        h4=h4,
        paragraphs=_count_paragraphs(text),
        markup_tokens=_count_markup_tokens(text),
        front_matter_keys=_extract_front_matter_keys(text),
        front_matter_values=_extract_front_matter_values(text),
        shortcode_values=_extract_shortcode_values(text),
        internal_links=_extract_internal_links(text),
        code_identifiers=_extract_code_identifiers(text),
        example_files=_extract_example_files(text),
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

def _compute_markup_token_mismatches(
    en_tokens: FrozenSet[Tuple[str, int]], l10n_tokens: FrozenSet[Tuple[str, int]],
) -> Tuple[Tuple[str, int, int], ...]:
    en_counts = dict(en_tokens)
    l10n_counts = dict(l10n_tokens)
    mismatches = []
    for token in _MARKUP_TOKENS:
        en_count = en_counts.get(token, 0)
        l10n_count = l10n_counts.get(token, 0)
        if en_count == 0 and l10n_count == 0:
            continue
        count_diff = abs(en_count - l10n_count)
        relative_diff = count_diff / max(en_count, 1)
        if (
            count_diff >= _MARKUP_MISMATCH_MIN_DIFF
            and relative_diff >= _MARKUP_MISMATCH_MIN_RATIO
        ):
            mismatches.append((token, en_count, l10n_count))
    return tuple(mismatches)

def compute_stats(
    en: ParsedFile,
    l10n: ParsedFile,
    outdated_local_examples: FrozenSet[str] = frozenset(),
) -> FileStats:
    line_ratio = (
        min(l10n.visible_lines / en.visible_lines, 2.0)
        if en.visible_lines > 0 else 1.0
    )
    body_word_ratio = (
        l10n.body_words / en.body_words if en.body_words > 0 else 1.0
    )

    if l10n.visible_lines > 0:
        missing_feature_state = (
            len(en.feature_state_tokens - l10n.feature_state_tokens)
            or len(l10n.feature_state_tokens - en.feature_state_tokens)
        )
        missing_api_or_kind = len(en.api_kind_tokens - l10n.api_kind_tokens)
        missing_shortcode_values = en.shortcode_values - l10n.shortcode_values
        missing_internal_links = en.internal_links - l10n.internal_links
        missing_code_identifiers = en.code_identifiers - l10n.code_identifiers
        outdated_examples = outdated_local_examples
    else:
        missing_feature_state = 0
        missing_api_or_kind = 0
        missing_shortcode_values = frozenset()
        missing_internal_links = frozenset()
        missing_code_identifiers = frozenset()
        outdated_examples = frozenset()

    missing_front_matter_values = frozenset(
        (key, val)
        for key, val in (en.front_matter_values - l10n.front_matter_values)
        if _FRONT_MATTER_NESTED_PARENT_KEYS.get(key, key) in l10n.front_matter_keys
    )

    missing_h2 = max(0, en.h2 - l10n.h2)
    missing_h3 = max(0, en.h3 - l10n.h3)
    en_total_headings = en.h2 + en.h3 + en.h4
    l10n_total_headings = l10n.h2 + l10n.h3 + l10n.h4
    shifted_headings = max(
        abs(en.h2 - l10n.h2), abs(en.h3 - l10n.h3), abs(en.h4 - l10n.h4)
    )
    heading_level_shift = (
        l10n.visible_lines > 0
        and en_total_headings == l10n_total_headings
        and 1 <= (missing_h2 + missing_h3) <= 3
        and 1 <= shifted_headings <= 3
    )
    extra_headings = (
        max(0, l10n_total_headings - en_total_headings)
        if l10n.visible_lines > 0 and (l10n.h2 > en.h2 or l10n.h3 > en.h3)
        else 0
    )

    return FileStats(
        l10n_to_en_line_ratio=line_ratio,
        l10n_to_en_body_word_ratio=body_word_ratio,
        missing_h2=missing_h2,
        missing_h3=missing_h3,
        missing_code_blocks=max(0, en.code_blocks - l10n.code_blocks),
        missing_anchors=len(en.anchors - l10n.anchors),
        missing_new_versions=_count_missing_new_versions(en.versions, l10n.versions),
        missing_feature_state=missing_feature_state,
        missing_api_or_kind=missing_api_or_kind,
        extra_headings=extra_headings,
        heading_level_shift=heading_level_shift,
        markup_token_mismatches=_compute_markup_token_mismatches(
            en.markup_tokens, l10n.markup_tokens
        ),
        missing_front_matter_keys=(
            (en.front_matter_keys - l10n.front_matter_keys)
            - _FRONT_MATTER_OPTIONAL_KEYS
        ),
        missing_front_matter_values=missing_front_matter_values,
        missing_shortcode_values=missing_shortcode_values,
        missing_internal_links=missing_internal_links,
        missing_code_identifiers=missing_code_identifiers,
        outdated_local_examples=outdated_examples,
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
    ratio_str = (
        "<0.01"
        if 0 < l10n_to_en_line_ratio < 0.005
        else f"{l10n_to_en_line_ratio:.2f}"
    )
    if level == _LENGTH_GAP_LARGE:
        inv = (
            f"{1 / l10n_to_en_line_ratio:.1f}×"
            if l10n_to_en_line_ratio > 0 else "∞"
        )
        return f"{inv} shorter than en (line ratio {ratio_str})"
    if level == _LENGTH_GAP_MODERATE:
        return f"substantially shorter than en (line ratio {ratio_str})"
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
    if not has_support or stats.l10n_to_en_body_word_ratio >= _LATIN_BODY_RATIO_MIN:
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

def _has_severe_paragraph_loss(en: ParsedFile, l10n: ParsedFile) -> bool:
    return (
        en.paragraphs >= 4
        and (en.paragraphs - l10n.paragraphs) >= 2
        and (l10n.paragraphs / en.paragraphs) <= 0.50
    )


def _has_length_gap_support(stats: FileStats) -> bool:
    """Return whether non-length indicators support a length-gap finding."""
    return (
        stats.missing_h2 > 0
        or stats.missing_h3 > 0
        or stats.missing_code_blocks > 0
        or stats.missing_new_versions > 0
        or len(stats.markup_token_mismatches) >= 2
        or len(stats.missing_internal_links) >= _STRONG_LINK_THRESHOLD
    )


def _has_standalone_volume_loss(
    stats: FileStats, en: ParsedFile, l10n: ParsedFile, profile: LocaleProfile,
) -> bool:
    if l10n.visible_lines == 0:
        return False
    if (
        _has_severe_paragraph_loss(en, l10n)
        and stats.l10n_to_en_body_word_ratio < _LATIN_BODY_RATIO_MIN
    ):
        return True
    if (
        not profile.ignore_only_length_gap
        and en.visible_lines >= 20
        and stats.l10n_to_en_line_ratio < 0.50
        and stats.l10n_to_en_body_word_ratio < 0.60
    ):
        return True
    return False


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

    standalone_volume_loss = _has_standalone_volume_loss(stats, en, l10n, profile)
    has_support = _has_length_gap_support(stats) or standalone_volume_loss

    if standalone_volume_loss and level not in (_LENGTH_GAP_LARGE, _LENGTH_GAP_MODERATE):
        level = _LENGTH_GAP_MODERATE

    if not standalone_volume_loss and _should_ignore_length_gap(
        stats, en, l10n, profile, level, has_support
    ):
        level = _LENGTH_GAP_NONE

    if level == _LENGTH_GAP_LARGE and l10n.visible_lines > 0:
        indicators.append("large_length_gap")
    elif level == _LENGTH_GAP_MODERATE:
        indicators.append("moderate_length_gap")

    if (stats.missing_h2 >= _STRONG_H2_THRESHOLD
            or stats.extra_headings >= 3
            or (stats.missing_h2 >= 1 and stats.missing_h3 >= _STRONG_H3_WITH_H2_THRESHOLD)):
        indicators.append("severe_heading_loss")
    elif stats.missing_h2 >= 1 or stats.missing_h3 >= 1 or stats.extra_headings >= 1:
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
    elif stats.missing_feature_state or stats.missing_api_or_kind:
        indicators.append("moderate_api_or_feature_mismatch")

    if len(stats.markup_token_mismatches) >= _STRONG_MARKUP_THRESHOLD:
        indicators.append("severe_markup_token_loss")
    elif stats.markup_token_mismatches:
        indicators.append("moderate_markup_token_loss")

    if stats.missing_front_matter_keys:
        indicators.append("missing_front_matter_keys")

    if stats.missing_front_matter_values:
        indicators.append("front_matter_value_mismatch")

    if len(stats.missing_shortcode_values) >= _STRONG_SHORTCODE_THRESHOLD:
        indicators.append("severe_shortcode_mismatch")
    elif stats.missing_shortcode_values:
        indicators.append("moderate_shortcode_mismatch")

    if len(stats.missing_internal_links) >= _STRONG_LINK_THRESHOLD:
        indicators.append("severe_internal_link_loss")
    elif stats.missing_internal_links:
        indicators.append("moderate_internal_link_loss")

    if len(stats.missing_code_identifiers) >= _STRONG_CODE_IDENTIFIER_THRESHOLD:
        indicators.append("severe_code_identifier_mismatch")
    elif stats.missing_code_identifiers:
        indicators.append("moderate_code_identifier_mismatch")

    if len(stats.outdated_local_examples) >= _STRONG_EXAMPLE_THRESHOLD:
        indicators.append("severe_example_file_mismatch")
    elif stats.outdated_local_examples:
        indicators.append("moderate_example_file_mismatch")

    return indicators

# --- Status classification ---

def classify_status(indicators: List[str]) -> str:
    if not indicators:
        return STATUS_NO_SIGNAL

    indicator_set = set(indicators)
    if indicator_set & _STRONG_INDICATORS:
        return STATUS_STRONG_SIGNAL
    if indicator_set & _SUPPORTING_INDICATORS:
        return STATUS_MODERATE_SIGNAL
    return STATUS_NO_SIGNAL

def _is_minor_fix(
    stats: FileStats, en: ParsedFile, l10n: ParsedFile, indicators: List[str],
) -> bool:
    if not indicators:
        return False
    indicator_set = set(indicators)
    major_indicators = indicator_set & _MAJOR_FIX_INDICATORS
    if stats.heading_level_shift:
        major_indicators = major_indicators - {
            "moderate_heading_loss", "severe_heading_loss",
        }
    if major_indicators or stats.extra_headings > 0:
        return False
    if (
        abs(en.paragraphs - l10n.paragraphs) >= 5
        and abs(en.paragraphs - l10n.paragraphs) / max(en.paragraphs, 1) >= 0.25
    ):
        return False
    for token, en_count, l10n_count in stats.markup_token_mismatches:
        if token in ("bullet_list", "numbered_list", "|") and abs(en_count - l10n_count) >= 4:
            return False
    extra_examples = sum(
        1
        for example_path in stats.outdated_local_examples
        if f"code_sample:file={example_path}" not in stats.missing_shortcode_values
    )
    total = (
        len(stats.missing_front_matter_keys)
        + len(stats.missing_front_matter_values)
        + len(stats.missing_internal_links)
        + len(stats.missing_shortcode_values)
        + len(stats.missing_code_identifiers)
        + extra_examples
        + stats.missing_feature_state
        + stats.missing_api_or_kind
        + stats.missing_new_versions
        + stats.missing_anchors
        + (1 if stats.heading_level_shift else 0)
    )
    return 0 < total <= _MINOR_FIX_MAX_ITEMS

# --- Reason generation ---

_ONLY_ANCHOR_INDICATOR_SUFFIX = " (only indicator — verify anchor naming)"

_FALLBACK_REASON = "content indicators suggest localized file may be outdated"

def _format_truncated_items(items: List[str], limit: int = 5) -> str:
    shown = items[:limit]
    more = f", +{len(items) - limit} more" if len(items) > limit else ""
    return f"{', '.join(shown)}{more}"


def build_reasons(
    stats: FileStats, en: ParsedFile, l10n: ParsedFile,
    locale: str, indicators: List[str],
) -> List[str]:
    reasons: List[str] = []
    indicator_set = set(indicators)

    if "empty_stub" in indicator_set:
        reasons.append(f"no visible body content (en has {en.visible_lines} lines)")

    if "large_length_gap" in indicator_set:
        reason = _build_length_gap_reason(_LENGTH_GAP_LARGE, stats.l10n_to_en_line_ratio)
        if _has_severe_paragraph_loss(en, l10n):
            reason += f"; missing {en.paragraphs - l10n.paragraphs} of {en.paragraphs} paragraphs"
        reasons.append(reason)

    if stats.heading_level_shift:
        shifted = max(
            abs(en.h2 - l10n.h2), abs(en.h3 - l10n.h3), abs(en.h4 - l10n.h4)
        )
        reasons.append(
            f"heading level mismatch ({shifted} heading(s) shifted between H2/H3/H4)"
        )
    elif stats.missing_h2 > 0 or stats.missing_h3 > 0:
        parts = []
        if stats.missing_h2:
            parts.append(f"{stats.missing_h2} H2")
        if stats.missing_h3:
            parts.append(f"{stats.missing_h3} H3")
        reasons.append(f"missing headings ({', '.join(parts)})")
    elif stats.extra_headings > 0:
        reasons.append(
            f"extra headings in localized ({stats.extra_headings} section(s) removed in en)"
        )

    if stats.missing_code_blocks:
        reasons.append(f"missing {stats.missing_code_blocks} code block(s)")

    only_anchor = len(indicators) == 1
    if stats.missing_anchors and (
        "severe_anchor_loss" in indicator_set or only_anchor
    ):
        reason = f"missing {stats.missing_anchors} section anchor(s)"
        if only_anchor:
            reason += _ONLY_ANCHOR_INDICATOR_SUFFIX
        reasons.append(reason)

    if stats.missing_new_versions:
        reasons.append(
            f"missing {stats.missing_new_versions} Kubernetes version reference(s)"
        )

    if stats.missing_feature_state and stats.missing_api_or_kind:
        reasons.append("missing feature-state and apiVersion/kind value(s)")
    elif stats.missing_feature_state:
        reasons.append(f"missing {stats.missing_feature_state} feature-state token(s)")
    elif stats.missing_api_or_kind:
        reasons.append(f"missing {stats.missing_api_or_kind} apiVersion/kind value(s)")

    semantic_reasons: List[Tuple[bool, str]] = []

    if stats.missing_shortcode_values:
        formatted_items = _format_truncated_items([
            f"`{item}`" for item in sorted(stats.missing_shortcode_values)
        ])
        semantic_reasons.append((
            "severe_shortcode_mismatch" in indicator_set,
            f"missing {len(stats.missing_shortcode_values)} shortcode value(s): "
            f"{formatted_items}",
        ))

    if stats.outdated_local_examples:
        formatted_items = _format_truncated_items([
            f"`{item}`" for item in sorted(stats.outdated_local_examples)
        ])
        semantic_reasons.append((
            "severe_example_file_mismatch" in indicator_set,
            f"outdated {len(stats.outdated_local_examples)} local example(s): "
            f"{formatted_items}",
        ))

    if stats.missing_internal_links:
        formatted_items = _format_truncated_items([
            f"`{item}`" for item in sorted(stats.missing_internal_links)
        ])
        semantic_reasons.append((
            "severe_internal_link_loss" in indicator_set,
            f"missing {len(stats.missing_internal_links)} link target(s): "
            f"{formatted_items}",
        ))

    if stats.missing_code_identifiers:
        formatted_items = _format_truncated_items([
            f"`{item}`" for item in sorted(stats.missing_code_identifiers)
        ])
        semantic_reasons.append((
            "severe_code_identifier_mismatch" in indicator_set,
            f"missing {len(stats.missing_code_identifiers)} CLI/code identifier(s): "
            f"{formatted_items}",
        ))

    for is_severe, reason_text in semantic_reasons:
        if is_severe:
            reasons.append(reason_text)

    if "moderate_length_gap" in indicator_set:
        if _has_severe_paragraph_loss(en, l10n) and stats.l10n_to_en_line_ratio >= 0.65:
            reasons.append(
                f"missing {en.paragraphs - l10n.paragraphs} of {en.paragraphs} paragraphs "
                f"(word ratio {stats.l10n_to_en_body_word_ratio:.2f})"
            )
        else:
            reason = _build_length_gap_reason(_LENGTH_GAP_MODERATE, stats.l10n_to_en_line_ratio)
            if _has_severe_paragraph_loss(en, l10n):
                reason += f"; missing {en.paragraphs - l10n.paragraphs} of {en.paragraphs} paragraphs"
            reasons.append(reason)
    elif (
        "large_length_gap" not in indicator_set
        and abs(en.paragraphs - l10n.paragraphs) >= 5
        and abs(en.paragraphs - l10n.paragraphs) / max(en.paragraphs, 1) >= 0.25
    ):
        if en.paragraphs > l10n.paragraphs:
            reasons.append(
                f"missing {en.paragraphs - l10n.paragraphs} of {en.paragraphs} paragraphs"
            )
        else:
            reasons.append(
                f"extra {l10n.paragraphs - en.paragraphs} paragraphs in localized "
                f"({locale} {l10n.paragraphs} vs en {en.paragraphs})"
            )

    if stats.markup_token_mismatches and "severe_markup_token_loss" in indicator_set:
        formatted_items = _format_truncated_items([
            f"`{token}` (en {en_count} vs {l10n_count})"
            for token, en_count, l10n_count in stats.markup_token_mismatches
        ])
        reasons.append(f"markup count mismatch: {formatted_items}")

    for is_severe, reason_text in semantic_reasons:
        if not is_severe:
            reasons.append(reason_text)

    if stats.missing_anchors and not (
        "severe_anchor_loss" in indicator_set or only_anchor
    ):
        reasons.append(f"missing {stats.missing_anchors} section anchor(s)")

    if stats.missing_front_matter_keys:
        keys = ", ".join(f"`{key}`" for key in sorted(stats.missing_front_matter_keys))
        reasons.append(f"missing front-matter key(s): {keys}")

    if stats.missing_front_matter_values:
        formatted_items = _format_truncated_items([
            f"`{key}={val}`" for key, val in sorted(stats.missing_front_matter_values)
        ])
        reasons.append(f"front-matter value mismatch: {formatted_items}")

    if stats.markup_token_mismatches and "severe_markup_token_loss" not in indicator_set:
        formatted_items = _format_truncated_items([
            f"`{token}` (en {en_count} vs {l10n_count})"
            for token, en_count, l10n_count in stats.markup_token_mismatches
        ])
        reasons.append(f"markup count mismatch: {formatted_items}")

    return reasons or [_FALLBACK_REASON]

# --- Per-file analysis ---

def analyze_file_pair(
    en_path: str,
    l10n_path: str,
    locale: str,
    en_lastmod: int = 0,
    l10n_lastmod: int = 0,
) -> FileReport:
    profile = get_locale_profile(locale)
    en = parse_markdown(en_path)
    l10n = parse_markdown(l10n_path)
    outdated_examples = _find_outdated_local_examples(
        l10n.example_files, en_path, l10n_path, locale
    )
    stats = compute_stats(en, l10n, outdated_local_examples=outdated_examples)
    indicators = build_indicators(stats, en, l10n, profile)
    status = classify_status(indicators)
    is_minor_fix = False
    if status != STATUS_NO_SIGNAL:
        reasons = build_reasons(stats, en, l10n, locale, indicators)
        is_minor_fix = _is_minor_fix(stats, en, l10n, indicators)
    elif en_lastmod > l10n_lastmod > 0:
        status = STATUS_LASTMOD_ONLY
        indicators = ["lastmod_only"]
        reasons = []
    else:
        reasons = []
    return FileReport(
        localized_path=l10n_path,
        status=status,
        reasons=reasons,
        indicators=indicators,
        is_minor_fix=is_minor_fix,
        en_lastmod=en_lastmod,
        l10n_lastmod=l10n_lastmod,
    )

# --- Locale scanning ---

_GIT_LASTMOD_CACHE: Dict[str, Dict[str, int]] = {}

def _load_git_last_commits(repo_root: str) -> Dict[str, int]:
    abs_root = os.path.abspath(repo_root)
    if abs_root in _GIT_LASTMOD_CACHE:
        return _GIT_LASTMOD_CACHE[abs_root]

    last_timestamps: Dict[str, int] = {}
    try:
        out = subprocess.check_output(
            [
                "git", "log", "--first-parent", "-m",
                "--format=COMMIT:%ct", "--name-only", "--", "content/",
            ],
            cwd=abs_root,
            text=True,
            stderr=subprocess.DEVNULL,
            errors="replace",
        )
        commit_timestamp = 0
        for line in out.splitlines():
            if line.startswith("COMMIT:"):
                commit_timestamp = int(line.split(":", 1)[1])
            elif line.startswith("content/") and line not in last_timestamps:
                last_timestamps[line] = commit_timestamp
    except (OSError, subprocess.SubprocessError, ValueError):
        last_timestamps = {}

    _GIT_LASTMOD_CACHE[abs_root] = last_timestamps
    return last_timestamps

_ORPHAN_HISTORY_CACHE: Dict[
    str,
    Tuple[
        Dict[str, Tuple[str, Optional[str], str, str, Tuple[str, ...]]],
        Dict[str, str],
    ],
] = {}

def _load_orphan_history(
    repo_root: str,
) -> Tuple[
    Dict[str, Tuple[str, Optional[str], str, str, Tuple[str, ...]]],
    Dict[str, str],
]:
    abs_root = os.path.abspath(repo_root)
    if abs_root in _ORPHAN_HISTORY_CACHE:
        return _ORPHAN_HISTORY_CACHE[abs_root]

    events: Dict[str, Tuple[str, Optional[str], str, str, Tuple[str, ...]]] = {}
    try:
        out = subprocess.check_output(
            [
                "git", "log", "-M60%", "--diff-filter=ARD",
                "--name-status", "--format=COMMIT:%cs|%s", "--", "content/en/",
            ],
            cwd=abs_root,
            text=True,
            stderr=subprocess.DEVNULL,
            errors="replace",
        )
        commits: List[Tuple[str, str, List[List[str]]]] = []
        commit_date, commit_subject = "", ""
        commit_rows: List[List[str]] = []
        for line in out.splitlines():
            if line.startswith("COMMIT:"):
                if commit_rows:
                    commits.append((commit_date, commit_subject, commit_rows))
                commit_date, _, commit_subject = line[7:].partition("|")
                commit_rows = []
            elif "\t" in line:
                commit_rows.append(line.split("\t"))
        if commit_rows:
            commits.append((commit_date, commit_subject, commit_rows))

        for commit_date, commit_subject, rows in commits:
            added_md = [
                row[1] for row in rows
                if row[0] == "A" and row[1].endswith(".md") and "/docs/" in row[1]
            ]
            deleted_md = [
                row[1] for row in rows
                if row[0] == "D" and row[1].endswith(".md") and "/docs/" in row[1]
            ]
            co_added = (
                tuple(sorted(
                    added_md,
                    key=lambda path: ("/included/" in path, path.endswith("/_index.md"), path),
                ))
                if (1 <= len(added_md) <= 15 and len(deleted_md) <= 3)
                else ()
            )
            for parts in rows:
                status_code = parts[0]
                old_path = parts[1]
                if status_code.startswith("R"):
                    new_path = parts[2] if len(parts) > 2 else None
                    if old_path not in events or events[old_path][0] == "D":
                        events[old_path] = (
                            status_code, new_path, commit_date, commit_subject, (),
                        )
                elif status_code == "D" and old_path not in events:
                    events[old_path] = (
                        "D", None, commit_date, commit_subject, co_added,
                    )
    except (OSError, subprocess.SubprocessError):
        events = {}

    redirects: Dict[str, str] = {}
    for redirect_file in ("static/_redirects.base", "static/_redirects"):
        redirect_path = os.path.join(abs_root, redirect_file)
        if not os.path.isfile(redirect_path):
            continue
        try:
            with open(redirect_path, encoding="utf-8", errors="replace") as fh:
                for line in fh:
                    stripped = line.strip()
                    if not stripped or stripped.startswith("#"):
                        continue
                    columns = stripped.split()
                    if len(columns) >= 2:
                        redirects[columns[0].rstrip("/")] = columns[1]
        except OSError:
            pass

    _ORPHAN_HISTORY_CACHE[abs_root] = (events, redirects)
    return events, redirects

def _describe_orphan(rel_l10n: str, locale: str, repo_root: str) -> List[str]:
    abs_root = os.path.abspath(repo_root)
    events, redirects = _load_orphan_history(abs_root)
    rel_doc = rel_l10n.split(f"content/{locale}/", 1)[-1]
    en_path = f"content/en/{rel_doc}"
    url_path = "/" + re.sub(r"(/_index\.md|\.md)$", "", rel_doc).rstrip("/")
    redirect_target = redirects.get(url_path)
    history_event = events.get(en_path)
    commit_date = history_event[2] if history_event else ""
    commit_subject = history_event[3] if history_event else ""
    co_added = history_event[4] if history_event else ()

    if history_event and history_event[1]:
        new_path: Optional[str] = history_event[1]
        seen = {en_path}
        while (
            new_path
            and not os.path.isfile(os.path.join(abs_root, new_path))
            and new_path in events
            and new_path not in seen
        ):
            seen.add(new_path)
            if events[new_path][1]:
                commit_date = events[new_path][2]
                new_path = events[new_path][1]
            else:
                break
        if new_path and os.path.isfile(os.path.join(abs_root, new_path)):
            return [f"moved in en to `{new_path}` ({commit_date})"]

    if redirect_target and "#" not in redirect_target:
        clean_redirect = redirect_target.strip("/")
        candidate_en_path = f"content/en/{clean_redirect}.md"
        if os.path.isfile(os.path.join(abs_root, candidate_en_path)):
            date_suffix = f" ({commit_date})" if commit_date else ""
            return [f"moved in en to `{candidate_en_path}`{date_suffix}"]

    if len(co_added) >= 2:
        formatted_files = _format_truncated_items(
            [f"`{path}`" for path in co_added], limit=3,
        )
        return [
            f"split in en into {len(co_added)} files ({commit_date}): {formatted_files}"
        ]

    if len(co_added) == 1 and os.path.isfile(os.path.join(abs_root, co_added[0])):
        return [f"moved in en to `{co_added[0]}` ({commit_date})"]

    if redirect_target:
        if commit_date:
            return [f"removed in en ({commit_date})", f"redirects to `{redirect_target}`"]
        return [f"redirects in en to `{redirect_target}`"]

    if history_event:
        return [f"removed in en ({commit_date}: {commit_subject})"]

    return ["no en git history found (verify filename or locale-specific page)"]

def _is_candidate_orphan(l10n_path: str, locale: str) -> bool:
    fname = os.path.basename(l10n_path)
    if fname in _ORPHAN_SKIP_BASENAMES:
        return False
    if fname.startswith("localization_") or fname.startswith("localization-"):
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

    last_commits = _load_git_last_commits(repo_root)

    pairs: List[Tuple[str, str]] = []
    orphan_paths: List[str] = []
    for root, _, files in os.walk(locale_dir):
        for fname in sorted(files):
            if not fname.endswith(".md"):
                continue
            l10n_path = os.path.join(root, fname)
            en_path = re.sub(rf"content/{re.escape(locale)}/", "content/en/", l10n_path)
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
        rel_en = _to_rel_path(en_path, repo_root)
        rel_l10n = _to_rel_path(l10n_path, repo_root)
        reports.append(
            analyze_file_pair(
                en_path,
                l10n_path,
                locale,
                en_lastmod=last_commits.get(rel_en, 0),
                l10n_lastmod=last_commits.get(rel_l10n, 0),
            )
        )

    reports.sort(
        key=lambda fr: (_STATUS_SORT_KEY[fr.status], fr.localized_path)
    )
    orphan_paths.sort()
    return reports, orphan_paths

# --- Report formatting ---

_GITHUB_BASE = "https://github.com/kubernetes/website/blob"

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
) -> Tuple[int, int, int, int]:
    c = Counter(fr.status for fr in evaluated)
    return (
        c[STATUS_STRONG_SIGNAL],
        c[STATUS_MODERATE_SIGNAL],
        c[STATUS_LASTMOD_ONLY],
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


def _build_report_disclaimer(include_fix_effort: bool = True) -> List[str]:
    """Triage disclaimer + status-meaning block included in every per-locale report."""
    lines = [
        "> This report is a signal-based triage aid, not a final localization review.",
        "> It checks page structure and outdatedness indicators such as headings, code blocks,",
        "> anchors, Kubernetes versions, and API / feature-state values. It does not",
        "> check translation meaning or quality. Please manually verify flagged files.",
        "",
        "**Triage category meanings:**",
        "",
        "- `Orphan`: no matching English source; verify whether this is expected.",
        "- `Strong signal`: high-confidence signal; likely needs review or update.",
    ]
    if include_fix_effort:
        lines.extend([
            "  - `Major fix`: body structure/volume changed (headings, code blocks, paragraphs, list/table structure) or ≥5 token items differ.",
            "  - `Minor fix`: body structure intact; 1–4 metadata, link, shortcode, anchor, or CLI/API/version items differ.",
        ])
    lines.extend([
        "- `Moderate signal`: medium-confidence signal; verify manually.",
        f"- `{STATUS_LASTMOD_ONLY}`: English source has a newer git commit timestamp (`lastmod`), with no structural or token signal found; verifying and updating is recommended to clear the outdated notice on `kubernetes.io`.",
        "- `No signal`: no signal found; lowest priority, not a guarantee that the translation is current.",
        "",
    ])
    return lines

def _format_file_link(
    rel_path: str,
    repo_root: str,
    output_dir: str,
    bold: bool = True,
    link_mode: Optional[str] = None,
    branch: str = "main",
) -> str:
    target = os.path.relpath(os.path.join(repo_root, rel_path), output_dir)
    local_link = f"[**`{rel_path}`**]({target})" if bold else f"[`{rel_path}`]({target})"
    if link_mode == "web":
        web_url = f"{_GITHUB_BASE}/{branch}/{rel_path}?plain=1"
        return f"{local_link} [(web)]({web_url})"
    return local_link


def _format_inline_repo_paths(
    text: str,
    repo_root: str,
    output_dir: str,
    link_mode: Optional[str] = None,
    branch: str = "main",
) -> str:
    def _replace_path(match: re.Match) -> str:
        rel_path = match.group(1)
        if os.path.isfile(os.path.join(repo_root, rel_path)):
            return _format_file_link(
                rel_path, repo_root, output_dir, bold=False,
                link_mode=link_mode, branch=branch,
            )
        return match.group(0)

    return re.sub(r"`(content/[^`\s]+\.md)`", _replace_path, text)


def _render_file_reports(
    items: List[FileReport],
    locale: str,
    repo_root: str,
    detailed: bool,
    link_mode: Optional[str],
    branch: str,
    output_dir: str,
) -> List[str]:
    out: List[str] = []
    for fr in items:
        path = _to_rel_path(fr.localized_path, repo_root)
        header = _format_file_link(
            path, repo_root, output_dir, bold=True,
            link_mode=link_mode, branch=branch,
        )
        en_rel = re.sub(rf"^content/{re.escape(locale)}/", "content/en/", path)
        en_link = _format_file_link(
            en_rel, repo_root, output_dir, bold=False,
            link_mode=link_mode, branch=branch,
        )
        if fr.en_lastmod > 0 and fr.l10n_lastmod > 0:
            en_date = datetime.date.fromtimestamp(fr.en_lastmod).isoformat()
            l10n_date = datetime.date.fromtimestamp(fr.l10n_lastmod).isoformat()
            commit_note = f" (updated: en {en_date}, {locale} {l10n_date})"
        else:
            commit_note = ""

        out.append(header)
        out.append(f"- en: {en_link}{commit_note}")
        if detailed:
            out.extend(f"- {r}" for r in fr.reasons)
            if fr.indicators and fr.indicators != ["lastmod_only"]:
                out.append(f"- Indicators: {', '.join(fr.indicators)}")
        else:
            if (
                fr.is_minor_fix
                or fr.status == STATUS_MODERATE_SIGNAL
                or not (set(fr.indicators) & _MAJOR_FIX_INDICATORS)
            ) and len(fr.reasons) > 1:
                summary_reasons = [
                    r for r in fr.reasons
                    if not (fr.is_minor_fix and r.startswith("markup count mismatch:"))
                ] or fr.reasons
            elif len(fr.reasons) > 1 and not (
                set(fr.indicators) & _STRUCTURAL_LOSS_INDICATORS
            ):
                summary_reasons = fr.reasons[:3]
            else:
                summary_reasons = [fr.reasons[0]] if fr.reasons else []
            out.extend(f"- {r}" for r in summary_reasons)
        out.append("")
    return out


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
    strong, moderate, lastmod_only, no_signal = count_files_by_status(evaluated)
    total = len(evaluated) + len(orphans)

    by_status: Dict[str, List[FileReport]] = {
        STATUS_STRONG_SIGNAL: [],
        STATUS_MODERATE_SIGNAL: [],
        STATUS_LASTMOD_ONLY: [],
        STATUS_NO_SIGNAL: [],
    }
    for fr in evaluated:
        by_status[fr.status].append(fr)

    major_count = sum(1 for fr in by_status[STATUS_STRONG_SIGNAL] if not fr.is_minor_fix)
    minor_count = sum(1 for fr in by_status[STATUS_STRONG_SIGNAL] if fr.is_minor_fix)

    w = max(len(STATUS_STRONG_SIGNAL), len(STATUS_MODERATE_SIGNAL),
            len(STATUS_LASTMOD_ONLY), len(STATUS_NO_SIGNAL),
            len("Evaluated"), len("Orphan"), len("↳ Major fix"), len("↳ Minor fix"))
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
        f"| {'Orphan':<{w}} | {len(orphans)} |",
        f"| {STATUS_STRONG_SIGNAL:<{w}} | {strong} |",
        f"| {'↳ Major fix':<{w}} | {major_count} |",
        f"| {'↳ Minor fix':<{w}} | {minor_count} |",
        f"| {STATUS_MODERATE_SIGNAL:<{w}} | {moderate} |",
        f"| {STATUS_LASTMOD_ONLY:<{w}} | {lastmod_only} |",
        f"| {STATUS_NO_SIGNAL:<{w}} | {no_signal} |",
        "",
    ])

    area_counts: Counter = Counter(
        _extract_doc_area(fr.localized_path, locale)
        for fr in evaluated
        if fr.status in (STATUS_STRONG_SIGNAL, STATUS_MODERATE_SIGNAL)
    )
    if area_counts:
        lines.extend(["**Top affected areas (flagged files):**", ""])
        for area, count in area_counts.most_common(8):
            lines.append(f"- `{area}`: {count} files")
        lines.append("")

    lines.extend([
        f"### Orphan localized files, no English source ({len(orphans)})",
        "",
    ])
    if orphans:
        lines.append(f"_{_ORPHAN_REASON}_")
        lines.append("")
        for path in orphans:
            rel = _to_rel_path(path, repo_root)
            header = _format_file_link(
                rel, repo_root, output_dir, bold=True,
                link_mode=link_mode, branch=branch,
            )
            lines.append(header)
            for note in _describe_orphan(rel, locale, repo_root):
                formatted_note = _format_inline_repo_paths(
                    note, repo_root, output_dir,
                    link_mode=link_mode, branch=branch,
                )
                lines.append(f"- {formatted_note}")
            lines.append("")
    else:
        lines.extend(["_None_", ""])

    for key in (STATUS_STRONG_SIGNAL, STATUS_MODERATE_SIGNAL, STATUS_LASTMOD_ONLY):
        items = by_status[key]
        lines.extend([f"### {key} ({len(items)})", ""])
        if key == STATUS_LASTMOD_ONLY and items:
            lines.extend([f"_{_LASTMOD_ONLY_NOTE}_", ""])
        if not items:
            lines.extend(["_None_", ""])
            continue
        if key == STATUS_STRONG_SIGNAL:
            major_items = [fr for fr in items if not fr.is_minor_fix]
            minor_items = [fr for fr in items if fr.is_minor_fix]
            lines.extend([f"#### Major fix ({len(major_items)})", ""])
            if major_items:
                lines.extend(_render_file_reports(
                    major_items, locale, repo_root, detailed,
                    link_mode, branch, output_dir,
                ))
            else:
                lines.extend(["_None_", ""])
            lines.extend([f"#### Minor fix ({len(minor_items)})", ""])
            if minor_items:
                lines.extend(_render_file_reports(
                    minor_items, locale, repo_root, detailed,
                    link_mode, branch, output_dir,
                ))
            else:
                lines.extend(["_None_", ""])
        else:
            lines.extend(_render_file_reports(
                items, locale, repo_root, detailed,
                link_mode, branch, output_dir,
            ))

    return "\n".join(lines)

def build_index_report(
    results: List[Tuple[str, List[FileReport], List[str]]], date: str,
) -> str:
    lines = [
        "## Localization triage index",
        "",
        f"Generated: {date}  ",
        "Method: checks page structure and outdatedness indicators  ",
        "Script: `l10n-outdatedness-triage.py`",
        "",
    ]
    lines.extend(_build_report_disclaimer(include_fix_effort=False))
    lines.extend([
        f"| Locale | Report | Evaluated | Orphan | {STATUS_STRONG_SIGNAL} | {STATUS_MODERATE_SIGNAL} | {STATUS_LASTMOD_ONLY} | {STATUS_NO_SIGNAL} |",
        "|---|---|---:|---:|---:|---:|---:|---:|",
    ])
    for locale, evaluated, orphans in results:
        strong, moderate, lastmod_only, no_signal = count_files_by_status(evaluated)
        total = len(evaluated) + len(orphans)
        fname = f"l10n-status-{locale}.md"
        lines.append(
            f"| `{locale}` | [{fname}]({fname}) | {total} |"
            f" {len(orphans)} | {strong} |"
            f" {moderate} | {lastmod_only} | {no_signal} |"
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
            "Link mode for file entries (relative local links are always included). "
            "MODE: 'web' appends [(web)] GitHub links; "
            "'local' keeps relative local links only."
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
        strong, moderate, lastmod_only, no_signal = count_files_by_status(evaluated)
        print(
            f"Wrote {out_path}  "
            f"({len(orphans)} orphans, {strong} {STATUS_STRONG_SIGNAL}, "
            f"{moderate} {STATUS_MODERATE_SIGNAL}, "
            f"{lastmod_only} {STATUS_LASTMOD_ONLY}, {no_signal} {STATUS_NO_SIGNAL})",
            file=sys.stderr,
        )

    if len(locales) > 1:
        index_path = os.path.join(args.output_dir, "l10n-status-all.md")
        with open(index_path, "w", encoding="utf-8") as fh:
            fh.write(build_index_report(all_results, date))
        print(f"Wrote {index_path}", file=sys.stderr)

if __name__ == "__main__":
    main()
