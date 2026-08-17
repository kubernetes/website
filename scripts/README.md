# Development scripts for Kubernetes documentation

| Script                  | Description                                                                                                                           |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `find_pr.py`            | Find what GitHub pull requests touch a given file.                                                                                    |
| `upstream_changes.py`   | Find what changes occurred between two versions.                                                                                      |
| `test_examples.sh`      | This script tests whether a change affects example files bundled in the website.                                                      |
| `kyaml.sh`              | This script renders a few of a language's example manifests a second time, as KYAML, so their pages can carry both dialects.          |
| `check-headers-file.sh` | This script checks the headers if you are in a production environment.                                                                |
| `diff_l10n_branches.py` | This script generates a report of outdated contents in `content/<l10n-lang>` directory by comparing two l10n team milestone branches. |
| `fetch_kubecon_events.py` | This script fetches upcoming KubeCon events from the Linux Foundation calendar and writes `data/events/kubecon.yaml`.               |
| `l10n-outdatedness-triage.py` | This script compares localized Markdown files against their English source and classifies outdatedness triage signals as strong, moderate, or no signal. |
| `hash-files.sh`         | This script emits as hash for the files listed in $@                                                                                  |
| `linkchecker.py`        | This a link checker for Kubernetes documentation website.                                                                             |
| `lsync.sh`              | This script checks if the English version of a page has changed since a localized page has been committed.                            |
| `replace-capture.sh`    | This script sets K8S_WEBSITE in your env to your docs website root or rely on this script to determine it automatically               |
| `check-ctrlcode.py`     | This script finds control-code(0x00-0x1f) in text files.                                                                              |
| `ja/verify-spelling.sh` | This script finds Japanese words that are against the guideline.                                                                      |



## Requirements

Some of those scripts have external requirements. You can install them with the following commands:

```
python3 -m pip install -r requirements.txt
```

## find_pr.py

```
$ ./find_pr.py --help
Usage: find_pr.py [OPTIONS] PATH

  Find what GitHub pull requests touch a given file.

  ex: ./find_pr.py --tags "language/fr" "content/fr/_index.html"

Options:
  --tags TEXT          Tags of PullRequest (Can be passed multiple times)
  --token TEXT         GitHub API token. (Default env variable GITHUB_TOKEN)
  --last-n-pr INTEGER  Last n-th PullRequests
  --help               Show this message and exit.
```

## upstream_changes.py

```
$ ./upstream_changes.py --help
Usage: upstream_changes.py [OPTIONS] PATH

  Find what changes occurred between two versions

  ex: ./upstream_changes.py content/fr/_index.html

Options:
  --reference TEXT  Specify the reference version of the file. Default to the
                    English one.
  --git-path TEXT   Specify git path
  --help            Show this message and exit.
```

## test_examples.sh

This script tests whether a change affects example files bundled in the website.

To install the dependencies:

    $ ./scripts/test_examples.sh install

To run the examples:

    $ ./scripts/test_examples.sh run

## kyaml.sh

Example manifests under `content/<lang>/examples` are conventional YAML. They
are the source of truth, they are the only rendering that can carry comments,
and they are what `https://k8s.io/examples/...` serves.

This script renders a few of them a second time as
[KYAML](https://kubernetes.io/docs/reference/encodings/kyaml/) into
`content/<lang>/examples-kyaml`, so that the `code_sample` shortcode can offer
those examples in either dialect. The generated tree is not published and should
never be edited by hand.

Which manifests get a second rendering is `data/kyaml_trial.yaml`, and it is
short on purpose. Converting the site is an explicit non-goal of
[KEP-5295](https://www.kubernetes.dev/resources/keps/5295/): "Require projects
to migrate to KYAML by default." An example that is not on the list renders in
one pane, exactly as it always has.

The shortcode reads the same list, so a rendering cannot exist for a page that
will not show it, and a page cannot ask for one that was never generated.

Readers do not see any of this yet: the control that switches dialect is hidden,
so conventional YAML is all anyone gets until SIG Docs decides otherwise. Both
panes are still rendered and checked, so the machinery is exercised from the day
it merges rather than the day it is turned on.

To regenerate after changing a listed example (`make kyaml` is the same thing):

    $ ./scripts/kyaml.sh generate

To check the committed tree (`make verify-kyaml`):

    $ ./scripts/kyaml.sh verify

`verify` fails if a name on either list points at nothing, if the generated tree
is stale, and then runs `scripts/kyaml/kyaml_test.go`, which decodes every
manifest and its rendering and fails if the two stop describing the same
objects. Formatting, quoting and comments differ between the dialects; the
objects a reader would create may not.

Neither check subsumes the other. The staleness diff compares a freshly rendered
tree against the committed one, so it cannot notice a formatter that changes
meaning -- both sides come from the same formatter. The test compares each
manifest against its rendering, so it can.

`scripts/test_examples.sh run` runs `verify`, and Prow runs that whenever a pull
request touches `content/<lang>/examples` or `content/<lang>/examples-kyaml`.

### What is in scope

Manifests under `content/<lang>/examples` only, and of those, only the ones in
`data/kyaml_trial.yaml`. Not the fenced ` ```yaml ` blocks inside pages: those
are frequently partial or illustrative rather than manifests a reader applies,
and KYAML cannot express an elision.

English only, so far. Other languages get no KYAML rendering until their team
opts in with `./scripts/kyaml.sh generate <lang>`. The shortcode derives the
rendering's path from the manifest it actually read, so a localized page never
pairs its own manifest with one derived from a different translation, and a
manifest on the list that a locale has not translated is simply skipped.

Two kinds of manifest get no KYAML rendering even when they are listed:

* those that embed a file in a block scalar (`|` or `>`), because KYAML is flow
  style and block scalars are not legal inside flow style, so the embedded file
  would become one quoted string with escaped line breaks;
* the `SKIP` list in the script, which holds manifests the formatter cannot
  parse. An entry there opts a file out of every check, so it is the one place
  a manifest can hide; keep it to files with a mechanical reason.

### Why the KYAML is a generated tree, and not a .kyaml extension

Every file under `content/<lang>/examples` is published at the matching
`https://k8s.io/examples` URL, and the English docs cite those URLs in over two
hundred `kubectl apply -f` commands. Naming the dialect in the extension,
`simple-pod.kyaml` beside `simple-pod.yaml`, would mean a second published URL
per manifest and a second file for contributors to keep in step.

Generating into a sibling tree that Hugo does not publish keeps one URL per
manifest, and keeps the manifest a reader fetches the same as the one the page
shows. Each pane's filename still links to the exact file it shows, so a reader
who wants the KYAML can reach it.

## check-headers-file.sh

This script checks the headers if you are in a production environment.

    ./scripts/check-headers-file.sh

## diff_l10n_branches.py

```
$ scripts/diff_l10n_branches.py --help
Usage: diff_l10n_branches.py [OPTIONS] L10N_LANG L_COMMIT R_COMMIT

  This script generates a report of outdated contents in `content/<l10n-
  lang>` directory by comparing two l10n team milestone branches.

  L10n team owners can open a GitHub issue with the report generated by this
  script when they start a new team milestone.

  ex: `scripts/diff_l10n_branches.py ko dev-1.15-ko.3 dev-1.15-ko.4`

Options:
  --src-lang TEXT  Source language
  --help           Show this message and exit.
```

## fetch_kubecon_events.py

This script fetches upcoming KubeCon + CloudNativeCon events from the
Linux Foundation events calendar and regenerates `data/events/kubecon.yaml`,
which powers the events list on the site homepage.

    $ python3 scripts/fetch_kubecon_events.py

## l10n-outdatedness-triage.py

This script compares localized Markdown files in `content/<l10n-lang>` against
their English source files and assigns signal-based triage categories.

It checks page structure and outdatedness indicators such as line count
differences, missing headings, missing code blocks, missing anchors,
Kubernetes version references, and API / feature-state values. It does not
check translation meaning or quality, so maintainers should manually verify
flagged results.

The status labels are triage categories, not final judgments:

- `Orphan`: localized file has no matching English source; verify whether
  it was renamed, removed, or intentionally locale-specific.
- `Strong signal`: strong indicators suggest the localized page likely
  needs review or update.
- `Moderate signal`: some indicators were found, but the page needs
  manual verification.
- `No signal`: no outdatedness indicators were found by this tool; this
  does not guarantee the translation is fully current.

It writes a per-locale Markdown report, and when scanning multiple locales,
also writes an index report linking to each per-locale report.

```bash
# Scan all non-English locales
python3 scripts/l10n-outdatedness-triage.py

# Scan specific locales
python3 scripts/l10n-outdatedness-triage.py --lang ko ja zh-cn

# Write reports to a specific directory
python3 scripts/l10n-outdatedness-triage.py --output-dir /tmp/l10n

# Include GitHub links and per-file indicator details
python3 scripts/l10n-outdatedness-triage.py --lang ko --link web --verbose

# Show the full option list
python3 scripts/l10n-outdatedness-triage.py --help
```

## hash-files.sh

This script emits as hash for the files listed in $@.

    $ ./scripts/hash-files.sh
    
## linkchecker.py

This a link checker for Kubernetes documentation website.
- If the language for the files scanned is not English (`en`), we check if you
  are actually using the localized links. For example, if you specify a filter
  similar to as `content/zh-cn/docs/**/*.md`, we check if the English version
  exists AND if the Chinese version exists as well. A checking record is
  produced if the link can use the localized version.
- If the language specified is not English (`en`), a checking record is produced,
  and the `-w` switch is used, the script will perform in-place substitutions
  for links that have the format `/docs` and currently have a localized version
  available. This is an experimental feature and aims to reduce the amount of
  work required to update links to point to localized content. It currently
  works for Markdown files only.
```

Usage: linkchecker.py -h

Cases handled:

- [foo](#bar)                         : ignored currently
+ [foo](http://bar)                   : insecure links to external site
+ [foo](https://k8s.io/website/...)   : hardcoded site domain name

+ [foo](/<lang>/docs/bar/...)  : where <lang> is not 'en'
  + /<lang>/docs/bar           : contains shortcode, so ignore, or
  + /<lang>/docs/bar           : is a image link (ignore currently), or
  + /<lang>/docs/bar           : points to shared (non-localized) page, or
  + /<lang>/docs/bar.md        : exists for current lang, or
  + /<lang>/docs/bar/_index.md : exists for current lang, or
  + /<lang>/docs/bar/          : is a redirect entry, or
  + /<lang>/docs/bar           : is something we don't understand, then ERR

+ [foo](/docs/bar/...)
  + /docs/bar                : contains shortcode, so ignore, or
  + /docs/bar                : is a image link (ignore currently), or
  + /docs/bar                : points to a shared (non-localized) page, or
  + /docs/bar.md             : exists for current lang, or
  + /docs/bar/_index.md      : exists for current lang, or
  + /docs/bar                : is a redirect entry, or
  + /docs/bar                : is something we don't understand

+ [foo](<lang>/docs/bar/...) : leading slash missing for absolute path

+ [foo](docs/bar/...)        : leading slash missing for absolute path

```
## lsync.sh

This script checks if the English version of some localized contents have changed 
since a localized version has been committed.

The following example checks a single file:

    ./scripts/lsync.sh content/zh-cn/docs/concepts/_index.md

The following command checks a subdirectory:

    ./scripts/lsync.sh content/zh-cn/docs/concepts/

## check-ctrlcode.py

This script finds control-code(0x00-0x1f) in text files.
It will display illegal character in browser.

```
Usage: ./check-ctrlcode.py <dir> <ext>

  <dir>    Specify the directory to check.
  <ext>    Specify the extension to check.

For example, we can execute as following.

  ./check-ctrlcode.py ../content/en/ .md

The output is following format.

  "{0} <L{1}:{2}:{3}>: {4}"

  {0} : The path of file that a control-code exists.
  {1} : The line number that a control-code exists.
  {2} : The column number that a control-code exists.
  {3} : The found control-code.
  {4} : The one-line strings in the file.
```

## ja/verify-spelling.sh

This script finds Japanese words that are against the guideline[1]
[1] https://kubernetes.io/ja/docs/contribute/localization/#%E9%A0%BB%E5%87%BA%E5%8D%98%E8%AA%9E

```
Usage: ./ja/verify-spelling.sh
```
