# AGENTS.md for Kubernetes Korean localization

## Purpose

This file defines compact working rules for AI-assisted Korean localization of Kubernetes website documentation.

Use it for:

- creating new Korean documentation from English source files
- self-review before opening a PR
- reviewing another contributor's Korean localization PR
- updating outdated Korean pages when English source files change

AI output is a draft. Human review is required.

## Scope

All paths in this file are relative to the repository root.

- Source directory: `content/en`
- Target directory: `content/ko`

This file applies to Korean localization work under `content/ko`.

Although this file is located under `content/ko`, Korean localization tasks require reading the matching English source files under `content/en`.

Do not edit English source files unless explicitly asked.

Do not manually localize upstream auto-generated reference directories (such as `docs/reference/**/generated/**`) unless explicitly asked.

Do not add explanations, examples, warnings, links, headings, or opinions that are not present in the English source.

## Local references

Read these local files before Korean localization work:

- `content/ko/docs/contribute/localization_ko.md`
- `content/ko/docs/contribute/localization_ko_best_practice.md`

For terminology, read the `한글화 용어집` section in:

- `content/ko/docs/contribute/localization_ko.md`

Rendered references for human checking:

- https://kubernetes.io/ko/docs/contribute/localization_ko/
- https://kubernetes.io/ko/docs/contribute/localization_ko_best_practice/

Local files are the primary references. Rendered website links are secondary references.

If this file and the local references conflict, report the conflict instead of guessing.

## Core rules

MUST:

- Read the full English source before editing Korean content.
- Read the existing Korean page if it exists.
- Read nearby Korean pages when style or terminology is unclear (if an existing nearby Korean page conflicts with a rule in this file or `localization_ko.md`—such as translating backticked API object names or keeping legacy `/ko` links—follow this file and `localization_ko.md`).
- Preserve source meaning, structure, and intent.
- Keep diffs small and reviewable.
- Follow existing Korean Kubernetes style and terminology.
- Preserve technical literals unless they are clearly user-visible prose.

DO NOT:

- Add content absent from the English source.
- Remove source content without reason.
- Silently rewrite unchanged sections during outdated updates (instead, report any pre-existing issues found in unchanged sections and ask the user whether to fix them).
- Invent terminology silently.
- Make unrelated style cleanups in source-sync PRs.
- Change code, commands, paths, API fields, YAML, JSON, placeholders, or copyable values unless clearly required.

## Korean style

- Use Korean plain style, 평어체 (`-다.`), by default for documentation.
- For blog posts under `content/ko/blog/`, either plain style (`평어체`, `-다.`) or polite formal style (`격식체`, `-습니다/-합니다`) is acceptable depending on the post's purpose and original tone (e.g., release/community announcements and conversational posts often use `-습니다/-합니다`, while technical tutorials or formal statements often use `-다.`), provided the chosen style is used consistently throughout the post. The main landing page may also use polite style.
- Avoid translationese.
- Prefer natural Korean technical writing.
- Avoid unnecessary `~의`.
- Avoid unnecessary plural expressions.
- Avoid double passive expressions (e.g., use `-되다` instead of `-되어지다`).
- Translate English imperatives into natural Korean plain style (`~한다`) or hortative (`~하자`); avoid harsh command endings (`~하라`).
- Prefer concise sentences.
- End Korean "-다" style sentences with a period (`.`), including list items and full-sentence code comments (short noun-phrase code comments do not require a trailing period).
- Convert English sentence-ending colons (`:`) that introduce lists or code blocks into natural Korean sentence endings with a period (`.`).
- Within a single list, do not mix sentence-style ("-다." or "-습니다.") and noun-style (명사형 종결, no period) endings. Pick one per list and apply it to every item (if a list consists of bare code/command literals plus a prose sub-list introductory bullet, apply the sentence ending only to the prose bullet).
- Match line breaks to the English source: translate each paragraph or list item into natural Korean word order first, then wrap it into the exact same number of lines (`N` English lines → `N` Korean lines) so that body blank lines, headings, and shortcode blocks stay aligned (note that blog posts often add a 1–2 line `translator:` field in front matter, shifting total file line numbers after the front-matter `---` delimiter by that offset). Do not start a wrapped continuation line at column 1 with `#`, `- `, `* `, or `<number>. ` (which Markdown parses as a heading or list item). When an English sentence is split across a fenced code block, place the introductory clause before the code block and the concluding Korean verb clause (`~한다.`) after the code block. For new translations, this body line alignment is a MUST across the entire file; when updating an existing Korean page, apply this to newly added or modified sections without re-wrapping untouched Korean paragraphs.

## Terminology

Primary terminology source:

- `content/ko/docs/contribute/localization_ko.md`, section `한글화 용어집`

Terminology priority:

1. Korean localization glossary
2. Existing Korean Kubernetes documentation
3. Existing Korean cloud native usage
4. Korean localization team consensus
5. Clear reviewer note

English term handling:

- Prefer a Korean term when it is natural and established.
- If a term appears in prose and is listed in the 한글화 용어집 table, its glossary mapping is mandatory in prose when used in the matching part of speech and sense (e.g., noun `setting` → `세팅` vs. verb gerund `by setting the field` → `설정`; quota/amount `allocation` → `할당량` vs. act/mechanism of allocating `Dynamic Resource Allocation` / `allocation controller` → `동적 리소스 할당` / `할당 컨트롤러`) — this is not optional. Always check the third column (`비고`) of the glossary table and apply any context condition: for example, terms marked `API 오브젝트인 경우` (`Node`, `Namespace`, `Secret`, `Event`) do not take API-object parenthetical notation when used as Linux/host or general computing concepts (e.g., Linux `PID/process namespace` → `네임스페이스`, `filesystem secrets` → `파일시스템 시크릿`, `container lifecycle events` → `컨테이너 라이프사이클 이벤트`, or host-machine modifiers like `Node-local`). Also align with established noun terms on linked target Korean concept pages (e.g., Pod Security Standards profile names `특권(privileged)`, `기본(baseline)`, `제한(restricted)`). This applies even if the same English word also appears elsewhere on the page as a command, package name, or file name (which stay in English per Technical literals).
- Use Korean plus English at first occurrence when useful or required by the guide (including in headings).
- Usually avoid repeated Korean plus English notation after first occurrence.
- For Kubernetes API object names (`kind`) in prose (outside backticks/code): follow the 한글화 용어집 and Korean loanword rules—transliterate with English in parentheses on first occurrence (e.g., `디플로이먼트(Deployment)`, `컨피그맵(ConfigMap)`), use Korean only for designated common kinds (`파드`, `서비스`), and keep English for non-`kind` sub-objects (e.g., `PodSpec`, `PersistentVolumeClaimList`) or explicit glossary exceptions (e.g., `Horizontal Pod Autoscaler`, `PodDisruptionBudget`, `CertificateSigningRequest`). For newer API `kind` names not yet in the glossary, check existing `content/ko/docs/` usage first (e.g., `파드그룹(PodGroup)`), and keep English when compound names contain plural nouns or long policy terms where Korean transliteration is awkward (e.g., `SelfSubjectRulesReview`, `VolumeAttributesClass`, `ValidatingAdmissionPolicy`, `MutatingAdmissionPolicy`).
- Keep English when a term is inside backticks/code or is an API field, command, flag, file name, path, config key, feature gate, package name, image name, placeholder, or copyable value.
- Do not force awkward Korean translations.
- Do not copy the general Kubernetes glossary blindly. The Korean localization glossary and the reader-facing glossary have different purposes.

If terminology is ambiguous, mention it in the PR summary or review comment.

## Technical literals

Preserve these in English unless the guide or source context clearly says otherwise:

- Backticked (`...`) or code-block Kubernetes API object names, non-`kind` API types (e.g., `*Spec`, `*List`), explicit English-only API objects in the glossary, and Kubernetes RBAC API verb literals (`get`, `list`, `watch`, `create`, `update`, `patch`, `delete`, `escalate`, `bind`, `impersonate`, even when formatted in bold like `**patch**`)
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

- front matter
- title and description
- weight and aliases
- reviewers metadata
- Hugo layout HTML comments (`<!-- overview -->`, `<!-- body -->`, `<!-- prerequisites -->`, `<!-- steps -->`, `<!-- discussion -->`, `<!-- lessoncontent -->`, `<!--more-->`, `<!-- Docsy ... -->`)
- shortcodes
- shortcode parameters
- referenced local files (`content/ko/examples/...`, `content/ko/includes/...`, `content/ko/docs/reference/glossary/...`)
- code fences
- tables and definition lists (`Term` followed by `: Definition`)
- admonitions
- internal links
- external links
- same-page and cross-page anchors
- image references
- tabs, task list checkboxes (`- [ ]`), and list indentation

Rules:

- Translate user-visible front matter values such as `title`, `linkTitle`, `description`, and `short_description`.
- ONLY in glossary definition data files under `content/ko/docs/reference/glossary/*.md` (never in regular page `title`s, headings, prose, or `glossary_tooltip` `text`), format the front-matter `title` as `title: <Korean> (원문, <English>)` (e.g., `title: 파드 (원문, Pod)`, `title: 파드템플릿 (원문, PodTemplate)` without duplicating `(PodTemplate)` before `(원문, ...)`), unless the term remains in English (`title: etcd`).
- Preserve structural front matter values (such as `stages`, `min-kubernetes-server-version`, `content_type`, `weight`, `outputs`, `layout`, `slug`, `id`, `full_link`, `date`, `tags`, and `aka` in glossary files) unless the guide says otherwise. In blog posts (`content/ko/blog/`), a `translator:` field may be added after `author:` in the front matter when provided or requested by the user (do not invent placeholder contributor names).
- Comment out English `reviewers` (or `reviews`) metadata in Korean pages when present—including an empty `reviewers:` line (`# reviewers:`)—rather than deleting it, to preserve 1:1 line alignment with the English source.
- Preserve Hugo layout HTML comments (`<!-- overview -->`, `<!-- body -->`, `<!-- prerequisites -->`, `<!-- steps -->`, `<!-- discussion -->`, `<!-- lessoncontent -->`, `<!--more-->`) verbatim; never translate or remove them.
- Preserve Markdown definition lists (a term line followed by `: ` on the next line), task list checkboxes (`- [ ]`, `- [x]`), intentional two-space (`  `) trailing Markdown hard line breaks, and the exact 3- or 4-space indentation of code blocks and continuation paragraphs inside numbered lists (`1.`) so list numbering does not reset.
- Preserve shortcodes and non-visible shortcode parameters (`feature-state`, `tabs name="..."`, `glossary_tooltip` `term_id`, `glossary_definition` `term_id`/`length`, `code_sample` `file`, `alert color`, `highlight` `hl_lines`). Translate user-visible shortcode parameters such as `table caption="..."`, `figure alt/caption/title`, `alert title="..."`, `glossary_definition prepend="..."`, and `tab name="..."` (when the tab name is descriptive prose rather than a tool/OS proper noun like `Containerd` or `Bash`). Inside `{{< highlight ... "hl_lines=..." >}}` blocks, keep the exact number of comment lines so highlighted line numbers do not shift; inside `{{< mermaid >}}` diagrams, preserve node/subgraph IDs and `class` identifiers in English (translating only bracketed display labels if localized).
- In `glossary_tooltip`, keep `term_id="..."` in English, translate `text="..."` into Korean when present (including first-occurrence parenthetical English when applicable, e.g., `text="레플리카셋(ReplicaSet)"`), and attach Korean particles (`은/는`, `이/가`, `을/를`) directly after `>}}` without a space.
- Before using `include`, `tab include="..."`, `codenew`, or `glossary_definition`, verify that the referenced target file exists under `content/ko/` (`content/ko/includes/`, relative `content/ko/` directory, `content/ko/examples/`, or `content/ko/docs/reference/glossary/`), because these shortcodes do not fall back to `content/en/` and will fail the Hugo build if missing (if a required target file is missing under `content/ko/`, keep the build working, report the missing dependency file to the user, and ask whether to localize/create it in the same PR). By contrast, `code_sample` automatically falls back to `content/en/examples/<file>` when `content/ko/examples/<file>` is absent, but if `content/ko/examples/<file>` exists, keep it synced with `content/en/examples/<file>`.
- Avoid CommonMark/Hugo emphasis delimiter failures when Korean particles follow `*`, `**`, or `_`: (1) do not place closing parentheses `)` immediately before closing `*` or `**` when followed directly by a Korean particle without a space (`*소유자(owner)*는` fails; use `*소유자*(owner)는` or leave a space after `*`), and (2) do not attach a Korean syllable directly after a closing underscore `_` without a space (`_스태틱 파드_는` or `_비활성화_되어` fails even without parentheses; leave a space after `_`, place `(term)` immediately after `_` as in `_일반 PLEG_(generic PLEG)는`, or convert `_..._` to `*...*`).
- Do not manually add `/ko` to Markdown internal links (`[text](/docs/...)`), as Hugo automatically prepends `/ko` when the target Korean page exists. In updated sections, remove legacy `/ko` prefixes from Markdown links after verifying whether the target Korean page exists and whether any `#anchor` fragment matches that target page's headings (for legacy `/ko` links in unchanged sections, report them to the user and ask whether to clean them up).
- Update `#anchor` links to match translated Korean headings when linking within the same page or to an existing Korean page (unless the heading defines an explicit `{#custom-anchor}` ID or the anchor targets a `tabs` shortcode such as `#<tabs-name>-0`, which must be preserved). Note that this repository's `hugo.toml` uses `autoHeadingIDType = "blackfriday"`, which converts parentheses `(`, `)` and colons `:` in headings into hyphens `-` (collapsing consecutive hyphens and stripping leading/trailing hyphens) rather than deleting them (e.g., `### 이미지 풀(pull) 정책` → `#이미지-풀-pull-정책`). For cross-page `#anchor` links, check `<path>.md`, `<path>/_index.md`, and `<path>/index.md` under `content/ko/` to verify the exact heading or `{#custom-anchor}` ID instead of guessing; if the target page is not yet localized in `content/ko`, or if the existing Korean target page is outdated and does not yet contain the target section/heading, keep the English `#anchor`.
- When moving an existing Korean page to a new path, do not edit `static/_redirects.base` in the same PR as `content/ko/` changes (due to separate `OWNERS`); note that the 301 redirect in `static/_redirects.base` must be submitted in a separate PR.

## Workflow: new Korean translation

Use this when a file exists under `content/en` but not under `content/ko`.

1. Identify the English source file under `content/en` and compute the matching Korean path under `content/ko`. Stop if the Korean file already exists—including under a legacy extension or bundle structure such as `_index.html` vs. `_index.md` or `<name>.md` vs. `<name>/_index.md` (use the update workflow and replace/remove the legacy file instead of creating a duplicate).
2. If GitHub access is available, check open `language/ko` issues (`https://github.com/kubernetes/website/issues?q=is%3Aissue+state%3Aopen+label%3Alanguage%2Fko`) and PRs (`https://github.com/kubernetes/website/pulls?q=is%3Apr+state%3Aopen+label%3Alanguage%2Fko`) for the target file. If a duplicate open issue or PR exists, report it to the user and ask whether to proceed before translating.
3. Read the full English source file, nearby Korean pages in the same section, and the local references listed above.
4. Extract every technical/proper-noun term in the English source and check each against the 한글화 용어집 table (including its `비고` column conditions); note the required Korean mapping before translating.
5. Translate user-visible prose only, applying the glossary mappings from step 4.
6. Preserve technical literals, examples, code blocks, commands, paths, and structured data.
7. Apply Korean style and terminology rules, wrapping each paragraph/list item to match the English line count.
8. Check Markdown, Hugo shortcodes, front matter, links, and anchors (inspecting target files in `content/ko` for cross-page `#anchor` links).
9. Mechanically verify body line alignment (`wc -l`, blank-line/heading positions after the front-matter `---` delimiter, and matching EOF trailing newline/blank-line state, accounting for any added `translator:` lines in blog front matter).
10. Re-read the completed Korean draft side by side against the English source to review and refine accuracy, natural Korean flow, and full compliance with the self-review checklist.
11. If asked, prepare a draft PR description with AI-use disclosure.

## Workflow: self-review before PR

Before opening a PR, check:

- English source was read.
- Existing Korean page was read if present.
- Nearby Korean pages were checked when needed.
- Source meaning was preserved.
- No unsupported content was added.
- Korean plain style (`-다.`) was used correctly (or consistent polite style `-습니다/-합니다.` when appropriate in blog posts).
- Translationese was reduced.
- Terminology follows the glossary and existing Korean docs.
- Every glossary-listed term found in the English source was checked (including `비고` conditions and part of speech/sense) and applied in Korean prose (not left in English by oversight).
- Technical literals are preserved.
- Sentence-ending punctuation is consistent within each list and matches the "-다." (or blog "-습니다.") / 명사형 rule (no mixed styles, no missing periods, no trailing English colons).
- Each paragraph/list item has the exact same number of lines as its English source counterpart (for new pages or updated sections), and mechanical line-count/blank-line alignment was verified.
- Markdown and Hugo syntax are valid (including Hugo layout comments, `glossary_tooltip` `text` vs `term_id`, and Markdown emphasis with parentheses/particles).
- Links, anchors (including cross-page anchor targets in `content/ko`), and any referenced `content/ko/examples/` files were checked.
- Front matter was checked.
- Diff is small and reviewable.
- Ambiguous terms or source issues are noted.

## Workflow: review another contributor's PR

When reviewing a Korean localization PR:

1. If GitHub access is available, check open `language/ko` issues and PRs for related or duplicate work on the same file and note any overlap.
2. Read the English source file and the changed Korean file.
3. Compare structure section by section.
4. Check source fidelity.
5. Check Korean style.
6. Check terminology against the glossary and existing docs.
7. Check technical literals.
8. Check Markdown, links, anchors, front matter, and shortcodes.
9. Leave specific, actionable comments.
10. Separate required fixes from optional suggestions.
11. Do not request personal style changes unsupported by the guide.
12. Do not ask for a full rewrite unless necessary.

## Workflow: update outdated Korean page

Use this when the English source changed after the Korean page was localized.

1. Find the English source file and the Korean file. If GitHub access is available, check open `language/ko` issues (`https://github.com/kubernetes/website/issues?q=is%3Aissue+state%3Aopen+label%3Alanguage%2Fko`) and PRs (`https://github.com/kubernetes/website/pulls?q=is%3Apr+state%3Aopen+label%3Alanguage%2Fko`) for the target file; if another contributor is already working on it, inform the user and ask whether to proceed.
2. Use the triage report details provided in the user prompt—or run `python3 scripts/l10n-outdatedness-triage.py --lang ko --verbose` if not provided and supported by the environment—to inspect the target page's triage signal (`Strong signal`, `Moderate signal`, `No signal`, or `Orphan`), all flagged reasons, and indicators.
3. If the English page was moved (`Orphan`) or changed its file extension/bundle layout (e.g., `_index.html` → `_index.md`), move or rename the existing Korean file to the matching new path under `content/ko/` (removing the old file so duplicate content files do not coexist) and remind the user to submit any `static/_redirects.base` 301 redirect in a separate PR; if removed in English, remove the Korean file.
4. Check `git log --stat --oneline -n 5 -- content/ko/<path>` to identify when the Korean file last had a full content sync (since recent commits on `content/ko/<path>`—even with generic milestone titles—may be 1-line front-matter/link fixes rather than full body syncs), run `git log -p --since="<last-full-sync-date>" -- content/en/<path>` to inspect the English commits since that sync, and always compare the current English and Korean files section by section (plus `diff -u content/en/examples/<file> content/ko/examples/<file>` for any existing referenced local example files).
5. Update only Korean sections (and any existing referenced `content/ko/examples/...` files) affected by English changes, matching line breaks in the updated sections.
6. Preserve unchanged Korean wording and line wraps by default; do not silently mix unrelated style cleanup into the same PR. However, if you spot pre-existing issues in unchanged sections (such as legacy `/ko` link prefixes, malformed/duplicate shortcode attributes, outdated glossary terms, or obvious typos), compile a summary of those findings after completing the source-sync update and ask the user whether they want to apply those fixes as well.
7. Re-read the updated sections side by side against the English source to review and refine accuracy, natural Korean flow, and full compliance with the self-review checklist (and optionally re-run the triage script to confirm technical drift signals are resolved).
8. If asked, draft a PR description that explains reflected source changes and includes AI-use disclosure.

## AI-assisted contribution rules

- Do not create commits.
- At task completion, remind the user to follow Kubernetes AI Guidance (https://www.kubernetes.dev/docs/guide/pull-requests/#ai-guidance), review and update the changes themselves, write the PR title and commit message in English, and disclose AI assistance in the PR description, for example: `This PR was written in part with the assistance of generative AI.`

## Escalation

Leave a note or ask human reviewers when:

- the English source appears wrong
- terminology is ambiguous
- existing Korean docs conflict
- anchor behavior is unclear
- shortcode or front matter behavior is unclear
- the change may affect localization policy
- the update requires more than source synchronization

## Final rule

AI output is not final.

Human review is required before merge.
