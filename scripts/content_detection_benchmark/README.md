# Content Drift Detection Benchmark

## Overview

This benchmark provides a standardized way to measure and compare outdated-content
detectors for Kubernetes documentation translations.

Given any two detectors — a baseline and a candidate — it runs both against a
controlled set of 47 deterministic scenarios derived from three real EN/KO page
pairs, scores each detector's outputs against ground-truth labels, and writes a
structured report. The goal is to make it easy to experiment with new approaches
and see concretely where they improve or regress relative to a baseline.

All detectors must follow the standardized detector contract:
- **Input:** `<en_doc_path> <l10n_doc_path>`
- **Output:** JSON with a `"status"` field set to one of:
  `up_to_date`, `candidate_outdated`, `outdated_low_severity`,
  `no_english_version`, `not_translated`
- **Example:** `{"status": "candidate_outdated", "signals": [...], "sections": [...]}`

---

## Background

### The problem (Issue [#54896](https://github.com/kubernetes/website/issues/54896))

Kubernetes localization teams often use tools that determine whether a translation
is outdated by comparing commit timestamps or commit ordering. These timestamp-based
signals are cheap to compute but tend to produce two systematic failure modes:

**Failure mode 1 — False positives**

English documentation often changes in ways that do not require translation
updates: formatting adjustments, link canonicalization, shortcode syntax changes.
These edits advance the English file's commit timestamp, causing timestamp-based
tools to flag the translation as outdated even though nothing meaningful changed.

**Failure mode 2 — False negatives (false synchronization points)**

A more serious failure occurs when a small localized edit is committed after a
meaningful English update. Because such tools look for English commits *newer
than the latest Korean commit*, they conclude the translation is current — even
though the meaningful English change was never translated.

Example:
1. English documentation is updated with a deprecation warning.
2. The Korean translation is now silently out of date.
3. A contributor later fixes a typo in the Korean file.
4. The tool reports: *still in sync* — the older English update is masked.

### A content-based approach

One alternative is to compare the *current English file* directly against the
*current localized file* by analyzing document structure: headings, paragraphs,
code blocks, lists, and shortcodes.

Because translations typically preserve the structural skeleton of the original
document, meaningful upstream updates generally appear as structural differences
— detectable without cross-language semantic analysis.

This benchmark is designed to evaluate whether such an approach outperforms
commit-history methods on the failure modes described above. Any detector
following the standardized detector contract can be plugged in as the candidate.

---

## Files

```
website/scripts/content_detection_benchmark/
  generate_repo.py    — build the deterministic test git repository
  scenarios.json      — ground-truth scenarios (47 scenarios, 14 families, 3 pages)
  run_eval.py         — run detectors, validate outputs against contract, score, write report.md
  README.md           — this file

  (generated, not committed)
  report.md           — evaluation report written by run_eval.py
```

Detector scripts are passed at runtime via `--baseline` and `--candidate` and
can live anywhere. Each must follow the standardized detector contract described
in the Overview above.

---

## How the benchmark works

### Step 1 — Generate the test repository

`generate_repo.py` creates a deterministic git repository at
`/tmp/k8s-l10n-test-repo` containing 47 controlled scenarios, committed in the
exact pattern each detector expects.

**Group 1 scenarios** use multi-commit histories. The indexed-job page is
initialized, then an English mutation is committed on top. A timestamp-based
detector fires based on the commit delta; a content-based detector fires based on
structural content differences.

**Group 2 scenarios** are committed in a single snapshot (all EN + KO files
together). A timestamp-based detector sees no history delta and returns
*up_to_date* for all of them. Only a content-aware detector can detect genuine
drift in this group.

### Step 2 — Run the evaluation

`run_eval.py` loads `scenarios.json`, runs both detectors against every scenario,
validates their outputs against the standardized detector contract, resolves
pass/fail against the manifest's expected labels, computes precision/recall/F1,
and writes `report.md`.

### The canonical label set

All detectors must follow the standardized detector contract
and return one of these status values:

| Label | Meaning |
|---|---|
| `up_to_date` | Translation is current; no action needed |
| `candidate_outdated` | Translation likely needs updating |
| `outdated_low_severity` | Low-severity structural difference detected (shortcode-only drift) |
| `no_english_version` | English source file not found |
| `not_translated` | Localized file not found |
| `error` | Tool execution failure or non-contract output |

`no_english_version`, `not_translated`, and `error` outputs are excluded from all metric calculations.

### Scoring

Both `candidate_outdated` and `outdated_low_severity` count as a **positive
detection**. This reflects the tool's design intent: surface anything that
signals drift, and let a maintainer decide its severity.

---

## Scenarios

The benchmark contains **47 scenarios** drawn from three real Kubernetes
documentation page pairs (EN + KO):

| Page ID | Source file |
|---|---|
| `indexed-job` | `tasks/job/indexed-parallel-processing-static.md` |
| `redis-tutorial` | `tutorials/configuration/configure-redis-using-configmap.md` |
| `configure-liveness` | `tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md` |

### Group 1 — Git-history scenarios (5 scenarios)

These scenarios are designed to expose where commit-timestamp detection produces
false positives and false negatives. All five use the indexed-job page. A
timestamp-based baseline is expected to struggle on 4 of 5; a content-aware
candidate should handle all 5 correctly.

| Scenario | What changes | Ground truth | Expected baseline | Expected candidate |
|---|---|---|---|---|
| `fp_formatting` | Emphasis style swap (`_x_` → `*x*`) in EN | `not_outdated` | `candidate_outdated` (FP) | `up_to_date` |
| `fp_links` | Link canonicalization (relative → absolute URL) in EN | `not_outdated` | `candidate_outdated` (FP) | `up_to_date` |
| `fp_shortcodes` | Shortcode delimiter swap (`{{< >}}` → `{{% %}}`) in EN | `not_outdated` | `candidate_outdated` (FP) | `up_to_date` |
| `fn_false_sync` | Meaningful EN addition, then cosmetic KO commit masks it | `outdated` | `up_to_date` (FN) | `candidate_outdated` |
| `tp_normal_change` | New section appended to EN | `outdated` | `candidate_outdated` | `candidate_outdated` |

### Group 2 — Structural scenarios (42 scenarios, 14 per page)

Each of the three pages gets the same 14 mutation families applied. Because all
files are committed together, a timestamp-based baseline always returns
`up_to_date` — only the candidate is scored in this group.

All families belong to the same formal group (`group2_structural`). Notes on
individual families explain known detector limitations — these are informational,
not separate scoring buckets.

#### Control and cosmetic families

| Family | What changes | Ground truth | Expected candidate | Notes |
|---|---|---|---|---|
| `baseline_unmodified` | Nothing — raw base pair | `not_outdated` | `up_to_date` | Control case |
| `paragraph_reflow` | KO sentence extended with a benign extra clause | `not_outdated` | `up_to_date` or `outdated_low_severity` | KO-side reflow only |
| `shortcode_only_change` | EN shortcode alias renamed (cosmetic) | `not_outdated` | `up_to_date` | Detector should ignore it |
| `paragraph_reorder` | KO paragraphs swapped in position | `not_outdated` | `up_to_date` or `outdated_low_severity` | Currently limited by block alignment |

#### Reliable detection families

These families represent the current reliable capability of structural comparison.

| Family | What changes | Ground truth | Expected candidate |
|---|---|---|---|
| `missing_paragraph` | KO paragraph deleted | `outdated` | `candidate_outdated` |
| `paragraph_extended_in_english` | EN paragraph extended with new meaningful info | `outdated` | `candidate_outdated` |
| `list_item_added_in_english` | New step appended to EN overview list | `outdated` | `candidate_outdated` |
| `list_item_removed_translation` | List item deleted from KO | `outdated` | `candidate_outdated` |
| `heading_rename` | EN section heading renamed | `outdated` | `outdated_low_severity` |
| `combined_drift` | Paragraph extension + heading rename + list item (stress test) | `outdated` | `candidate_outdated` |

#### Capability probe families

These families probe harder detection cases. Known limitations are noted; partial
results are still informative.

| Family | What changes | Ground truth | Expected candidate | Notes |
|---|---|---|---|---|
| `missing_code_block` | KO code block deleted | `outdated` | `candidate_outdated` or `outdated_low_severity` | Currently limited by block alignment |
| `paragraph_rewritten_in_english` | EN paragraph semantically rewritten | `outdated` | `candidate_outdated` or `outdated_low_severity` | Currently limited by intra-block comparison |
| `code_command_changed` | `kubectl apply` → `kubectl create` in EN code block | `outdated` | `candidate_outdated` | Currently limited by intra-block comparison |
| `code_parameters_changed` | `--namespace=default` flag added to EN code block | `outdated` | `candidate_outdated` | Currently limited by intra-block comparison |

---

## How to run

### Prerequisites

- Python 3.9+
- `git` available in PATH
- Two detector scripts (any location; each must follow the standardized detector contract)

### Step 1 — Generate the test repository

```bash
cd website/scripts/content_detection_benchmark

# Minimal (indexed-job page only, 5 Group 1 + 14 Group 2 = 19 scenarios)
python3 generate_repo.py \
  --base-en   ../../content/en/docs/tasks/job/indexed-parallel-processing-static.md \
  --base-l10n ../../content/ko/docs/tasks/job/indexed-parallel-processing-static.md
# Output: /tmp/k8s-l10n-test-repo
```

```bash
# Full benchmark (all 3 pages, 47 scenarios) — also updates scenarios.json
python3 generate_repo.py \
  --base-en   ../../content/en/docs/tasks/job/indexed-parallel-processing-static.md \
  --base-l10n ../../content/ko/docs/tasks/job/indexed-parallel-processing-static.md \
  --extra-page redis-tutorial:\
../../content/en/docs/tutorials/configuration/configure-redis-using-configmap.md:\
../../content/ko/docs/tutorials/configuration/configure-redis-using-configmap.md \
  --extra-page configure-liveness:\
../../content/en/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md:\
../../content/ko/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md \
  --update-manifest
# Output: /tmp/k8s-l10n-test-repo  +  scenarios.json updated in place
```

**Flags:**

| Flag | Description |
|---|---|
| `--base-en PATH` | EN source for the indexed-job page (required) |
| `--base-l10n PATH` | KO source for the indexed-job page (required) |
| `--extra-page ID:EN:KO` | Additional page pair; repeatable |
| `--lang CODE` | Language code (default: `ko`) |
| `--output-dir PATH` | Test repo directory (default: `/tmp/k8s-l10n-test-repo`) |
| `--update-manifest` | Rewrite `scenarios.json` with all generated scenarios |

### Step 2 — Run the evaluation

Detector commands are resolved relative to wherever you invoke `run_eval.py`.
Use absolute paths, or `cd` to the directory containing your detector scripts
before running.

```bash
python3 run_eval.py \
  --repo      /tmp/k8s-l10n-test-repo \
  --baseline  "python3 /path/to/baseline_detector.py" \
  --candidate "python3 /path/to/candidate_detector.py"
# Output: report.md
```

**If your detector does not already follow the standardized contract**, write a
thin adapter script that calls it and converts its output to the required JSON
format, then pass the adapter as the detector command.

**Flags:**

| Flag | Description |
|---|---|
| `--repo PATH` | Path to the generated test repository (required) |
| `--baseline CMD` | Baseline detector command (required) |
| `--candidate CMD` | Candidate detector command (required) |
| `--lang CODE` | Language code (default: `ko`) |
| `--manifest PATH` | Path to scenarios.json (default: same directory as run_eval.py) |
| `--output PATH` | Output report path (default: `report.md`) |

### Reading the report

`report.md` has five sections:

| Section | What it shows |
|---|---|
| **1. Group 1 summary** | Git-history scenarios: baseline vs. candidate, side by side |
| **2. Group 2 summary** | Structural scenarios: candidate labels and pass/fail per scenario |
| **3. By-family summary** | Aggregate metrics per mutation family across all pages |
| **4. By-page summary** | Aggregate metrics per page across all families |
| **5. Interpretation notes** | Prose explanation of what failures mean and how to read the numbers |

**Primary metric:** F1 score on the combined candidate run. Higher is better.

---

## Adding new page pairs

To evaluate detectors on additional real pages, add them as `--extra-page`
arguments and re-run with `--update-manifest`:

```bash
python3 generate_repo.py \
  --base-en   ../../content/en/docs/tasks/job/indexed-parallel-processing-static.md \
  --base-l10n ../../content/ko/docs/tasks/job/indexed-parallel-processing-static.md \
  --extra-page my-page:../../content/en/path/to/my-page.md:../../content/ko/path/to/my-page.md \
  --update-manifest
```

`generate_repo.py` will:
1. Inspect the new page for structural capabilities (paragraphs, code blocks,
   headings, lists, kubectl commands, shortcodes).
2. Apply all applicable mutation families (skipping families whose required
   content element is absent from the page).
3. Commit all scenarios and update `scenarios.json`.

New scenarios inherit their `ground_truth` and `expected_candidate` from the
mutation family definitions in `scenarios.json`. No per-scenario field edits are
needed unless you want page-specific overrides.

---

## Design notes

**Detector contract.** The benchmark enforces a standardized detector contract.
All detectors are expected to conform to it directly — accepting
`<en_doc_path> <l10n_doc_path>` as arguments and returning JSON with a `"status"`
field using one of the five defined values. Any output that does not match the
contract is treated as `error` and excluded from metrics. If an existing tool does
not already follow the contract, write a thin adapter script that invokes it and
converts its output to the required JSON format.

**Group 1 stays hardcoded.** The five git-history scenarios depend on specific
content strings and multi-commit sequences that are tied to the indexed-job page.
They are generated with explicit `replace()` / `insert_before()` calls, not the
mutation family registry. This is intentional: git-history testing requires
controlled commit authorship and cannot be abstracted into a generic transform.

**Mutation families as the primary abstraction.** All Group 2 scenarios are
instances of a named mutation family. Families define the transform logic,
applicability requirements, ground truth, and expected detector outputs in one
place. Scenarios are thin references to their family. This keeps `scenarios.json`
compact and avoids copy-pasting expectations across 42 Group 2 entries.

---

## Relationship to Issue #54896

This benchmark was developed as part of the
[LFX Mentorship project on AI-assisted automation for SIG Docs localization workflows](https://github.com/kubernetes/website/issues/54075).
The two failure modes it targets (false positives from cosmetic EN edits, false
negatives from sync point masking) are the core motivation for
[Issue #54896](https://github.com/kubernetes/website/issues/54896).

The benchmark is an evaluation harness, independent of any specific detector. It
can be run against any detector pair to measure how well a candidate improves on
the known failure cases and harder structural mutations.
