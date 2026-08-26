---
title: Generating Reference Documentation for a Release
linkTitle: Release generation
content_type: task
weight: 15
---

<!-- overview -->

This page shows how to regenerate every set of Kubernetes reference documentation
for a new release, and how to divide the generated output into pull requests that
reviewers can handle one at a time.

Work through the sections in order. Each reference set has its own section that
builds it, copies it into your website clone, and ends with a page to check, so
you can finish one set before you start the next. The [summary](#summary) at the
end lists every target, its output, and the pull requests to open.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Set up the local repositories

You need local clones of `kubernetes/website` and `kubernetes-sigs/reference-docs`.

If you have not already forked and cloned `kubernetes/website`, see
[Work from a local clone](/docs/contribute/new-content/open-a-pr/#fork-the-repo).
Clone `reference-docs`:

```shell
git clone https://github.com/kubernetes-sigs/reference-docs
```

The remaining steps refer to your `kubernetes/website` clone as `<web-base>` and
your `reference-docs` clone as `<rdocs-base>`.

## Set build variables

Set these in your shell. They apply to every `make` command in the steps that
follow.

```shell
export K8S_WEBROOT=<your-path-to>/website     # your website clone (<web-base>)
export K8S_RELEASE={{< skew currentVersionAddMinor 1 >}}.0
```

Set `K8S_RELEASE` to a full release version, such as `{{< skew currentVersionAddMinor 1 >}}.0`
or `{{< skew currentVersionAddMinor 1 >}}.0-rc.1`. The build targets derive the versioned
directory name, such as `v{{< skew currentVersionAddMinor 1 "_" >}}`, from the
major and minor version.

## Create the versioned directories

Run this in `<rdocs-base>`:

```shell
make createversiondirs
```

This creates the configuration directory for the new release under
`gen-apidocs/config/`, copying `config.yaml` from the previous release.

You rarely need to edit that file. The settings that change with every release,
the API groups and the list of resources, are empty in it: the build targets on
this page pass `--auto-detect`, so the generator reads them from `swagger.json`.
What stays in the file is operation naming and exclusion, which follows the API
machinery rather than the API surface.

When the generated reference looks wrong, fix the cause
[upstream](/docs/contribute/generate-ref-docs/contribute-upstream/) where you
can: descriptions and deprecation notices come from Go comments in
`kubernetes/kubernetes`, and a fix there reaches every reader of that API. Edit
`config.yaml` only for what the generator alone decides, such as an untitled
operation (`operation_categories`), an endpoint that the reference should not
publish (`excluded_operations`), or a group whose operation IDs spell it
differently from its resources (`operation_group_map`). Each entry is carried
into every later release, so keep the file lean.

## Fetch the OpenAPI specification

The API reference generator reads `gen-apidocs/config/<version>/swagger.json`.
The specification that `kubernetes/kubernetes` commits is built with the
`OpenAPIEnums` feature gate turned off, so it omits the allowed values of
enumerated fields, and a reference built from it omits them too.
It's better to generate a reference that does list allowed values, so you
take some additional steps to make that happen.

Choose one of the following two options.

### Option 1: Generate the specification from source

Use this option unless you cannot meet the requirements below. It needs no
`kubernetes/kubernetes` clone of your own, it leaves any clone you already have
untouched, and it produces a specification that includes enum values.

```shell
make updateapispec-enums-from-source
```

The target shallow-clones `kubernetes/kubernetes` at tag `v$K8S_RELEASE` into a
temporary directory, turns on `OpenAPIEnums=true` in that checkout only, runs the
upstream `hack/update-openapi-spec.sh`, copies the resulting specification into
the versioned configuration directory, checks that it contains enum values, and
removes the checkout. Beyond the tools in the prerequisites, it needs:

* `jq`, `curl`, and `openssl` on your `PATH`
* network access, to clone the tag and to download Go modules and etcd
* free TCP ports 2379 and 8050

The upstream script starts etcd on port 2379 and a temporary API server on port
8050; set `ETCD_PORT` or `API_PORT` if either is taken. It downloads its own copy
of etcd and builds `kube-apiserver`, so expect the first run to take several
minutes.

To keep the temporary checkout and the generation log for troubleshooting:

```shell
KEEP_TMP=1 make updateapispec-enums-from-source
```

### Option 2: Copy the committed specification from a local clone

This option needs a local `kubernetes/kubernetes` clone, and it copies the
specification much faster.

{{< note >}}
The specification committed in `kubernetes/kubernetes` is generated with
`OpenAPIEnums=false`. In your `kubernetes/kubernetes` clone, set
`OpenAPIEnums=true` in `hack/update-openapi-spec.sh` before you regenerate the
specification. Without it, the specification carries no enum values, and the
published API reference omits the possible values of every enumerated field.
{{< /note >}}

In your `kubernetes/kubernetes` clone, run `hack/update-openapi-spec.sh` and
commit the regenerated `api/openapi-spec/swagger.json` at tag `v$K8S_RELEASE`.
Then copy it into `reference-docs`:

```shell
export K8S_ROOT=<your-path-to>/kubernetes
cd <rdocs-base>
make updateapispec
```

The target reads the file as it is committed at that tag, not the file in your
working tree. This is the only step on this page that reads `K8S_ROOT`.

### Check the specification

Whichever option you use, you can check a specification for enum values at any
time:

```shell
./hack/verify-enum-swagger.sh gen-apidocs/config/<version>/swagger.json
```

## Start the local preview

Start the preview once, in a second terminal, and leave it running. Hugo reloads
each page as the copy targets replace it, so you can check each reference set as
soon as you generate it.

```shell
cd <web-base>
git submodule update --init --recursive --depth 1   # if not already done
make container-serve
```

Hugo serves the preview at `http://localhost:1313/`.

{{< note >}}
Start each set from an up-to-date branch in `<web-base>`, generate it, check it in
the preview, and commit it. [Pull requests](#pull-requests) lists what to open for
each set, when to open it, and how to describe it.
{{< /note >}}

## Generate the Kubernetes API reference

`gen-apidocs` builds this set, the HTML API reference, from the OpenAPI
specification you fetched. The build output goes to `gen-apidocs/build/html/`
before the target copies it.

```shell
cd <rdocs-base>
make copyapi
```

The target writes two files to `<web-base>`:

```
static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/index.html
static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/js/navData.js
```

Check `/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/` in the
preview. Open a resource such as Pod and search the page for
`Possible enum values`, which confirms that the specification carried the enum
values through.

See [Pull requests](#pull-requests) for what to open for this set.

## Generate the API reference pages in Markdown

`gen-apidocs` also builds this set, the Markdown API reference that Hugo renders
as regular pages, from the same specification. The build output goes to
`gen-apidocs/build/markdown/`.

```shell
cd <rdocs-base>
make copyapimd
```

The target replaces `<web-base>/content/en/docs/reference/kubernetes-api/` and
keeps the `_index.md` that people maintain by hand.

Check `/docs/reference/kubernetes-api/` in the preview. Compare the number of
generated pages with the previous release:

```shell
find <web-base>/content/en/docs/reference/kubernetes-api -name '*.md' | wc -l
```

See [Pull requests](#pull-requests) for what to open for this set.

## Generate the component reference

`gen-compdocs` builds from `k8s.io/kubernetes` and from the `k8s.io` staging
modules that `go.mod` pins with `replace` directives. `go get` updates the first
and leaves the rest, so move the whole set at once:

```shell
cd <rdocs-base>/gen-compdocs
STAGING=v0.${K8S_RELEASE#*.}
go get k8s.io/kubernetes@v$K8S_RELEASE
KK=$(go list -m -f '{{.Dir}}' k8s.io/kubernetes)

# every staging module of this release
for m in $(awk '/=> \.\/staging\/src\//{print $1}' "$KK/go.mod"); do
  go mod edit -replace="$m=$m@$STAGING" -require="$m@$STAGING"
done

# entries left from a release with a different set of staging modules
for m in $(go mod edit -json | jq -r '.Replace[].Old.Path'); do
  grep -q "$m => ./staging/src/$m" "$KK/go.mod" ||
    go mod edit -dropreplace="$m" -droprequire="$m"
done

go mod tidy
go mod edit -go=$(go list -m -f '{{.GoVersion}}' k8s.io/kubernetes)
go mod tidy
```

{{< note >}}
If `go get` or `go mod tidy` reports `unknown revision` or a 404 from
`sum.golang.org` for a `k8s.io` module, the staging modules for this release are
not published yet. They follow the `kubernetes/kubernetes` tag by some hours.
Check with:

```shell
git ls-remote --tags https://github.com/kubernetes/api.git "v0.${K8S_RELEASE#*.}"
```

An empty result means you wait. This applies to the configuration API reference
as well. The two API reference sets read only the OpenAPI specification, so you
can generate those meanwhile.
{{< /note >}}

The loops read the module set from `kubernetes/kubernetes`, because releases add
and remove staging modules and `go.mod` can still list ones from an older
release. The `go` directive comes last: while old modules are still in the graph,
`go mod tidy` raises it again.

Check what moved:

```shell
git diff go.mod
```

Every `k8s.io` requirement, every `replace`, and the `go` directive should now
name the new release. Requirements outside the staging set, such as
`k8s.io/klog/v2` and the Goldmark packages, keep their own versions.

Then build and copy the core component pages:

```shell
cd <rdocs-base>
make copycomp-core
```

`gen-compdocs` writes every component page to `gen-compdocs/build/`, and the
target copies `kube-apiserver.md`, `kube-controller-manager.md`,
`kube-scheduler.md`, `kube-proxy.md`, and `kubelet.md` from there to
`<web-base>/content/en/docs/reference/command-line-tools-reference/`.

Check `/docs/reference/command-line-tools-reference/` in the preview.

See [Pull requests](#pull-requests) for what to open for this set.

{{< note >}}
The component reference, kubectl, and kubeadm are three separate pull requests,
even though `gen-compdocs` produces all three. Each `copycomp-*` target rebuilds
every component page first, which takes a few minutes. To build once and copy all
three sets, run `make copycomp`, then split the result into three branches.
{{< /note >}}

## Generate the kubectl reference

The kubectl pages come from the same `gen-compdocs` build as the component
reference, and belong in their own pull request.

```shell
cd <rdocs-base>
make copycomp-kubectl
```

The target writes `kubectl.md` and a directory for each subcommand to
`<web-base>/content/en/docs/reference/kubectl/generated/`, and keeps the
`_index.md` that people maintain by hand.

Check `/docs/reference/kubectl/generated/` in the preview, and open a subcommand
page such as `kubectl apply`.

See [Pull requests](#pull-requests) for what to open for this set.

## Generate the kubeadm reference

The kubeadm pages also come from `gen-compdocs`, and belong in their own pull
request.

```shell
cd <rdocs-base>
make copycomp-kubeadm
```

The target writes `kubeadm.md` and a directory for each subcommand to
`<web-base>/content/en/docs/reference/setup-tools/kubeadm/generated/`, and keeps
the `_index.md` and `README.md` that people maintain by hand.

Check `/docs/reference/setup-tools/kubeadm/generated/` in the preview.

See [Pull requests](#pull-requests) for what to open for this set.

## Generate the configuration API reference

`genref` reads the Go configuration types of each component from the `k8s.io`
staging modules. It has no `replace` directives, so the requirements alone decide
which release you document:

```shell
cd <rdocs-base>/genref
STAGING=v0.${K8S_RELEASE#*.}
OLD=$(go mod edit -json | jq -r '.Require[] | select(.Path=="k8s.io/api") | .Version')

# every k8s.io module pinned to the previous release
go get $(go mod edit -json | jq -r --arg v "$OLD" --arg s "$STAGING" \
  '.Require[] | select(.Version==$v and (.Path|startswith("k8s.io/"))) | .Path + "@" + $s')

go mod tidy
go mod edit -go=$(go list -m -f '{{.GoVersion}}' k8s.io/api)
go mod tidy
```

Selecting by the old version picks up the staging modules and leaves
`k8s.io/klog/v2`, `k8s.io/gengo`, and the other independent repositories alone.
Check what moved:

```shell
git diff go.mod
```

Also update the release in the `externalPackages` link target in
`genref/config.yaml`, which points readers at the published API reference.

### Check for new API versions

`genref` generates one page for each entry in `genref/config.yaml`, and each
entry names a Go package and a path that ends in an API version:

```yaml
  - name: kubelet-config
    title: Kubelet Configuration (v1)
    package: k8s.io/kubelet
    path: config/v1
```

A component that starts serving a new version of its configuration API adds a
version directory in its Go source. List the version directories of a component
to see what exists in this release:

```shell
cd <rdocs-base>/genref
go mod download
ls "$(go list -m -f '{{.Dir}}' k8s.io/kubelet)/config"
```

To compare every entry in `config.yaml` against the source at once, run:

```shell
awk '$1=="package:"{pkg=$2} $1=="path:"{print pkg, $2}' config.yaml | sort -u |
while read -r pkg path; do
  dir=$(go list -m -f '{{.Dir}}' "$pkg" 2>/dev/null) || continue
  parent=$(dirname "$path")
  for v in $(find "$dir/$parent" -maxdepth 1 -mindepth 1 -type d -name 'v[0-9]*'); do
    grep -q "path: $parent/$(basename "$v")\$" config.yaml ||
      echo "$pkg $parent/$(basename "$v")"
  done
done | sort -u
```

Each line is a candidate, not a gap to fill: several older versions are left out
on purpose, and the comments in `config.yaml` record why. Add an entry when a
component serves a version that readers configure, and keep the entry for an
older version while the component still serves it.

### Build and copy the pages

```shell
cd <rdocs-base>
make copyconfigapi
```

`genref` writes the generated pages to `genref/output/md/`, and the target sorts
them as it copies: most go to `content/en/docs/reference/config-api/`, the metrics
APIs go to `content/en/docs/reference/external-api/`, because the project defines
them but does not serve them from the API server, and the pages the website does
not publish are skipped.

Check both sections in the preview, and confirm that no page you published for
the previous release disappeared:

```shell
cd <web-base>
git status content/en/docs/reference/config-api/ content/en/docs/reference/external-api/
```

See [Pull requests](#pull-requests) for what to open for this set.

## Summary

{{< table caption="Reference sets, the generator that builds each one, and where its output lands" >}}
| Reference set | Generator in `<rdocs-base>` | Target | Output in `<web-base>` |
| --- | --- | --- | --- |
| Kubernetes API, HTML | `gen-apidocs` | `make copyapi` | `static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/` |
| Kubernetes API, Markdown | `gen-apidocs` | `make copyapimd` | `content/en/docs/reference/kubernetes-api/` |
| Components | `gen-compdocs` | `make copycomp-core` | `content/en/docs/reference/command-line-tools-reference/` |
| kubectl | `gen-compdocs` | `make copycomp-kubectl` | `content/en/docs/reference/kubectl/generated/` |
| kubeadm | `gen-compdocs` | `make copycomp-kubeadm` | `content/en/docs/reference/setup-tools/kubeadm/generated/` |
| Configuration APIs | `genref` | `make copyconfigapi` | `content/en/docs/reference/config-api/`, `content/en/docs/reference/external-api/` |
{{< /table >}}

Each copy target builds first. To build every set without copying anything into
your website clone, run `make api apimd comp configapi`.

### Pull requests

Each reference set gets its own website pull request, six in all, and the
generator side takes three. Open a website pull request together with the
`reference-docs` pull request it needs, and hold the website one until that
merges.

{{< table caption="Pull requests to open for each reference set" >}}
| Reference set | Pull request to `kubernetes-sigs/reference-docs` | Pull request to `kubernetes/website` |
| --- | --- | --- |
| Kubernetes API, HTML | `gen-apidocs/config/<version>/`, the configuration and the specification: one pull request for both API sets | `Update the Kubernetes API reference for v{{< skew currentVersionAddMinor 1 >}}` |
| Kubernetes API, Markdown | the same `gen-apidocs` pull request | `Update the generated API reference pages for v{{< skew currentVersionAddMinor 1 >}}` |
| Components | `gen-compdocs/go.mod` and `go.sum`: one pull request for the components, kubectl, and kubeadm sets | `Update the component reference for v{{< skew currentVersionAddMinor 1 >}}` |
| kubectl | the same `gen-compdocs` pull request | `Update the kubectl reference for v{{< skew currentVersionAddMinor 1 >}}` |
| kubeadm | the same `gen-compdocs` pull request | `Update the kubeadm reference for v{{< skew currentVersionAddMinor 1 >}}` |
| Configuration APIs | `genref/go.mod`, `genref/config.yaml`, and `genref/output/md/`: one pull request | `Update the configuration API reference for v{{< skew currentVersionAddMinor 1 >}}` |
{{< /table >}}

In each website pull request, say how you generated the output, so that a
reviewer can reproduce it:

```text
Regenerated the kubectl reference for v{{< skew currentVersionAddMinor 1 >}}.0.

- Generated with `make copycomp-kubectl` from kubernetes-sigs/reference-docs at commit <commit>
- Generator changes: kubernetes-sigs/reference-docs#<pull request>
- Generated files only, with no hand edits
```

For the two API reference sets, add how you produced the OpenAPI specification,
because the generated output does not show it: `generated from source with
OpenAPIEnums=true`, or copied from a clone.

{{< caution >}}
Do not hand-edit generated pages. The next release overwrites the edit. Fix the
wording [in the upstream project](/docs/contribute/generate-ref-docs/contribute-upstream/)
or in the generator instead.
{{< /caution >}}

## {{% heading "whatsnext" %}}

* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Generating Reference Documentation for Configuration APIs](/docs/contribute/generate-ref-docs/config-api/)
* [Generating Reference Pages for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
* [Generating Reference Documentation for Metrics](/docs/contribute/generate-ref-docs/metrics-reference/)
* [Contributing to the Upstream Kubernetes Code](/docs/contribute/generate-ref-docs/contribute-upstream/)
