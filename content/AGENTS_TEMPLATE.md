# AGENTS.md for Kubernetes [LANGUAGE_NAME] localization

## Purpose

This file defines compact working rules for AI-assisted [LANGUAGE_NAME] localization of Kubernetes website documentation.

Use it for:

- creating new localized documentation from English source files
- self-review before opening a PR
- reviewing another contributor's localization PR
- updating outdated localized pages when English source files change

AI output is a draft. Human review is required.

## Scope

All paths in this file are relative to the repository root.

- Source directory: `content/en`
- Target directory: `content/[LOCALE_CODE]`

This file applies to [LANGUAGE_NAME] localization work under `content/[LOCALE_CODE]`.

Although this file is located under `content/[LOCALE_CODE]`, localization tasks require reading the matching English source files under `content/en`.

Do not edit English source files unless explicitly asked.

Do not add explanations, examples, warnings, links, headings, or opinions that are not present in the English source.

## Local references

Read these local files before localization work:

- `[LOCALIZATION_GUIDE_PATH]`
- `[BEST_PRACTICES_PATH]`
- `[STYLE_GUIDE_PATH]`

For terminology, read:

- `[GLOSSARY_PATH]`

If the glossary is a section inside another file, specify:

- File: `[GLOSSARY_FILE_PATH]`
- Section: `[GLOSSARY_SECTION_HEADING]`

Rendered references for human checking:

- `[LOCALIZATION_GUIDE_URL]`
- `[BEST_PRACTICES_URL]`
- `[STYLE_GUIDE_URL]`
- `[GLOSSARY_URL]`

Local files are the primary references. Rendered website links are secondary references.

If this file and the local references conflict, report the conflict instead of guessing.

## Core rules

MUST:

- Read the full English source before editing localized content.
- Read the existing localized page if it exists.
- Read nearby localized pages when style or terminology is unclear (if an existing nearby page conflicts with a rule in this file or `[LOCALIZATION_GUIDE_PATH]`, follow this file and `[LOCALIZATION_GUIDE_PATH]`).
- Preserve source meaning, structure, and intent.
- Keep diffs small and reviewable.
- Follow existing [LANGUAGE_NAME] Kubernetes style and terminology.
- Preserve technical literals unless they are clearly user-visible prose.

DO NOT:

- Add content absent from the English source.
- Remove source content without reason.
- Silently rewrite unchanged sections during outdated updates (instead, report any pre-existing issues found in unchanged sections and ask the user whether to fix them).
- Invent terminology silently.
- Make unrelated style cleanups in source-sync PRs.
- Change code, commands, paths, API fields, YAML, JSON, placeholders, or copyable values unless clearly required.

## Language style

Fill this section for [LANGUAGE_NAME].

- Preferred tone or register (docs vs. blog posts): `[PREFERRED_TONE_OR_REGISTER]`
- Formality / imperative style: `[FORMALITY_RULE]`
- Sentence and list punctuation policy: `[SENTENCE_AND_LIST_PUNCTUATION_RULE]`
- Voice and pluralization policy: `[VOICE_AND_PLURALIZATION_RULE]`
- Line-wrapping / line-alignment policy: `[LINE_ALIGNMENT_POLICY]`
- Common expressions to avoid / prefer: `[EXPRESSIONS_POLICY]`

> **Example (`ko` localization):**
> - **Tone**: Use plain style (`평어체`, `-다.`) by default for documentation; blog posts (`content/ko/blog/`) may use either plain style (`-다.`) or polite formal style (`격식체`, `-습니다/-합니다.`) consistently depending on the post's purpose.
> - **Imperatives & punctuation**: Translate imperatives as `~한다` or `~하자` (avoid `~하라`). Convert sentence-ending colons (`:`) before lists/code blocks into `.`. Do not mix sentence-style (`-다.`) and noun-style endings within the same list.
> - **Line alignment**: Wrap each translated paragraph or list item into the same number of lines (`N` English lines → `N` localized lines) so blank lines, headings, and shortcodes stay 1:1 aligned for easier diff/outdatedness tracking (without re-wrapping untouched paragraphs during updates).

General rules:

- Avoid translationese.
- Prefer natural technical writing in [LANGUAGE_NAME].
- Prefer concise sentences.
- Keep line breaks close to (or 1:1 aligned with) the English source according to `[LINE_ALIGNMENT_POLICY]`, and never start a wrapped continuation line at column 1 with `#`, `- `, `* `, or `<number>. `.

## Terminology

Primary terminology source:

- `[GLOSSARY_PATH_OR_SECTION]`

Terminology priority:

1. [LANGUAGE_NAME] localization glossary
2. Existing [LANGUAGE_NAME] Kubernetes documentation
3. Existing [LANGUAGE_NAME] cloud native usage
4. Localization team consensus
5. Clear reviewer note

English term handling:

- Default prose policy: `[ENGLISH_TERM_POLICY]`
- First and repeated occurrence policy: `[FIRST_AND_REPEATED_OCCURRENCE_POLICY]`
- Kubernetes API object (`kind`) prose policy: `[API_OBJECT_PROSE_POLICY]`
- Untranslated term policy: `[UNTRANSLATED_TERM_POLICY]`

> **Example (`ko` localization):**
> - Apply glossary mappings in prose when the English word is used in the matching part of speech, sense, and context column (`비고`, e.g., `API 오브젝트인 경우` vs. general Linux/host terms like `PID namespace`).
> - In prose (outside backticks/code), transliterate API object `kind` names with English in parentheses on first occurrence (e.g., `디플로이먼트(Deployment)`), use Korean only for designated common kinds (`파드`, `서비스`), and keep English for non-`kind` types (`PodSpec`) or awkward compound/plural kinds (`PodDisruptionBudget`, `VolumeAttributesClass`).

Suggested defaults:

- Prefer a localized term when it is natural and established, checking any context or part-of-speech conditions in `[GLOSSARY_PATH_OR_SECTION]`.
- Use localized term plus English at first occurrence when useful or required by the guide (including in headings), and avoid repeating parenthetical English after first occurrence.
- Keep English when a term is inside backticks/code or is an API field, command, flag, file name, path, config key, feature gate, package name, image name, placeholder, or copyable value.
- Do not force awkward translations.
- Distinguish the localization team's terminology glossary (`[GLOSSARY_PATH_OR_SECTION]`) from the reader-facing glossary pages (`content/[LOCALE_CODE]/docs/reference/glossary/*.md`).

If terminology is ambiguous, mention it in the PR summary or review comment.

## Technical literals

Preserve these in English unless the guide or source context clearly says otherwise:

- Backticked (`...`) or code-block Kubernetes API object names, non-`kind` API types (e.g., `*Spec`, `*List`), and Kubernetes RBAC API verb literals (`get`, `list`, `watch`, `create`, `update`, `patch`, `delete`, `escalate`, `bind`, `impersonate`, even when bolded)
- API field names
- command names
- CLI flags
- file names
- paths
- URLs
- YAML keys and values
- JSON keys and values
- environment variables
- placeholders
- code blocks
- shell commands
- package names
- image names
- version strings
- feature gate names

Translate comments inside examples only when doing so does not change executable behavior or reader expectations.

## Markdown and Hugo

Preserve Markdown and Hugo structure.

Check:

- front matter (`title`, `linkTitle`, `description`, `short_description`, `weight`, `aliases`, `reviewers`)
- Hugo layout HTML comments (`<!-- overview -->`, `<!-- body -->`, `<!-- prerequisites -->`, `<!-- steps -->`, `<!-- discussion -->`, `<!-- lessoncontent -->`, `<!--more-->`, `<!-- Docsy ... -->`)
- shortcodes and shortcode parameters
- referenced local files (`content/[LOCALE_CODE]/examples/...`, `content/[LOCALE_CODE]/includes/...`, `content/[LOCALE_CODE]/docs/reference/glossary/...`)
- code fences, tables, and definition lists (`Term` followed by `: Definition`)
- admonitions
- internal and external links
- same-page and cross-page `#anchor` fragments
- image references, tabs, task list checkboxes (`- [ ]`), and list indentation

Rules:

- Translate user-visible front matter values such as `title`, `linkTitle`, `description`, and `short_description`.
- Reader-facing glossary page (`content/[LOCALE_CODE]/docs/reference/glossary/*.md`) title policy: `[GLOSSARY_PAGE_TITLE_POLICY]` (e.g., in `ko`, `title: <Korean> (원문, <English>)` is used **only** in `content/ko/docs/reference/glossary/*.md` front-matter `title`, never in regular pages or `glossary_tooltip` `text`).
- Preserve structural front matter values (such as `stages`, `min-kubernetes-server-version`, `content_type`, `weight`, `outputs`, `layout`, `slug`, `id`, `full_link`, `date`, `tags`, and `aka` in glossary files) unless the guide says otherwise. In blog posts (`content/[LOCALE_CODE]/blog/`), follow `[BLOG_METADATA_POLICY]` (e.g., adding `translator:` after `author:` only when provided by the user).
- Reviewer metadata policy: `[REVIEWER_METADATA_POLICY]` (e.g., in `ko`, comment out `reviewers:`—including an empty `# reviewers:` line—rather than deleting it, to keep line numbers aligned).
- Preserve Hugo layout HTML comments (`<!-- overview -->`, `<!-- body -->`, `<!-- prerequisites -->`, `<!-- steps -->`, `<!-- discussion -->`, `<!-- lessoncontent -->`, `<!--more-->`) verbatim; never translate or remove them.
- Preserve Markdown definition lists (`: `), task list checkboxes (`- [ ]`, `- [x]`), intentional two-space (`  `) hard line breaks, and the exact 3- or 4-space indentation of code blocks and continuation paragraphs inside numbered lists (`1.`) so list numbering does not reset.
- Preserve shortcodes and non-visible shortcode parameters (`feature-state`, `tabs name="..."`, `glossary_tooltip` `term_id`, `glossary_definition` `term_id`/`length`, `code_sample` `file`, `alert color`, `highlight` `hl_lines`). Translate user-visible shortcode parameters such as `table caption="..."`, `figure alt/caption/title`, `alert title="..."`, `glossary_definition prepend="..."`, `glossary_tooltip text="..."` (when present), and descriptive `tab name="..."`. Inside `{{< highlight ... "hl_lines=..." >}}`, keep comment line counts unchanged; inside `{{< mermaid >}}`, preserve node/subgraph IDs and `class` identifiers in English.
- Before using `include`, `tab include="..."`, `codenew`, or `glossary_definition`, verify that the referenced target file exists under `content/[LOCALE_CODE]/` (`includes/`, relative directory, `examples/`, or `docs/reference/glossary/`), because these shortcodes do not fall back to `content/en/` and will fail the Hugo build if missing (if a required target file is missing under `content/[LOCALE_CODE]/`, keep the build working, report the missing dependency file to the user, and ask whether to localize/create it in the same PR). By contrast, `code_sample` automatically falls back to `content/en/examples/<file>` when `content/[LOCALE_CODE]/examples/<file>` is absent (if a localized example file exists, keep it synced).
- Script-specific Markdown emphasis / shortcode spacing policy: `[MARKDOWN_EMPHASIS_AND_PARTICLE_POLICY]`
  > **Example (`ko` localization):** In languages that attach particles without spaces, attach particles directly after `{{< glossary_tooltip ... >}}` (`>}}는`), but avoid CommonMark emphasis failures when particles follow `*`, `**`, or `_` (place `(term)` outside asterisks as in `*소유자*(owner)는`, and avoid attaching Korean syllables directly after closing `_` without a space or parenthetical English).
- Internal link locale policy: `[INTERNAL_LINK_LOCALE_POLICY]` (by default in this repository, do not manually add `/[LOCALE_CODE]` to Markdown links `[text](/docs/...)`, as Hugo prepends the locale prefix automatically when the target localized page exists).
- Update `#anchor` links to match translated headings when linking within the same page or to an existing localized page (unless the heading defines an explicit `{#custom-anchor}` ID or the anchor targets a `tabs` shortcode such as `#<tabs-name>-0`, which must be preserved). Note that `hugo.toml` uses `autoHeadingIDType = "blackfriday"`, which converts parentheses `(`, `)` and colons `:` in headings into hyphens `-` rather than deleting them. For cross-page `#anchor` links, inspect `<path>.md`, `<path>/_index.md`, or `<path>/index.md` under `content/[LOCALE_CODE]/` instead of guessing; if the target page is not yet localized or is outdated and missing that section, keep the English `#anchor`.
- When moving an existing localized page to a new path, do not edit `static/_redirects.base` in the same PR as `content/[LOCALE_CODE]/` changes (due to separate `OWNERS`); submit the 301 redirect in `static/_redirects.base` in a separate PR.

## Workflow: new translation

Use this when a file exists under `content/en` but not under `content/[LOCALE_CODE]`.

1. Identify the English source file under `content/en` and compute the matching localized path under `content/[LOCALE_CODE]`. Stop if the localized file already exists—including under a legacy extension or bundle layout such as `_index.html` vs. `_index.md` or `<name>.md` vs. `<name>/_index.md` (use the update workflow instead).
2. If GitHub access is available, check open `language/[LOCALE_CODE]` issues (`https://github.com/kubernetes/website/issues?q=is%3Aissue+state%3Aopen+label%3Alanguage%2F[LOCALE_CODE]`) and PRs (`https://github.com/kubernetes/website/pulls?q=is%3Apr+state%3Aopen+label%3Alanguage%2F[LOCALE_CODE]`) for the target file. If a duplicate open issue or PR exists, report it to the user and ask whether to proceed before translating.
3. Read the full English source file, nearby localized pages in the same section, and the local references listed above.
4. Check technical/domain terms in the English source against `[GLOSSARY_PATH_OR_SECTION]` (including any context conditions) before translating.
5. Translate user-visible prose only, preserving technical literals, examples, code blocks, commands, paths, and structured data.
6. Apply `[LANGUAGE_NAME]` style, terminology, and `[LINE_ALIGNMENT_POLICY]`.
7. Check Markdown, Hugo shortcodes, front matter, links, and anchors (inspecting target files in `content/[LOCALE_CODE]` for cross-page `#anchor` links).
8. Re-read the completed draft side by side against the English source to review and refine accuracy, natural flow in `[LANGUAGE_NAME]`, and full compliance with the self-review checklist.
9. If asked, prepare a draft PR description in `[PR_DESCRIPTION_LANGUAGE]` with AI-use disclosure.

## Workflow: self-review before PR

Before opening a PR, check:

- English source was read.
- Existing localized page was read if present.
- Nearby localized pages were checked when needed.
- Source meaning was preserved and no unsupported content was added.
- `[LANGUAGE_NAME]` style and punctuation rules were followed consistently.
- Translationese was reduced.
- Terminology follows `[GLOSSARY_PATH_OR_SECTION]` (including context notes) and existing localized docs.
- Technical literals are preserved.
- Line wrapping / alignment matches `[LINE_ALIGNMENT_POLICY]`.
- Markdown and Hugo syntax are valid (including Hugo layout comments, shortcodes, and emphasis delimiters).
- Links, anchors (including cross-page anchor targets in `content/[LOCALE_CODE]`), and any referenced local files (`includes/`, `examples/`, `glossary/`) were checked.
- Front matter was checked.
- Diff is small and reviewable.
- Ambiguous terms or source issues are noted.

## Workflow: review another contributor's PR

When reviewing a localization PR:

1. If GitHub access is available, check open `language/[LOCALE_CODE]` issues and PRs for related or duplicate work on the same file and note any overlap.
2. Read the English source file and the changed localized file.
3. Compare structure section by section.
4. Check source fidelity.
5. Check `[LANGUAGE_NAME]` style.
6. Check terminology against `[GLOSSARY_PATH_OR_SECTION]` and existing docs.
7. Check technical literals.
8. Check Markdown, links, anchors, front matter, and shortcodes.
9. Leave specific, actionable comments.
10. Separate required fixes from optional suggestions.
11. Do not request personal style changes unsupported by the guide.
12. Do not ask for a full rewrite unless necessary.

## Workflow: update outdated localized page

Use this when the English source changed after the localized page was translated.

1. Find the English source file and the localized file. If GitHub access is available, check open `language/[LOCALE_CODE]` issues (`https://github.com/kubernetes/website/issues?q=is%3Aissue+state%3Aopen+label%3Alanguage%2F[LOCALE_CODE]`) and PRs (`https://github.com/kubernetes/website/pulls?q=is%3Apr+state%3Aopen+label%3Alanguage%2F[LOCALE_CODE]`) for the target file; if another contributor is already working on it, inform the user and ask whether to proceed.
2. Use the triage report details provided in the user prompt—or run `python3 scripts/l10n-outdatedness-triage.py --lang [LOCALE_CODE] --verbose` if not provided and supported by the environment—to inspect the target page's triage signal (`Strong signal`, `Moderate signal`, `No signal`, or `Orphan`), all flagged reasons, and indicators.
3. If the English page was moved (`Orphan`) or changed its file extension/bundle layout (e.g., `_index.html` → `_index.md`), move or rename the existing localized file to the matching new path under `content/[LOCALE_CODE]/` (removing the old file so duplicate content files do not coexist) and remind the user to submit any `static/_redirects.base` 301 redirect in a separate PR; if removed in English, remove the localized file.
4. Check `git log --stat --oneline -n 5 -- content/[LOCALE_CODE]/<path>` to identify when the localized file last had a full content sync (since recent commits—even with generic milestone titles—may be 1-line front-matter/link fixes rather than full body syncs), run `git log -p --since="<last-full-sync-date>" -- content/en/<path>` to inspect the English commits since that sync, and always compare the current English and localized files section by section (plus `diff -u content/en/examples/<file> content/[LOCALE_CODE]/examples/<file>` for any existing referenced local example files).
5. Update only localized sections (and any existing referenced `content/[LOCALE_CODE]/examples/...` files) affected by English changes, following `[LINE_ALIGNMENT_POLICY]` in updated sections.
6. Preserve unchanged localized wording and line wraps by default; do not silently mix unrelated style cleanup into the same PR. However, if you spot pre-existing issues in unchanged sections (such as legacy `/[LOCALE_CODE]` link prefixes, malformed/duplicate shortcode attributes, outdated terminology, or obvious typos), compile a summary of those findings after completing the source-sync update and ask the user whether they want to apply those fixes as well.
7. Re-read the updated sections side by side against the English source to review and refine accuracy, natural flow, and full compliance with the self-review checklist (and optionally re-run the triage script to confirm technical drift signals are resolved).
8. If asked, draft a PR description in `[PR_DESCRIPTION_LANGUAGE]` that explains reflected source changes and includes AI-use disclosure.

## AI-assisted contribution rules

- Do not create commits.
- At task completion, remind the user to follow Kubernetes AI Guidance (https://www.kubernetes.dev/docs/guide/pull-requests/#ai-guidance), review and update the changes themselves, write the PR title and commit message in English, and disclose AI assistance in the PR description, for example: `This PR was written in part with the assistance of generative AI.`

## Escalation

Leave a note or ask human reviewers when:

- the English source appears wrong
- terminology is ambiguous
- existing localized docs conflict
- anchor behavior is unclear
- shortcode or front matter behavior is unclear
- the change may affect localization policy
- the update requires more than source synchronization

## Final rule

AI output is not final.

Human review is required before merge.
