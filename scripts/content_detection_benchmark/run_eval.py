#!/usr/bin/env python3
"""
run_eval.py
Evaluation harness for the content-drift detection benchmark.

Reads scenarios.json, runs detectors against each scenario, validates
outputs against the contract defined by content_based_outdated.py,
resolves expectations from the manifest (family defaults for Group 2,
inline values for Group 1), scores results, aggregates by group/family/page,
and writes report.md.

All detectors must follow the contract defined by content_based_outdated.py:
  Input:  <en_doc_path> <l10n_doc_path>
  Output: JSON with a "status" field using one of these values:
            up_to_date
            candidate_outdated
            outdated_low_severity
            no_english_version
            not_translated
  Example: {"status": "candidate_outdated", "signals": [...], "sections": [...]}

Internal steps:
  1. Load manifest
  2. Run detectors
  3. Validate outputs against contract
  4. Resolve scenario expectations
  5. Score scenarios
  6. Aggregate results
  7. Render report

Usage:
    python run_eval.py \\
      --repo /tmp/k8s-l10n-test-repo \\
      --baseline path/to/baseline.py \\
      --candidate path/to/candidate.py

Output:
    report.md (or path set by --output)
"""

import argparse
import collections
import datetime
import json
import os
import shlex
import subprocess
import sys

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Contract status values from content_based_outdated.py
_CONTRACT_STATUSES = {
    "up_to_date",
    "candidate_outdated",
    "outdated_low_severity",
    "no_english_version",
    "not_translated",
}

# Scoring sets — no_english_version, not_translated, and error are excluded from metrics
POSITIVE = {"candidate_outdated", "outdated_low_severity"}
NEGATIVE = {"up_to_date"}


# ---------------------------------------------------------------------------
# Step 3: Output normalization
# ---------------------------------------------------------------------------

def normalize_output(stdout, exit_code):
    """
    Validate detector JSON output and return the status string.

    Detectors must return JSON with a "status" field whose value is one of
    the contract statuses defined by content_based_outdated.py.
    Any other status or malformed output is returned as "error".
    """
    if exit_code not in (0, 1):
        return "error"
    try:
        data = json.loads(stdout.strip())
        entry = data[0] if isinstance(data, list) else data
        status = entry.get("status", "")
        return status if status in _CONTRACT_STATUSES else "error"
    except (json.JSONDecodeError, IndexError, AttributeError, TypeError):
        return "error"


# ---------------------------------------------------------------------------
# Step 2: Tool execution
# ---------------------------------------------------------------------------

def run_detector(cmd, en_path, l10n_path, repo_dir):
    """
    Run a detector with (en_path, l10n_path) and return a canonical label.

    Paths are made absolute before passing to the detector so that detector
    commands (e.g. "python3 adapter_content_based.py") resolve relative to
    the invocation directory, not the test repository root.

    The detector is invoked as: <cmd> <en_abs_path> <l10n_abs_path>
    It must produce JSON output following the stable detector interface.
    """
    en_abs   = os.path.join(repo_dir, en_path)
    l10n_abs = os.path.join(repo_dir, l10n_path)
    parts = shlex.split(cmd) + [en_abs, l10n_abs]
    try:
        proc = subprocess.run(parts, capture_output=True, text=True, timeout=60)
        stdout, exit_code = proc.stdout, proc.returncode
    except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
        return "error"
    return normalize_output(stdout, exit_code)


# ---------------------------------------------------------------------------
# Step 4: Resolve scenario expectations
# ---------------------------------------------------------------------------

def resolve_expectations(scenario, manifest):
    """
    Return (ground_truth, expected_baseline, expected_candidate) for a scenario.

    For Group 1 scenarios: expectations are read directly from the scenario dict.
    For Group 2 scenarios: ground_truth and expected_candidate are inherited from
    the manifest's mutation_families block, reducing repetition in the scenarios
    list. Scenario-level overrides (ground_truth_override, expected_candidate_override)
    take precedence when present.
    """
    if scenario.get("group") == "group1_git_history":
        return {
            "ground_truth":       scenario["ground_truth"],
            "expected_baseline":  scenario.get("expected_baseline"),
            "expected_candidate": scenario.get("expected_candidate"),
        }
    # Group 2: inherit from family
    family_name = scenario["family"]
    family = manifest["mutation_families"][family_name]
    return {
        "ground_truth":       scenario.get("ground_truth_override", family["ground_truth"]),
        "expected_baseline":  None,   # baseline not applicable to Group 2
        "expected_candidate": scenario.get("expected_candidate_override",
                                           family["expected_candidate"]),
    }


# ---------------------------------------------------------------------------
# Step 5: Scoring
# ---------------------------------------------------------------------------

def classify_binary(label):
    """Classify a label as positive, negative, or None (excluded from metrics)."""
    if label in POSITIVE:
        return "positive"
    if label in NEGATIVE:
        return "negative"
    return None


def score_scenario(ground_truth, label):
    """Return TP/TN/FP/FN, or None to exclude non-scorable statuses from metrics."""
    binary = classify_binary(label)
    if binary is None:
        return None
    positive = (binary == "positive")
    if ground_truth == "outdated":
        return "TP" if positive else "FN"
    return "FP" if positive else "TN"


def compute_metrics(results, label_key):
    scored = [score_scenario(r["ground_truth"], r[label_key]) for r in results]
    tp = scored.count("TP")
    tn = scored.count("TN")
    fp = scored.count("FP")
    fn = scored.count("FN")
    total = tp + tn + fp + fn
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall    = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1        = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    accuracy  = (tp + tn) / total if total > 0 else 0.0
    return {"TP": tp, "TN": tn, "FP": fp, "FN": fn,
            "precision": precision, "recall": recall, "f1": f1, "accuracy": accuracy}


def _pass_fail(label, expected_list):
    """
    Return PASS if label is in expected_list.
    Return SKIP if expected_list is None or label indicates a non-scorable
    condition (no_english_version, not_translated, error).
    Return FAIL otherwise.
    """
    if expected_list is None:
        return "SKIP"
    if label in ("no_english_version", "not_translated", "error"):
        return "SKIP"
    return "PASS" if label in expected_list else "FAIL"


# ---------------------------------------------------------------------------
# Step 6: Aggregation
# ---------------------------------------------------------------------------

def aggregate_by_group(results):
    """Return per-group metrics dicts."""
    g1 = [r for r in results if r["group"] == "group1_git_history"]
    g2 = [r for r in results if r["group"] == "group2_structural"]
    return {
        "g1_baseline":        compute_metrics(g1,      "baseline_label"),
        "g1_candidate":       compute_metrics(g1,      "candidate_label"),
        "g2_candidate":       compute_metrics(g2,      "candidate_label"),
        "combined_candidate": compute_metrics(results, "candidate_label"),
    }


def aggregate_by_family(results):
    """Return {family_name: candidate_metrics} for Group 2 scenarios."""
    by_family = collections.defaultdict(list)
    for r in results:
        if r["group"] == "group2_structural" and r.get("family"):
            by_family[r["family"]].append(r)
    return {fam: compute_metrics(rows, "candidate_label")
            for fam, rows in by_family.items()}


def aggregate_by_page(results):
    """Return {page_id: candidate_metrics} for Group 2 scenarios."""
    by_page = collections.defaultdict(list)
    for r in results:
        if r["group"] == "group2_structural" and r.get("page_id"):
            by_page[r["page_id"]].append(r)
    return {page: compute_metrics(rows, "candidate_label")
            for page, rows in by_page.items()}


# ---------------------------------------------------------------------------
# Step 7: Report generation
# ---------------------------------------------------------------------------

def _f(v):
    return f"{v:.2f}"


def _metrics_line(label, m):
    return (
        f"**{label}** — "
        f"precision: {_f(m['precision'])}  recall: {_f(m['recall'])}  "
        f"f1: {_f(m['f1'])}  accuracy: {_f(m['accuracy'])}  "
        f"TP={m['TP']}  TN={m['TN']}  FP={m['FP']}  FN={m['FN']}"
    )


def _metrics_row(label, m):
    return (
        f"| {label} "
        f"| {m['TP']} | {m['TN']} | {m['FP']} | {m['FN']} "
        f"| {_f(m['precision'])} | {_f(m['recall'])} | {_f(m['f1'])} |"
    )


def generate_report(results, metrics, by_family, by_page, manifest,
                    baseline_cmd, candidate_cmd, timestamp):
    g1 = [r for r in results if r["group"] == "group1_git_history"]
    g2 = [r for r in results if r["group"] == "group2_structural"]

    lines = [
        "# Content Detection Benchmark Report", "",
        f"**Generated:** {timestamp}",
        f"**Baseline:** `{baseline_cmd}`",
        f"**Candidate:** `{candidate_cmd}`", "",
    ]

    # ------------------------------------------------------------------
    # Section 1: Group 1 — git-history scenarios
    # ------------------------------------------------------------------
    lines += [
        "## Section 1: Group 1 — Git-history scenarios", "",
        "Scenarios where EN and KO are committed separately; "
        "lsync detects EN updated after KO (may produce false positives/negatives).", "",
        "| Scenario | Ground Truth | Baseline | Exp Baseline | Candidate | Exp Candidate | Baseline Pass | Candidate Pass |",
        "|----------|-------------|----------|-------------|-----------|---------------|---------------|----------------|",
    ]
    for r in g1:
        exp_bl   = ", ".join(r["expected_baseline"])  if r.get("expected_baseline")  else ""
        exp_cand = ", ".join(r["expected_candidate"]) if r.get("expected_candidate") else ""
        lines.append(
            f"| {r.get('description', r['id'])} "
            f"| {r['ground_truth']} "
            f"| {r['baseline_label']} "
            f"| {exp_bl} "
            f"| {r['candidate_label']} "
            f"| {exp_cand} "
            f"| {r['baseline_pass']} "
            f"| {r['candidate_pass']} |"
        )
    lines += [
        "",
        _metrics_line("Group 1 — Baseline",  metrics["g1_baseline"]),
        _metrics_line("Group 1 — Candidate", metrics["g1_candidate"]),
        "",
    ]

    # ------------------------------------------------------------------
    # Section 2: Group 2 — structural scenarios
    # ------------------------------------------------------------------
    lines += [
        "## Section 2: Group 2 — Structural scenarios", "",
        "Scenarios where EN + KO are committed together; lsync always reports "
        "up_to_date. Only the candidate detector can catch genuine drift here.", "",
        "| Page | Family | Ground Truth | Candidate | Exp Candidate | Candidate Pass |",
        "|------|--------|-------------|-----------|---------------|----------------|",
    ]
    for r in g2:
        exp_cand = ", ".join(r["expected_candidate"]) if r.get("expected_candidate") else ""
        lines.append(
            f"| {r.get('page_id', '')} "
            f"| {r.get('family', '')} "
            f"| {r['ground_truth']} "
            f"| {r['candidate_label']} "
            f"| {exp_cand} "
            f"| {r['candidate_pass']} |"
        )
    lines += [
        "",
        _metrics_line("Group 2 — Candidate", metrics["g2_candidate"]),
        _metrics_line("Combined Candidate",  metrics["combined_candidate"]),
        "",
    ]

    # ------------------------------------------------------------------
    # Section 3: Summary by mutation family (Group 2 candidate)
    # ------------------------------------------------------------------
    lines += [
        "## Section 3: Summary by mutation family", "",
        "| Family | TP | TN | FP | FN | Precision | Recall | F1 | Notes |",
        "|--------|----|----|----|----|-----------|--------|----|-------|",
    ]
    fam_defs = manifest.get("mutation_families", {})
    for fam_name, m in by_family.items():
        notes = "; ".join(fam_defs.get(fam_name, {}).get("notes", []))
        lines.append(
            f"| {fam_name} "
            f"| {m['TP']} | {m['TN']} | {m['FP']} | {m['FN']} "
            f"| {_f(m['precision'])} | {_f(m['recall'])} | {_f(m['f1'])} "
            f"| {notes} |"
        )
    lines.append("")

    # ------------------------------------------------------------------
    # Section 4: Summary by page (Group 2 candidate)
    # ------------------------------------------------------------------
    lines += [
        "## Section 4: Summary by page", "",
        "| Page | TP | TN | FP | FN | Precision | Recall | F1 |",
        "|------|----|----|----|----|-----------|--------|----|",
    ]
    for page_id, m in by_page.items():
        lines.append(_metrics_row(page_id, m))
    lines.append("")

    # ------------------------------------------------------------------
    # Section 5: Interpretation notes
    # ------------------------------------------------------------------
    lines += [
        "## Section 5: Interpretation notes", "",
        "**Group 1** tests lsync's git-history detection. "
        "Baseline false positives (fp_*) are expected: lsync sees EN updated after KO "
        "even for cosmetic changes. The candidate detector is evaluated on whether it "
        "correctly ignores these cosmetic changes. "
        "The false-negative scenario (fn_false_sync) tests whether the candidate "
        "detects genuine drift that lsync missed because a later cosmetic KO edit "
        "advanced the sync point.", "",
        "**Group 2** evaluates structural and semantic drift detection. "
        "Lsync always outputs up_to_date for these scenarios (both EN and KO committed together). "
        "Only the candidate detector's labels are scored.", "",
        "**Families marked 'expected to be reliably detectable'** represent the current "
        "core capability of the structural comparison approach.",
        "",
        "**Families with 'currently limited by block alignment' or 'intra-block comparison'** "
        "reflect known detector limitations. These are informational notes, not formal subgroups. "
        "All Group 2 families are scored with the same standard.",
        "",
        "**Families marked 'useful as a capability probe'** are included to track progress "
        "on harder detection cases.",
        "",
        "**F1 score** is the primary quality metric for the candidate detector. "
        "no_english_version, not_translated, and error outputs are excluded from all metrics.",
        "",
    ]

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Run the content-drift detection benchmark."
    )
    parser.add_argument("--repo",      required=True, help="Test repository path.")
    parser.add_argument("--baseline",  required=True, help="Baseline detector command.")
    parser.add_argument("--candidate", required=True, help="Candidate detector command.")
    parser.add_argument("--lang",    default="ko",        help="Language code (default: ko).")
    parser.add_argument("--manifest", default=None,       help="Path to scenarios.json.")
    parser.add_argument("--output",  default="report.md", help="Output report path.")
    args = parser.parse_args()

    repo_dir = os.path.abspath(args.repo)
    manifest_path = args.manifest or os.path.join(_SCRIPT_DIR, "scenarios.json")

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    results = []
    for s in manifest["scenarios"]:
        scenario_id = s["id"]
        grp         = s.get("group", "")
        exp         = resolve_expectations(s, manifest)

        en_path   = f"content/en/docs/tasks/job/{scenario_id}.md"
        l10n_path = f"content/{args.lang}/docs/tasks/job/{scenario_id}.md"
        print(f"  {scenario_id} ...", end=" ", flush=True)
        baseline_label  = run_detector(args.baseline,  en_path, l10n_path, repo_dir)
        candidate_label = run_detector(args.candidate, en_path, l10n_path, repo_dir)
        print(f"baseline={baseline_label}  candidate={candidate_label}")

        baseline_pass  = _pass_fail(baseline_label,  exp["expected_baseline"])
        candidate_pass = _pass_fail(candidate_label, exp["expected_candidate"])

        results.append({
            "id":                 scenario_id,
            "ground_truth":       exp["ground_truth"],
            "group":              grp,
            "description":        s.get("description"),      # Group 1
            "page_id":            s.get("page_id"),           # Group 2
            "family":             s.get("family"),            # Group 2
            "expected_baseline":  exp["expected_baseline"],
            "expected_candidate": exp["expected_candidate"],
            "baseline_label":     baseline_label,
            "candidate_label":    candidate_label,
            "baseline_pass":      baseline_pass,
            "candidate_pass":     candidate_pass,
        })

    metrics   = aggregate_by_group(results)
    by_family = aggregate_by_family(results)
    by_page   = aggregate_by_page(results)

    timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    report = generate_report(results, metrics, by_family, by_page, manifest,
                             args.baseline, args.candidate, timestamp)

    with open(args.output, "w", encoding="utf-8") as f:
        f.write(report)

    bm = metrics["g1_baseline"]
    cm = metrics["combined_candidate"]
    print(f"\nGroup 1 Baseline:   P={_f(bm['precision'])} R={_f(bm['recall'])} F1={_f(bm['f1'])} Acc={_f(bm['accuracy'])}")
    print(f"Combined Candidate: P={_f(cm['precision'])} R={_f(cm['recall'])} F1={_f(cm['f1'])} Acc={_f(cm['accuracy'])}")
    print(f"Report written to: {args.output}")


if __name__ == "__main__":
    main()
