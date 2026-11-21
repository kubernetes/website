---
title: Localizing Kubernetes documentation
content_type: concept
weight: 50
card:
  name: contribute
  weight: 50
  title: Localizing the docs
---

<!-- overview -->

This page shows you how to
[localize](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)
the docs for a different language.

<!-- body -->

## Contribute to an existing localization

You can help add or improve the content of an existing localization. In
[Kubernetes Slack](https://slack.k8s.io/), you can find a channel for each
localization. There is also a general
[SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations)
where you can say hello.

{{< note >}}
For extra details on how to contribute to a specific localization,
look for a localized version of this page.
{{< /note >}}

### Find your two-letter language code

First, consult the
[ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php)
to find your localization's two-letter language code. For example, the two-letter code for
Korean is `ko`.

Some languages use a lowercase version of the country code as defined by the
ISO-3166 along with their language codes. For example, the Brazilian Portuguese
language code is `pt-br`.

### Fork and clone the repo

First, [create your own fork](/docs/contribute/new-content/open-a-pr/#fork-the-repo) of the
[kubernetes/website](https://github.com/kubernetes/website) repository.

Then, clone your fork and `cd` into it:

```shell
git clone https://github.com/<username>/website
cd website
```

The website content directory includes subdirectories for each language. The
localization you want to help out with is inside `content/<two-letter-code>`.

### Suggest changes

Create or update your chosen localized page based on the English original. See
[localize content](#localize-content) for more details.

To contribute to a localization, you **must be fluent in the target language**. If
you use AI tools to assist with your contribution, you must follow the Kubernetes
[AI Guidance](https://www.kubernetes.dev/docs/guide/pull-requests/#ai-guidance),
thoroughly review and verify all generated text yourself, and disclose AI tool usage
in your pull request description. Large, unreviewed AI-generated pull requests are
not accepted.

If you notice a technical inaccuracy or other problem with the upstream
(English) documentation, you should fix the upstream documentation first and
then repeat the equivalent fix by updating the localization you're working on.

Limit changes in a pull requests to a single localization. Reviewing pull
requests that change content in multiple localizations is problematic.

Follow [Suggesting Content Improvements](/docs/contribute/suggesting-improvements/)
to propose changes to that localization. The process is similar to proposing
changes to the upstream (English) content.

## Start a new localization

If you want the Kubernetes documentation localized into a new language, here's
what you need to do.

SIG Docs **recommends starting a new localization with at least four
contributors**. Because contributors can't review or approve their own pull
requests, a team of four or more ensures steady capacity for peer review and
ongoing maintenance even when individual availability changes.

Please organize your team with a sustainable workflow for long-term maintenance.
Upstream English documentation changes continuously, which regularly creates
outdated localized pages; if a localization is treated as a one-time effort,
stale content quickly accumulates. While SIG Docs helps new teams get started,
each localization team is responsible for translating and keeping its content
current over time.

You'll need to know the two-letter language code for your language. Consult the
[ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php)
to find your localization's two-letter language code. For example, the
two-letter code for Korean is `ko`.

If the language you are starting a localization for is spoken in various places
with significant differences between the variants, it might make sense to
combine the lowercased ISO-3166 country code with the language two-letter code.
For example, Brazilian Portuguese is localized as `pt-br`.

When you start a new localization, you must localize all the
[minimum required content](#minimum-required-content) before
the Kubernetes project can publish your changes to the live
website.

SIG Docs can help you work on a separate branch so that you
can incrementally work towards that goal.

### Find community

Let Kubernetes SIG Docs know you're interested in creating a localization! Join
the [SIG Docs Slack channel](https://kubernetes.slack.com/messages/sig-docs) and
the [SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations).
Other localization teams are happy to help you get started and answer your
questions.

Please also consider participating in the
[SIG Docs Localization Subgroup meeting](https://github.com/kubernetes/community/tree/main/sig-docs).
The mission of the SIG Docs localization subgroup is to work across the SIG Docs
localization teams to collaborate on defining and documenting the processes for
creating localized contribution guides. In addition, the SIG Docs localization
subgroup looks for opportunities to create and share common tools across
localization teams and identify new requirements for the SIG Docs Leadership
team.  If you have questions about this meeting, please inquire on the
[SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations).

You can also create a Slack channel for your localization in the
`kubernetes/community` repository. For an example of adding a Slack channel, see
the PR for [adding a channel for Persian](https://github.com/kubernetes/community/pull/4980).

### Join the Kubernetes GitHub organization

When you've opened a localization PR, you can become members of the Kubernetes
GitHub organization. Each person on the team needs to create their own
[Organization Membership Request](https://github.com/kubernetes/org/issues/new/choose)
in the `kubernetes/org` repository.

### Peer review and earning reviewer or approver roles

When starting a new localization, contributors do not immediately apply for
official reviewer (`sig-docs-**-reviews`) or approver (`sig-docs-**-owners`)
roles. Instead, new teams follow a staged onboarding process:

1. **Peer review among contributors**: Translate the
   [minimum required content](#minimum-required-content) manually first to build
   shared terminology and team consensus. Team members review each other's pull
   requests and, once satisfied with the translation quality, leave a comment
   such as `LGTM` (or `/lgtm` if already a Kubernetes GitHub organization member).
2. **Temporary approval support**: While your team is building its track record,
   the **SIG Docs Localization Subproject Leads** (`@kubernetes/sig-docs-localization-owners`)
   temporarily help with official pull request approvals (`/approve`) after your
   team's peer review is complete.
3. **Apply after demonstrating eligibility**: Once contributors have demonstrated
   eligibility through consistent contributions and peer reviews, eligible
   candidates can apply for reviewer or approver roles according to
   [Roles and responsibilities](/docs/contribute/participate/roles-and-responsibilities/).

### Add your localization team in GitHub

Once your team members have demonstrated eligibility for reviewer or approver
roles, add your Kubernetes localization team to
[`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/main/config/kubernetes/sig-docs/teams.yaml).
For an example of adding a localization team, see the PR to add the
[Spanish localization team](https://github.com/kubernetes/org/pull/685).

Members of `@kubernetes/sig-docs-**-owners` can approve PRs that change content
within (and only within) your localization directory: `/content/**/`. For each
localization, The `@kubernetes/sig-docs-**-reviews` team automates review
assignments for new PRs. Members of `@kubernetes/website-maintainers` can create
new localization branches to coordinate translation efforts. Members of
`@kubernetes/website-milestone-maintainers` can use the `/milestone`
[Prow command](https://prow.k8s.io/command-help) to assign a milestone to issues or PRs.

### Configure the workflow

Next, add a GitHub label for your localization in the `kubernetes/test-infra`
repository. A label lets you filter issues and pull requests for your specific
language.

For an example of adding a label, see the PR for adding the
[Italian language label](https://github.com/kubernetes/test-infra/pull/11316).

### Modify the site configuration

The Kubernetes website uses Hugo as its web framework. The website's Hugo
configuration resides in the
[`hugo.toml`](https://github.com/kubernetes/website/tree/main/hugo.toml)
file. You'll need to modify `hugo.toml` to support a new localization.

Add a configuration block for the new language to `hugo.toml` under the
existing `[languages]` block. The German block, for example, looks like:

```toml
[languages.de]
title = "Kubernetes"
languageName = "Deutsch (German)"
weight = 5
contentDir = "content/de"
languagedirection = "ltr"

[languages.de.params]
time_format_blog = "02.01.2006"
language_alternatives = ["en"]
description = "Produktionsreife Container-Orchestrierung"
languageNameLatinScript = "Deutsch"
```

The language selection bar lists the value for `languageName`. Assign "language
name in native script and language (English language name in Latin script)" to
`languageName`. For example, `languageName = "한국어 (Korean)"` or `languageName =
"Deutsch (German)"`.

`languageNameLatinScript` can be used to access the language name in Latin
script and use it in the theme. Assign "language name in latin script" to
`languageNameLatinScript`. For example, `languageNameLatinScript ="Korean"` or
`languageNameLatinScript = "Deutsch"`.

The `weight` parameter determines the order of languages in the language selection bar.
A lower weight takes precedence, resulting in the language appearing first. 
When assigning the `weight` parameter, it is important to examine the existing languages 
block and adjust their weights to ensure they are in a sorted order relative to all languages,
including any newly added language.

For more information about Hugo's multilingual support, see
"[Multilingual Mode](https://gohugo.io/content-management/multilingual/)".

### Add a new localization directory

Add a language-specific subdirectory to the
[`content`](https://github.com/kubernetes/website/tree/main/content) folder in
the repository. For example, the two-letter code for German is `de`:

```shell
mkdir content/de
```

You also need to create a directory inside `i18n` for
[localized strings](#site-strings-in-i18n); look at existing localizations
for an example.

For example, for German the strings live in `i18n/de/de.toml`.

### Localize the community code of conduct

Open a PR against the
[`cncf/foundation`](https://github.com/cncf/foundation/tree/main/code-of-conduct-languages)
repository to add the code of conduct in your language.

### Set up the OWNERS files

After your team has demonstrated eligibility and created the GitHub teams in
[Add your localization team in GitHub](#add-your-localization-team-in-github),
set the roles of each user contributing to the localization by creating an
`OWNERS` file inside the language-specific subdirectory with:

- **reviewers**: A list of kubernetes teams with reviewer roles, in this case,
- the `sig-docs-**-reviews` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **approvers**: A list of kubernetes teams with approvers roles, in this case,
- the `sig-docs-**-owners` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **labels**: A list of GitHub labels to automatically apply to a PR, in this
  case, the language label created in [Configure the workflow](#configure-the-workflow).

More information about the `OWNERS` file can be found at
[go.k8s.io/owners](https://go.k8s.io/owners).

The [Spanish OWNERS file](https://git.k8s.io/website/content/es/OWNERS), with
language code `es`, looks like this:

```yaml
# See the OWNERS docs at https://go.k8s.io/owners

# This is the localization project for Spanish.
# Teams and members are visible at https://github.com/orgs/kubernetes/teams.

reviewers:
- sig-docs-es-reviews

approvers:
- sig-docs-es-owners

labels:
- area/localization
- language/es
```

After adding the language-specific `OWNERS` file, update the [root
`OWNERS_ALIASES`](https://git.k8s.io/website/OWNERS_ALIASES) file with the new
Kubernetes teams for the localization, `sig-docs-**-owners` and
`sig-docs-**-reviews`.

For each team, add the list of GitHub users requested in
[Add your localization team in GitHub](#add-your-localization-team-in-github),
in alphabetical order.

```diff
--- a/OWNERS_ALIASES
+++ b/OWNERS_ALIASES
@@ -48,6 +48,14 @@ aliases:
     - stewart-yu
     - xiangpengzhao
     - zhangxiaoyu-zidif
+  sig-docs-es-owners: # Admins for Spanish content
+    - alexbrand
+    - raelga
+  sig-docs-es-reviews: # PR reviews for Spanish content
+    - alexbrand
+    - electrocucaracha
+    - glo-pena
+    - raelga
   sig-docs-fr-owners: # Admins for French content
     - perriea
     - remyleone
```

### Open a pull request

Next, [open a pull request](/docs/contribute/new-content/open-a-pr/#open-a-pr)
(PR) to add a localization to the `kubernetes/website` repository. The PR must
include all the [minimum required content](#minimum-required-content) before it
can be approved.

For an example of adding a new localization, see the PR to enable
[docs in French](https://github.com/kubernetes/website/pull/12548).

### Add a localized README file

To guide other localization contributors, add a new
[`README-**.md`](https://help.github.com/articles/about-readmes/) to the top
level of [kubernetes/website](https://github.com/kubernetes/website/), where
`**` is the two-letter language code. For example, a German README file would be
`README-de.md`.

Guide localization contributors in the localized `README-**.md` file.
Include the same information contained in `README.md` as well as:

- A point of contact for the localization project
- Any information specific to the localization

After you create the localized README, add a link to the file from the main
English `README.md`, and include contact information in English. You can provide
a GitHub ID, email address, [Slack channel](https://slack.com/), or another
method of contact. You must also provide a link to your localized Community Code
of Conduct.

### Launch your new localization

When a localization meets the requirements for workflow and minimum output, SIG
Docs does the following:

- Enables language selection on the website.
- Publicizes the localization's availability through
  [Cloud Native Computing Foundation](https://www.cncf.io/about/)(CNCF)
  channels, including the [Kubernetes blog](/blog/).

## Localize content

Localizing *all* the Kubernetes documentation is an enormous task. It's okay to
start small and expand over time.

### Minimum required content

At a minimum, all localizations must include:

Description | URLs
-----|-----
Home | [All heading and subheading URLs](/docs/home/)
Setup | [All heading and subheading URLs](/docs/setup/)
Tutorials | [Kubernetes Basics](/docs/tutorials/kubernetes-basics/), [Hello Minikube](/docs/tutorials/hello-minikube/)
Site strings | [All site strings](#site-strings-in-i18n) in a new localized TOML file
Releases | [All heading and subheading URLs](/releases)

Translated documents must reside in their own `content/**/` subdirectory, but otherwise, follow the
same URL path as the English source. For example, to prepare the
[Kubernetes Basics](/docs/tutorials/kubernetes-basics/) tutorial for translation into German,
create a subdirectory under the `content/de/` directory and copy the English source or directory:

```shell
mkdir -p content/de/docs/tutorials
cp -ra content/en/docs/tutorials/kubernetes-basics/ content/de/docs/tutorials/
```

Translation tools can speed up the translation process. For example, some
editors offer plugins to quickly translate text.

{{< caution >}}
AI-generated translation is insufficient on its own. Localization requires
fluency in the target language and extensive human review to meet minimum
standards of quality, in accordance with the Kubernetes
[AI Guidance](https://www.kubernetes.dev/docs/guide/pull-requests/#ai-guidance).
{{< /caution >}}

To ensure accuracy in grammar and meaning, members of your localization team
should carefully review all AI-assisted translations before publishing. See
[Using AI assistance and AGENTS.md](#using-ai-assistance-and-agents-md) for
details.

### Localize SVG images

The Kubernetes project recommends using vector (SVG) images where possible, as
these are much easier for a localization team to edit. If you find a raster
image that needs localizing, consider first redrawing the English version as
a vector image, and then localize that.

When translating text within SVG (Scalable Vector Graphics) images, it's
essential to follow certain guidelines to ensure accuracy and maintain
consistency across different language versions. SVG images are commonly
used in the Kubernetes documentation to illustrate concepts, workflows,
and diagrams.

1. **Identifying translatable text**: Start by identifying the text elements
   within the SVG image that need to be translated. These elements typically
   include labels, captions, annotations, or any text that conveys information.

1. **Editing SVG files**: SVG files are XML-based, which means they can be
   edited using a text editor. However, it's important to note that most of the
   documentation images in Kubernetes already convert text to curves to avoid font
   compatibility issues. In such cases, it is recommended to use specialized SVG
   editing software, such as Inkscape, for editing, open the SVG file and locate
   the text elements that require translation.

1. **Translating the text**: Replace the original text with the translated
   version in the desired language. Ensure the translated text accurately conveys
   the intended meaning and fits within the available space in the image. The Open
   Sans font family should be used when working with languages that use the Latin
   alphabet. You can download the Open Sans typeface from here:
   [Open Sans Typeface](https://fonts.google.com/specimen/Open+Sans).

1. **Converting text to curves**: As already mentioned, to address font
   compatibility issues, it is recommended to convert the translated text to
   curves or paths. Converting text to curves ensures that the final image
   displays the translated text correctly, even if the user's system does not
   have the exact font used in the original SVG.

1. **Reviewing and testing**: After making the necessary translations and
   converting text to curves, save and review the updated SVG image to ensure
   the text is properly displayed and aligned. Check
   [Preview your changes locally](/docs/contribute/new-content/open-a-pr/#preview-locally).

### Source files

Localizations must be based on the English files from a specific release
targeted by the localization team. Each localization team can decide which
release to target, referred to as the _target version_ below.

To find source files for your target version:

1. Navigate to the Kubernetes website repository at
   https://github.com/kubernetes/website.

1. Select a branch for your target version from the following table:

Target version | Branch
-----|-----
Latest version | [`main`](https://github.com/kubernetes/website/tree/main)
Previous version | [`release-{{< skew prevMinorVersion >}}`](https://github.com/kubernetes/website/tree/release-{{< skew prevMinorVersion >}})
Next version | [`dev-{{< skew nextMinorVersion >}}`](https://github.com/kubernetes/website/tree/dev-{{< skew nextMinorVersion >}})

The `main` branch holds content for the current release `{{< latest-version >}}`.
The release team creates a `{{< release-branch >}}` branch before the next
release: v{{< skew nextMinorVersion >}}.

### Site strings in i18n

Localizations must include the contents of
[`i18n/en/en.toml`](https://github.com/kubernetes/website/blob/main/i18n/en/en.toml)
in a new language-specific file. Using German as an example:
`i18n/de/de.toml`.

Add a new localization directory and file to `i18n/`. For example, with
German (`de`):

```bash
mkdir -p i18n/de
cp i18n/en/en.toml i18n/de/de.toml
```

Revise the comments at the top of the file to suit your localization, then
translate the value of each string. For example, this is the German-language
placeholder text for the search form:

```toml
[ui_search]
other = "Suchen"
```

Localizing site strings lets you customize site-wide text and features: for
example, the legal copyright text in the footer on each page.

### Language-specific localization guide

As a localization team, you can formalize the best practices your team follows
by creating a language-specific localization guide.

For example, see the
[Korean Localization Guide](/ko/docs/contribute/localization_ko/), which
includes content on the following subjects:

- Sprint cadence and releases
- Branch strategy
- Pull request workflow
- Style guide
- Glossary of localized and non-localized terms
- Markdown conventions
- Kubernetes API object terminology

### Using AI assistance and AGENTS.md

Once an established localization team has defined its glossary, style guide, and
review practices, the team can create a locale-specific `AGENTS.md` file to
provide reusable context and guardrails for AI tools (for drafting translations,
self-reviewing changes, or updating outdated content).

To set up `AGENTS.md` for your localization:

1. Copy [`content/AGENTS_TEMPLATE.md`](https://github.com/kubernetes/website/blob/main/content/AGENTS_TEMPLATE.md)
   to `content/<two-letter-code>/AGENTS.md`.
2. Customize the `[CUSTOMIZE]` sections with your team's glossary, formatting
   conventions, and review checklist while keeping the universal Hugo and
   Markdown structural rules intact.

For a practical example, see the Korean localization's
[`content/ko/AGENTS.md`](https://github.com/kubernetes/website/blob/main/content/ko/AGENTS.md)
alongside the [Korean Localization Guide](/ko/docs/contribute/localization_ko/).

Because `AGENTS.md` is placed under `content/<two-letter-code>/` rather than the
repository root, reference it directly in your prompt. For example:

- **Drafting a new translation**: `"Follow content/ko/AGENTS.md to draft a translation for content/en/docs/<path>.md."`
- **Updating outdated pages**: `"Follow content/ko/AGENTS.md and use scripts/l10n-outdatedness-triage.py to update a few Strong signal (Minor fix) pages."`
- **Reviewing a page**: `"Follow content/ko/AGENTS.md to review content/ko/docs/<path>.md."`

When using `AGENTS.md` and AI tools, please keep these community guidelines in
mind:

- **Follow the Kubernetes AI guidance**: Align with the
  [Kubernetes AI Guidance](https://www.kubernetes.dev/docs/guide/pull-requests/#ai-guidance)
  by contributing in languages you are fluent in and noting AI assistance in your
  pull request description.
- **Build team consensus first**: We encourage new teams to translate manually and
  agree on shared terminology and style through their first live release before
  adopting `AGENTS.md`.
- **Treat AI output as a draft**: Review generated content yourself to ensure
  accurate meaning, natural phrasing, valid Hugo shortcodes, and working links.
- **Coordinate large-scale contributions**: After your first live release, plan
  large-scale translations or updates as a team effort with full team review,
  and check in with the SIG Docs Localization Subproject Leads beforehand.

### Language-specific Zoom meetings

If the localization project needs a separate meeting time, contact a SIG Docs
Co-Chair or Tech Lead to create a new reoccurring Zoom meeting and calendar
invite. This is only needed when the team is large enough to sustain and require
a separate meeting.

Per CNCF policy, the localization teams must upload their meetings to the SIG
Docs YouTube playlist. A SIG Docs Co-Chair or Tech Lead can help with the
process until SIG Docs automates it.

## Branch strategy

Because localization projects are highly collaborative efforts, we
encourage teams to work in shared localization branches - especially
when starting out and the localization is not yet live.

To collaborate on a localization branch:

1. A team member of
   [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers)
   opens a localization branch from a source branch on
   https://github.com/kubernetes/website.

   Your team approvers joined the `@kubernetes/website-maintainers` team when
   you [added your localization team](#add-your-localization-team-in-github) to
   the [`kubernetes/org`](https://github.com/kubernetes/org) repository.

   We recommend the following branch naming scheme:

   `dev-<source version>-<language code>.<team milestone>`

   For example, an approver on a German localization team opens the localization
   branch `dev-1.12-de.1` directly against the `kubernetes/website` repository,
   based on the source branch for Kubernetes v1.12.

1. Individual contributors open feature branches based on the localization
   branch.

   For example, a German contributor opens a pull request with changes to
   `kubernetes:dev-1.12-de.1` from `username:local-branch-name`.

1. Approvers review and merge feature branches into the localization branch.

1. Periodically, an approver merges the localization branch with its source
   branch by opening and approving a new pull request. Be sure to squash the
   commits before approving the pull request.

Repeat steps 1-4 as needed until the localization is complete. For example,
subsequent German localization branches would be: `dev-1.12-de.2`,
`dev-1.12-de.3`, etc.

Teams must merge localized content into the same branch from which the content
was sourced. For example:

- A localization branch sourced from `main` must be merged into `main`.
- A localization branch sourced from `release-{{% skew "prevMinorVersion" %}}`
  must be merged into `release-{{% skew "prevMinorVersion" %}}`.

{{< note >}}
If your localization branch was created from `main` branch, but it is not merged
into `main` before the new release branch `{{< release-branch >}}` created,
merge it into both `main` and new release branch `{{< release-branch >}}`. To
merge your localization branch into the new release branch
`{{< release-branch >}}`, you need to switch the upstream branch of your
localization branch to `{{< release-branch >}}`.
{{< /note >}}

At the beginning of every team milestone, or during regular maintenance, it's
helpful to identify and prioritize outdated localized pages as upstream English
documentation evolves. You can use the following scripts in
[`scripts/`](https://github.com/kubernetes/website/tree/main/scripts):

- [`l10n-outdatedness-triage.py`](https://github.com/kubernetes/website/tree/main/scripts#l10n-outdatedness-triagepy)
  generates an outdatedness triage report by considering both structural
  characteristics and modification timestamps between localized pages and their
  English source. Teams can also pair this triage report with their `AGENTS.md`
  to assist in updating outdated pages.
- [`lsync.sh`](https://github.com/kubernetes/website/tree/main/scripts#lsyncsh)
  checks whether the English version of a specific file or directory has changed
  since the localized version was last committed, and displays the git diff.

While only approvers can open a new localization branch and merge pull requests,
anyone can open a pull request for a new localization branch. No special
permissions are required.

For more information about working from forks or directly from the repository,
see ["fork and clone the repo"](#fork-and-clone-the-repo).

## Upstream contributions

SIG Docs welcomes upstream contributions and corrections to the English source.
