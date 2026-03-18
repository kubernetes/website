#!/usr/bin/env python3
"""
generate_repo.py
Build the deterministic test repository for the content-drift detection benchmark.

Internal organization:
  1. Data structures (PageFixture, MutationFamily, MutationResult)
  2. Generic markdown parsers
  3. Generic mutation functions (gm_*)
  4. Page introspection / capability discovery
  5. Mutation family transforms (_tf_*)
  6. Mutation family registry (MUTATION_FAMILIES)
  7. Scenario expansion (Group 2)
  8. Manifest emission
  9. Main (Group 1 hardcoded + Group 2 via registry)

Groups:
  Group 1 (git-history scenarios): separate commits per scenario, testing lsync's
    commit-based detection. Hardcoded to the indexed-job page.
  Group 2 (structural scenarios): all files in one commit per page; only the
    content-based detector can detect drift. Uses the mutation family registry
    for all pages uniformly.

Mutation families are the primary abstraction for Group 2. Each family defines
reusable applicability logic and a pure content transform. Maturity/limitation
notes are stored on families instead of being modeled as formal subgroups.
The suite uses only one formal grouping for all Group 2 scenarios.

Usage:
    python generate_repo.py \\
      --base-en REPO/content/en/docs/tasks/job/indexed-parallel-processing-static.md \\
      --base-l10n REPO/content/ko/docs/tasks/job/indexed-parallel-processing-static.md \\
      [--lang ko] \\
      [--output-dir /tmp/k8s-l10n-test-repo] \\
      [--extra-page page_id:en_path:ko_path ...] \\
      [--update-manifest]

    --extra-page can be repeated. Each value is: page_id:en_path:ko_path
    --update-manifest rewrites scenarios.json for all pages.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass, field


# ---------------------------------------------------------------------------
# Git + file helpers
# ---------------------------------------------------------------------------

def git(args, cwd):
    subprocess.run(["git"] + args, cwd=cwd, check=True, capture_output=True)


def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write(path, text):
    d = os.path.dirname(path)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def cp(src, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)


def replace(path, find, repl):
    write(path, read(path).replace(find, repl, 1))


def insert_before(path, find, insert):
    write(path, read(path).replace(find, insert + find, 1))


def delete_block(path, start, end):
    """Delete all lines from the line containing start to the line containing end (inclusive)."""
    lines, inside = [], False
    for line in read(path).split("\n"):
        if start in line:
            inside = True
        if not inside:
            lines.append(line)
        if inside and end in line:
            inside = False
    write(path, "\n".join(lines))


def delete_line(path, pattern):
    write(path, "\n".join(l for l in read(path).split("\n") if pattern not in l))


def file_append(path, content):
    with open(path, "a", encoding="utf-8") as f:
        f.write(content)


# ---------------------------------------------------------------------------
# Section 1: Data structures
# ---------------------------------------------------------------------------

@dataclass
class MutationResult:
    """Output of a mutation transform: possibly modified line lists and applied flag."""
    en_lines: list
    ko_lines: list
    applied: bool


@dataclass
class MutationFamily:
    """
    A named family of content mutations for Group 2 scenario generation.

    Each family captures:
      - transform: pure function (en_lines, ko_lines, en_fm, ko_fm) -> MutationResult
      - applicability: inspect_page capability key required, or None (always applicable)
      - ground_truth / expected_candidate: default expectations for all scenarios
      - notes: maturity/limitation descriptions (informational, not formal subgroups)

    The suite keeps only one formal grouping (group2_structural) for all Group 2 families.
    Notes explain differences in detector maturity instead of creating extra scoring buckets.
    """
    name: str
    group: str
    target: str
    ground_truth: str
    expected_candidate: list
    applicability: object   # str key into inspect_page() dict, or None
    transform: object       # Callable: (en_lines, ko_lines, en_fm, ko_fm) -> MutationResult
    notes: list = field(default_factory=list)


@dataclass
class PageFixture:
    """A real page pair used as the base for Group 2 scenario generation."""
    page_id: str
    en_src: str         # absolute path to EN source
    ko_src: str         # absolute path to KO source
    name_prefix: str    # '' for indexed-job; 'page_id__' for extra pages
    info: dict          # result of inspect_page(en_src, ko_src)


# ---------------------------------------------------------------------------
# Section 2: Generic markdown parsers
# ---------------------------------------------------------------------------

def _frontmatter_end(lines):
    """Return the index of the first line after the closing --- of frontmatter."""
    if not lines or lines[0].strip() != "---":
        return 0
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return i + 1
    return 0


def _find_content_paragraphs(lines, fm):
    """
    Return list of (start, end) for content paragraphs (exclusive end).
    Skips headings, code fences, shortcode lines, HTML comments, and table rows.
    """
    paras, in_code, para_start = [], False, None
    for i in range(fm, len(lines)):
        line = lines[i]
        stripped = line.strip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_code = not in_code
            if para_start is not None:
                paras.append((para_start, i))
                para_start = None
            continue
        if in_code:
            continue
        if not stripped:
            if para_start is not None:
                paras.append((para_start, i))
                para_start = None
            continue
        if (stripped.startswith("#") or stripped.startswith("{{")
                or stripped.startswith("{%") or stripped.startswith("<!--")
                or stripped.startswith("|") or stripped.startswith(">")):
            if para_start is not None:
                paras.append((para_start, i))
                para_start = None
            continue
        if para_start is None:
            para_start = i
    if para_start is not None:
        paras.append((para_start, len(lines)))
    return paras


def _find_code_blocks(lines, fm):
    """Return list of (start, end) for fenced code blocks (end is line after closing fence)."""
    blocks, start = [], None
    for i in range(fm, len(lines)):
        stripped = lines[i].strip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            if start is None:
                start = i
            else:
                blocks.append((start, i + 1))
                start = None
    return blocks


def _find_headings(lines, fm, level=2):
    """Return list of (idx, line) for level-N headings that are not shortcode wrappers."""
    prefix = "#" * level + " "
    return [
        (i, lines[i]) for i in range(fm, len(lines))
        if lines[i].startswith(prefix) and "{{" not in lines[i] and "{%" not in lines[i]
    ]


def _find_list_items(lines, fm):
    """Return list of (idx, line) for bullet/numbered list items outside code fences."""
    result, in_code = [], False
    for i in range(fm, len(lines)):
        if lines[i].strip().startswith("```") or lines[i].strip().startswith("~~~"):
            in_code = not in_code
            continue
        if in_code:
            continue
        if re.match(r"^(\s{0,3})([-*+]|\d+\.)\s", lines[i]):
            result.append((i, lines[i]))
    return result


# ---------------------------------------------------------------------------
# Section 3: Generic mutation functions
# Each takes a list of lines + frontmatter-end index and returns (new_lines, applied).
# These are pure transforms: no file I/O, no scoring policy.
# ---------------------------------------------------------------------------

def _last_content_line(lines, start, end):
    idx = end - 1
    while idx >= start and not lines[idx].strip():
        idx -= 1
    return idx


def gm_extend_paragraph(lines, fm, extension, n=0):
    """Append extension to the last line of the nth content paragraph."""
    paras = _find_content_paragraphs(lines, fm)
    if not paras:
        return lines, False
    n = min(n, len(paras) - 1)
    start, end = paras[n]
    idx = _last_content_line(lines, start, end)
    lines = list(lines)
    lines[idx] = lines[idx].rstrip() + extension
    return lines, True


def gm_insert_sentence(lines, fm, sentence, n=1):
    """Insert a new sentence line after the last line of the nth content paragraph."""
    paras = _find_content_paragraphs(lines, fm)
    if not paras:
        return lines, False
    n = min(n, len(paras) - 1)
    start, end = paras[n]
    idx = _last_content_line(lines, start, end)
    lines = list(lines)
    lines.insert(idx + 1, sentence)
    return lines, True


def gm_delete_paragraph(lines, fm, n=1):
    """Delete the nth content paragraph (0-indexed)."""
    paras = _find_content_paragraphs(lines, fm)
    if len(paras) <= n:
        return lines, False
    start, end = paras[n]
    rest = lines[end:]
    if rest and not rest[0].strip():
        rest = rest[1:]
    return lines[:start] + rest, True


def gm_reorder_paragraphs(lines, fm):
    """Swap the first two content paragraphs."""
    paras = _find_content_paragraphs(lines, fm)
    if len(paras) < 2:
        return lines, False
    s1, e1 = paras[0]
    s2, e2 = paras[1]
    block1, gap, block2 = lines[s1:e1], lines[e1:s2], lines[s2:e2]
    return lines[:s1] + block2 + gap + block1 + lines[e2:], True


def gm_delete_code_block(lines, fm, n=0):
    """Delete the nth fenced code block."""
    blocks = _find_code_blocks(lines, fm)
    if len(blocks) <= n:
        return lines, False
    start, end = blocks[n]
    before = lines[:start]
    while before and not before[-1].strip():
        before.pop()
    before.append("")
    rest = lines[end:]
    if rest and not rest[0].strip():
        rest = rest[1:]
    return before + rest, True


def gm_rename_heading(lines, fm, n=0):
    """Append ' (Updated)' to the nth ## heading."""
    headings = _find_headings(lines, fm, level=2)
    if len(headings) <= n:
        return lines, False
    idx, line = headings[n]
    lines = list(lines)
    lines[idx] = line.rstrip() + " (Updated)"
    return lines, True


def gm_add_list_item(lines, fm):
    """Append a new item to the first list."""
    items = _find_list_items(lines, fm)
    if not items:
        return lines, False
    last_idx = items[0][0]
    for i in range(1, len(items)):
        if items[i][0] <= last_idx + 3:
            last_idx = items[i][0]
        else:
            break
    m = re.match(r"^(\s{0,3})([-*+]|\d+\.)\s", lines[last_idx])
    if not m:
        return lines, False
    indent, bullet = m.group(1), m.group(2)
    if re.match(r"\d+", bullet):
        new_item = f"{indent}{int(bullet[:-1]) + 1}. Verify the operation completed successfully."
    else:
        new_item = f"{indent}{bullet} Verify the operation completed successfully."
    lines = list(lines)
    lines.insert(last_idx + 1, new_item)
    return lines, True


def gm_remove_list_item(lines, fm, n=0):
    """Remove the nth list item."""
    items = _find_list_items(lines, fm)
    if not items:
        return lines, False
    lines = list(lines)
    del lines[items[min(n, len(items) - 1)][0]]
    return lines, True


def gm_change_kubectl_apply(lines, fm):
    """Replace first 'kubectl apply' in a code block with 'kubectl create'."""
    in_code = False
    for i in range(fm, len(lines)):
        if lines[i].strip().startswith("```") or lines[i].strip().startswith("~~~"):
            in_code = not in_code
            continue
        if in_code and "kubectl apply" in lines[i]:
            lines = list(lines)
            lines[i] = lines[i].replace("kubectl apply", "kubectl create", 1)
            return lines, True
    return lines, False


def gm_add_namespace_flag(lines, fm):
    """Append --namespace=default to the first kubectl command in a code block."""
    in_code = False
    for i in range(fm, len(lines)):
        if lines[i].strip().startswith("```") or lines[i].strip().startswith("~~~"):
            in_code = not in_code
            continue
        if in_code and re.search(r"kubectl \w", lines[i]) and "--namespace" not in lines[i]:
            lines = list(lines)
            lines[i] = lines[i].rstrip() + " --namespace=default"
            return lines, True
    return lines, False


def gm_rename_shortcode(lines, fm):
    """Rename the first occurrence of a known shortcode alias."""
    swaps = [
        ("{{% code_sample", "{{% codenew"),
        ("{{< code_sample", "{{< codenew"),
        ("{{< include",     "{{< import"),
        ("{{% include",     "{{% import"),
    ]
    for i in range(fm, len(lines)):
        for old, new in swaps:
            if old in lines[i]:
                lines = list(lines)
                lines[i] = lines[i].replace(old, new, 1)
                return lines, True
    return lines, False


# ---------------------------------------------------------------------------
# Section 4: Page introspection / capability discovery
# ---------------------------------------------------------------------------

def _all_headings_in_order(lines, fm):
    """Return all ## / ### / #### headings in document order, skipping shortcode headings."""
    result, in_code = [], False
    for i in range(fm, len(lines)):
        stripped = lines[i].strip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_code = not in_code
            continue
        if in_code:
            continue
        if (re.match(r"^#{2,4} ", lines[i])
                and "{{" not in lines[i] and "{%" not in lines[i]):
            result.append(lines[i].rstrip())
    return result


def inspect_page(en_path, ko_path):
    """
    Compute structural capabilities of a page pair.
    Used to determine which mutation families are applicable.
    """
    en_lines = read(en_path).split("\n")
    ko_lines = read(ko_path).split("\n")
    en_fm = _frontmatter_end(en_lines)
    ko_fm = _frontmatter_end(ko_lines)
    return {
        "has_en_paragraphs":    len(_find_content_paragraphs(en_lines, en_fm)) >= 2,
        "has_ko_paragraphs":    len(_find_content_paragraphs(ko_lines, ko_fm)) >= 2,
        "has_en_code_blocks":   len(_find_code_blocks(en_lines, en_fm)) > 0,
        "has_ko_code_blocks":   len(_find_code_blocks(ko_lines, ko_fm)) > 0,
        "has_en_headings":      len(_find_headings(en_lines, en_fm)) > 0,
        "has_en_list_items":    len(_find_list_items(en_lines, en_fm)) > 0,
        "has_ko_list_items":    len(_find_list_items(ko_lines, ko_fm)) > 0,
        "has_kubectl_apply":    any("kubectl apply" in l for l in en_lines),
        "has_kubectl_command":  any(re.search(r"kubectl \w", l) for l in en_lines),
        "has_shortcode":        any(s in l for l in en_lines
                                    for s in ("{{% code_sample", "{{< code_sample",
                                               "{{< include", "{{% include")),
    }


# ---------------------------------------------------------------------------
# Section 5: Mutation family transforms
# Each _tf_* function is a pure content transform:
#   (en_lines, ko_lines, en_fm, ko_fm) -> MutationResult
# No file I/O or scoring policy here.
# ---------------------------------------------------------------------------

def _tf_baseline(en, ko, en_fm, ko_fm):
    return MutationResult(en, ko, True)


def _tf_paragraph_reflow(en, ko, en_fm, ko_fm):
    ko, applied = gm_extend_paragraph(
        ko, ko_fm, " 이 내용은 독자들의 이해를 돕기 위한 추가 설명입니다.")
    return MutationResult(en, ko, applied)


def _tf_shortcode_only_change(en, ko, en_fm, ko_fm):
    en, applied = gm_rename_shortcode(en, en_fm)
    return MutationResult(en, ko, applied)


def _tf_missing_paragraph(en, ko, en_fm, ko_fm):
    ko, applied = gm_delete_paragraph(ko, ko_fm, n=1)
    return MutationResult(en, ko, applied)


def _tf_paragraph_reorder(en, ko, en_fm, ko_fm):
    ko, applied = gm_reorder_paragraphs(ko, ko_fm)
    return MutationResult(en, ko, applied)


def _tf_missing_code_block(en, ko, en_fm, ko_fm):
    ko, applied = gm_delete_code_block(ko, ko_fm, n=0)
    return MutationResult(en, ko, applied)


def _tf_paragraph_extended(en, ko, en_fm, ko_fm):
    en, applied = gm_extend_paragraph(
        en, en_fm,
        " Note that this behavior may change in future versions of Kubernetes.")
    return MutationResult(en, ko, applied)


def _tf_paragraph_rewritten(en, ko, en_fm, ko_fm):
    en, applied = gm_insert_sentence(
        en, en_fm,
        "This represents updated behavior from previous Kubernetes versions.",
        n=1)
    return MutationResult(en, ko, applied)


def _tf_heading_rename(en, ko, en_fm, ko_fm):
    en, applied = gm_rename_heading(en, en_fm, n=0)
    return MutationResult(en, ko, applied)


def _tf_list_item_added(en, ko, en_fm, ko_fm):
    en, applied = gm_add_list_item(en, en_fm)
    return MutationResult(en, ko, applied)


def _tf_list_item_removed(en, ko, en_fm, ko_fm):
    ko, applied = gm_remove_list_item(ko, ko_fm, n=0)
    return MutationResult(en, ko, applied)


def _tf_code_command_changed(en, ko, en_fm, ko_fm):
    en, applied = gm_change_kubectl_apply(en, en_fm)
    return MutationResult(en, ko, applied)


def _tf_code_parameters_changed(en, ko, en_fm, ko_fm):
    en, applied = gm_add_namespace_flag(en, en_fm)
    return MutationResult(en, ko, applied)


def _tf_combined_drift(en, ko, en_fm, ko_fm):
    en, ok1 = gm_extend_paragraph(
        en, en_fm,
        " Note that this behavior may change in future versions of Kubernetes.")
    en, ok2 = gm_rename_heading(en, en_fm, n=0)
    en, ok3 = gm_add_list_item(en, en_fm)
    return MutationResult(en, ko, ok1 or ok2 or ok3)


# ---------------------------------------------------------------------------
# Section 6: Mutation family registry
#
# This is the source of truth for Group 2 scenario generation.
# Each family's applicability key must match a key returned by inspect_page().
# Families with applicability=None are attempted for every page.
#
# Notes explain detector maturity/limitations instead of formal subgrouping.
# All families share the same group label (group2_structural).
# ---------------------------------------------------------------------------

MUTATION_FAMILIES = [
    MutationFamily(
        name="baseline_unmodified",
        group="group2_structural",
        target="none",
        ground_truth="not_outdated",
        expected_candidate=["up_to_date"],
        applicability=None,
        transform=_tf_baseline,
        notes=["control case: no mutations applied; both detectors should agree up_to_date"],
    ),
    MutationFamily(
        name="paragraph_reflow",
        group="group2_structural",
        target="paragraph_structure",
        ground_truth="not_outdated",
        expected_candidate=["up_to_date", "outdated_low_severity"],
        applicability="has_ko_paragraphs",
        transform=_tf_paragraph_reflow,
        notes=["KO-side reflow only; expected to be tolerated as up_to_date or outdated_low_severity"],
    ),
    MutationFamily(
        name="shortcode_only_change",
        group="group2_structural",
        target="shortcode",
        ground_truth="not_outdated",
        expected_candidate=["up_to_date"],
        applicability="has_shortcode",
        transform=_tf_shortcode_only_change,
        notes=["cosmetic EN shortcode alias rename; content-based detector should ignore it"],
    ),
    MutationFamily(
        name="missing_paragraph",
        group="group2_structural",
        target="paragraph_structure",
        ground_truth="outdated",
        expected_candidate=["candidate_outdated"],
        applicability="has_ko_paragraphs",
        transform=_tf_missing_paragraph,
        notes=["expected to be reliably detectable with current structural comparison"],
    ),
    MutationFamily(
        name="paragraph_reorder",
        group="group2_structural",
        target="paragraph_structure",
        ground_truth="not_outdated",
        expected_candidate=["up_to_date", "outdated_low_severity"],
        applicability="has_ko_paragraphs",
        transform=_tf_paragraph_reorder,
        notes=[
            "same content at different paragraph positions in KO",
            "currently limited by block alignment",
        ],
    ),
    MutationFamily(
        name="missing_code_block",
        group="group2_structural",
        target="code_block",
        ground_truth="outdated",
        expected_candidate=["candidate_outdated", "outdated_low_severity"],
        applicability="has_ko_code_blocks",
        transform=_tf_missing_code_block,
        notes=[
            "KO code block deleted",
            "currently limited by block alignment; outdated_low_severity also acceptable",
        ],
    ),
    MutationFamily(
        name="paragraph_extended_in_english",
        group="group2_structural",
        target="paragraph_content",
        ground_truth="outdated",
        expected_candidate=["candidate_outdated"],
        applicability="has_en_paragraphs",
        transform=_tf_paragraph_extended,
        notes=["expected to be reliably detectable with current structural comparison"],
    ),
    MutationFamily(
        name="paragraph_rewritten_in_english",
        group="group2_structural",
        target="paragraph_content",
        ground_truth="outdated",
        expected_candidate=["candidate_outdated", "outdated_low_severity"],
        applicability="has_en_paragraphs",
        transform=_tf_paragraph_rewritten,
        notes=[
            "EN paragraph semantically rewritten at similar length",
            "currently limited by intra-block comparison",
            "useful as a capability probe",
        ],
    ),
    MutationFamily(
        name="heading_rename",
        group="group2_structural",
        target="heading",
        ground_truth="outdated",
        expected_candidate=["outdated_low_severity"],
        applicability="has_en_headings",
        transform=_tf_heading_rename,
        notes=["expected to be reliably detectable with current structural comparison"],
    ),
    MutationFamily(
        name="list_item_added_in_english",
        group="group2_structural",
        target="list",
        ground_truth="outdated",
        expected_candidate=["candidate_outdated"],
        applicability="has_en_list_items",
        transform=_tf_list_item_added,
        notes=["expected to be reliably detectable with current structural comparison"],
    ),
    MutationFamily(
        name="list_item_removed_translation",
        group="group2_structural",
        target="list",
        ground_truth="outdated",
        expected_candidate=["candidate_outdated"],
        applicability="has_ko_list_items",
        transform=_tf_list_item_removed,
        notes=["expected to be reliably detectable with current structural comparison"],
    ),
    MutationFamily(
        name="code_command_changed",
        group="group2_structural",
        target="code_block",
        ground_truth="outdated",
        expected_candidate=["candidate_outdated"],
        applicability="has_kubectl_apply",
        transform=_tf_code_command_changed,
        notes=[
            "kubectl apply → kubectl create in EN code block",
            "currently limited by intra-block comparison",
            "useful as a capability probe",
        ],
    ),
    MutationFamily(
        name="code_parameters_changed",
        group="group2_structural",
        target="code_block",
        ground_truth="outdated",
        expected_candidate=["candidate_outdated"],
        applicability="has_kubectl_command",
        transform=_tf_code_parameters_changed,
        notes=[
            "kubectl command gains --namespace=default flag in EN code block",
            "currently limited by intra-block comparison",
            "useful as a capability probe",
        ],
    ),
    MutationFamily(
        name="combined_drift",
        group="group2_structural",
        target="combined",
        ground_truth="outdated",
        expected_candidate=["candidate_outdated"],
        applicability=None,
        transform=_tf_combined_drift,
        notes=["stress test: paragraph extension + heading rename + list item addition"],
    ),
]


# ---------------------------------------------------------------------------
# Section 7: Scenario expansion (Group 2)
# ---------------------------------------------------------------------------

def expand_group2_scenarios(fixture, en_fn, ko_fn):
    """
    Apply all applicable mutation families to a PageFixture, materialize
    files in the test repo, and return (entries, paths).

    entries: thin manifest entry dicts {id, group, page_id, family}
    paths:   list of all materialized file paths (for git add)

    Each entry contains only {id, group, page_id, family}. The ground_truth
    and expected_candidate are inherited at runtime from the manifest's
    mutation_families block, keeping scenarios minimal and defaults centralized.
    """
    entries = []
    paths = []
    applicable = [f for f in MUTATION_FAMILIES
                  if f.applicability is None or fixture.info.get(f.applicability)]
    print(f"    applicable families: {[f.name for f in applicable]}")

    for family in applicable:
        scenario_id = fixture.name_prefix + family.name

        cp(fixture.en_src, en_fn(scenario_id))
        cp(fixture.ko_src, ko_fn(scenario_id))

        en_lines = read(en_fn(scenario_id)).split("\n")
        ko_lines = read(ko_fn(scenario_id)).split("\n")
        en_fm = _frontmatter_end(en_lines)
        ko_fm = _frontmatter_end(ko_lines)

        result = family.transform(en_lines, ko_lines, en_fm, ko_fm)

        if not result.applied:
            os.remove(en_fn(scenario_id))
            os.remove(ko_fn(scenario_id))
            print(f"    [SKIP] {scenario_id}")
            continue

        # Only write files that were actually mutated to preserve original line endings
        if result.en_lines is not en_lines:
            write(en_fn(scenario_id), "\n".join(result.en_lines))
        if result.ko_lines is not ko_lines:
            write(ko_fn(scenario_id), "\n".join(result.ko_lines))

        paths.extend([en_fn(scenario_id), ko_fn(scenario_id)])
        entries.append({
            "id":      scenario_id,
            "group":   "group2_structural",
            "page_id": fixture.page_id,
            "family":  family.name,
        })
        print(f"    [OK]   {scenario_id}")

    return entries, paths


# ---------------------------------------------------------------------------
# Section 8: Manifest emission
# ---------------------------------------------------------------------------

# Group 1 scenarios are static: they are tied to the indexed-job page and
# cannot be generated by the mutation family registry.
GROUP1_SCENARIOS = [
    {
        "id":                "fp_formatting",
        "group":             "group1_git_history",
        "description":       "False positive: emphasis style swap",
        "ground_truth":      "not_outdated",
        "expected_baseline": ["candidate_outdated"],
        "expected_candidate":["up_to_date"],
    },
    {
        "id":                "fp_links",
        "group":             "group1_git_history",
        "description":       "False positive: relative link canonicalized to absolute URL",
        "ground_truth":      "not_outdated",
        "expected_baseline": ["candidate_outdated"],
        "expected_candidate":["up_to_date"],
    },
    {
        "id":                "fp_shortcodes",
        "group":             "group1_git_history",
        "description":       "False positive: shortcode delimiter swap",
        "ground_truth":      "not_outdated",
        "expected_baseline": ["candidate_outdated"],
        "expected_candidate":["up_to_date"],
    },
    {
        "id":                "fn_false_sync",
        "group":             "group1_git_history",
        "description":       "False negative: cosmetic KO edit masks meaningful EN addition",
        "ground_truth":      "outdated",
        "expected_baseline": ["up_to_date"],
        "expected_candidate":["candidate_outdated"],
    },
    {
        "id":                "tp_normal_change",
        "group":             "group1_git_history",
        "description":       "True positive: new EN section appended",
        "ground_truth":      "outdated",
        "expected_baseline": ["candidate_outdated"],
        "expected_candidate":["candidate_outdated"],
    },
]

def emit_manifest(manifest_path, fixtures, group2_entries):
    """
    Write scenarios.json with mutation_families (ground truth defaults) and scenarios.

    Group 2 scenarios are thin: each scenario references its family for ground_truth
    and expected_candidate defaults, reducing repetition.
    """
    mutation_families = {}
    for fam in MUTATION_FAMILIES:
        mutation_families[fam.name] = {
            "ground_truth":       fam.ground_truth,
            "expected_candidate": fam.expected_candidate,
        }

    manifest = {
        "mutation_families": mutation_families,
        "scenarios": GROUP1_SCENARIOS + group2_entries,
    }
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"\nManifest updated: {manifest_path}")
    print(f"  {len(GROUP1_SCENARIOS)} Group 1 + {len(group2_entries)} Group 2 scenarios")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Generate content-drift detection benchmark test repository."
    )
    parser.add_argument("--base-en",    required=True, metavar="PATH",
                        help="Path to English source file (indexed job page).")
    parser.add_argument("--base-l10n",  required=True, metavar="PATH",
                        help="Path to localized source file (indexed job page).")
    parser.add_argument("--lang",       default="ko",
                        help="Language code (default: ko).")
    parser.add_argument("--output-dir", default="/tmp/k8s-l10n-test-repo", metavar="PATH",
                        help="Output directory for the test repository.")
    parser.add_argument("--extra-page", action="append", metavar="ID:EN_PATH:KO_PATH",
                        help="Additional page pair (repeatable). Format: page_id:en_path:ko_path")
    parser.add_argument("--update-manifest", action="store_true",
                        help="Rewrite scenarios.json with entries for all pages.")
    args = parser.parse_args()

    en_src = os.path.abspath(args.base_en)
    ko_src = os.path.abspath(args.base_l10n)
    out    = os.path.abspath(args.output_dir)
    lang   = args.lang

    for f in [en_src, ko_src]:
        if not os.path.isfile(f):
            print(f"Error: file not found: {f}", file=sys.stderr)
            sys.exit(1)

    # Parse extra pages
    extra_pages = []
    for spec in (args.extra_page or []):
        parts = spec.split(":", 2)
        if len(parts) != 3:
            print(f"Error: --extra-page must be ID:EN_PATH:KO_PATH, got: {spec}", file=sys.stderr)
            sys.exit(1)
        page_id, ep_en, ep_ko = parts[0], os.path.abspath(parts[1]), os.path.abspath(parts[2])
        for f in [ep_en, ep_ko]:
            if not os.path.isfile(f):
                print(f"Error: file not found: {f}", file=sys.stderr)
                sys.exit(1)
        extra_pages.append((page_id, ep_en, ep_ko))

    if os.path.exists(out):
        shutil.rmtree(out)
    os.makedirs(out)

    git(["init"], out)
    git(["config", "user.name", "L10n Test Bot"], out)
    git(["config", "user.email", "test@example.com"], out)

    # Path helpers inside the repo
    def en(name): return os.path.join(out, "content/en/docs/tasks/job", f"{name}.md")
    def ko(name): return os.path.join(out, f"content/{lang}/docs/tasks/job", f"{name}.md")

    def init(name):
        """Copy base files and commit as the initial state (T0)."""
        cp(en_src, en(name))
        cp(ko_src, ko(name))
        git(["add", en(name), ko(name)], out)
        git(["commit", "-m", f"Initialize {name}"], out)
        time.sleep(1)  # ensure timestamp delta for lsync detection

    print(f"Building test repo at {out}")

    # ======================================================================
    # GROUP 1: Separate-commit scenarios (git-history scenarios 1-5)
    # Pattern: T0 = base commit, T1+ = EN mutation commit(s)
    # Tests lsync's commit-timestamp-based detection against the content-based
    # detector. Hardcoded to the indexed-job page with page-specific mutations.
    # ======================================================================

    # Scenario 1: fp_formatting
    # Cosmetic EN change: emphasis style swap (_x_ → *x*)
    # lsync: candidate_outdated (false positive)  |  content-based: up_to_date (correct)
    print("  Scenario 1: fp_formatting")
    init("fp_formatting")
    replace(en("fp_formatting"), "_index number_", "*index number*")
    git(["add", en("fp_formatting")], out)
    git(["commit", "-m", "fp_formatting: cosmetic emphasis swap"], out)

    # Scenario 2: fp_links
    # Cosmetic EN change: relative link canonicalized to absolute URL
    # lsync: candidate_outdated (false positive)  |  content-based: up_to_date (correct)
    print("  Scenario 2: fp_links")
    init("fp_links")
    replace(en("fp_links"),
        "[downward API](/docs/concepts/workloads/pods/downward-api/)",
        "[downward API](https://kubernetes.io/docs/concepts/workloads/pods/downward-api/)")
    git(["add", en("fp_links")], out)
    git(["commit", "-m", "fp_links: canonicalize relative link to absolute URL"], out)

    # Scenario 3: fp_shortcodes
    # Cosmetic EN change: shortcode delimiter swap ({{< >}} → {{% %}})
    # lsync: candidate_outdated (false positive)  |  content-based: up_to_date (correct)
    print("  Scenario 3: fp_shortcodes")
    init("fp_shortcodes")
    replace(en("fp_shortcodes"),
        '{{< include "task-tutorial-prereqs.md" >}}',
        '{{% include "task-tutorial-prereqs.md" %}}')
    git(["add", en("fp_shortcodes")], out)
    git(["commit", "-m", "fp_shortcodes: swap shortcode delimiter style"], out)

    # Scenario 4: fn_false_sync
    # T1: meaningful EN addition (deprecation warning paragraph)
    # T2: cosmetic KO edit advances lsync's sync point, masking T1
    # lsync: up_to_date (false negative)  |  content-based: candidate_outdated (correct)
    print("  Scenario 4: fn_false_sync")
    init("fn_false_sync")
    insert_before(en("fn_false_sync"),
        "Here is an overview of the steps in this example:",
        "\n**Warning: Multi-level parallel jobs will be deprecated in v1.35 due to redundancy.**\n\n")
    git(["add", en("fn_false_sync")], out)
    git(["commit", "-m", "fn_false_sync (T1): add deprecation warning paragraph"], out)
    time.sleep(1)
    replace(ko("fn_false_sync"), "이 예제에서는, 여러 병렬", "이 예제에서는 여러 병렬")
    git(["add", ko("fn_false_sync")], out)
    git(["commit", "-m", "fn_false_sync (T2): cosmetic KO punctuation fix (masks T1)"], out)

    # Scenario 5: tp_normal_change
    # Meaningful EN change: new section appended
    # lsync: candidate_outdated (correct)  |  content-based: candidate_outdated (correct)
    print("  Scenario 5: tp_normal_change")
    init("tp_normal_change")
    file_append(en("tp_normal_change"),
        "\n\n## New Configuration Requirements\n"
        "You must now enable the alpha feature gate to use this feature with external workloads.\n")
    git(["add", en("tp_normal_change")], out)
    git(["commit", "-m", "tp_normal_change: add new requirements section"], out)

    # ======================================================================
    # GROUP 2: Single-commit scenarios (structural scenarios)
    # Pattern: all EN + KO files staged and committed together (one commit per page).
    # lsync sees no EN delta since KO was committed → reports up_to_date for all.
    # Only the content-based detector can catch genuine drift here.
    # Uses the mutation family registry uniformly for all pages.
    # ======================================================================

    print("  Group 2: building structural scenarios via mutation family registry")

    ij_info = inspect_page(en_src, ko_src)
    ij_fixture = PageFixture(
        page_id="indexed-job",
        en_src=en_src,
        ko_src=ko_src,
        name_prefix="",
        info=ij_info,
    )

    all_fixtures = [ij_fixture]
    for page_id, ep_en, ep_ko in extra_pages:
        info = inspect_page(ep_en, ep_ko)
        all_fixtures.append(PageFixture(
            page_id=page_id,
            en_src=ep_en,
            ko_src=ep_ko,
            name_prefix=f"{page_id}__",
            info=info,
        ))

    all_g2_entries = []

    # All Group 2 files land in the same repo directory structure regardless of page.
    # The scenario_id already has the page prefix for extra pages (e.g. "redis-tutorial__...").
    for fixture in all_fixtures:
        print(f"  Page: {fixture.page_id}")
        entries, page_paths = expand_group2_scenarios(fixture, en, ko)
        if page_paths:
            git(["add"] + page_paths, out)
            git(["commit", "-m", f"Group 2 scenarios: {fixture.page_id}"], out)
        all_g2_entries.extend(entries)
        print(f"    {len(entries)} scenarios generated")

    # Optionally update scenarios.json
    if args.update_manifest:
        manifest_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scenarios.json")
        emit_manifest(manifest_path, all_fixtures, all_g2_entries)

    print(f"\nTest repository ready at: {out}")


if __name__ == "__main__":
    main()
