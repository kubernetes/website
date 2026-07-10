---
title: Generating Reference Documentation for the Kubernetes API
content_type: task
weight: 50
---

<!-- overview -->

This page explains how you can generate an updated version of the Kubernetes API
reference documentation. It is aimed at people who are contributing to Kubernetes.

The [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
`gen-apidocs` generator builds the API reference from the
[Kubernetes OpenAPI spec](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json).

If you find bugs in the generated content, you most likely need to
[fix them upstream](/docs/contribute/generate-ref-docs/contribute-upstream/).

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Set up the local repositories

You need local clones of `kubernetes/website` and `kubernetes-sigs/reference-docs`.
You do not need a local `kubernetes/kubernetes` checkout — the spec-preparation
step fetches it for you.

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
follow, whichever directory you run it from.

```shell
export K8S_WEBROOT=/path/to/your/website   # your website clone (<web-base>)
export K8S_RELEASE=1.36.0                  # the release you want to build
```

## Prepare the OpenAPI spec

The `swagger.json` checked into `kubernetes/kubernetes` is missing many enum
values that the reference needs. The `updateapispec-enums-from-source` target
regenerates an enum-complete spec: it shallow-clones the release tag into a
temporary directory, enables enum generation, verifies the result, and removes
the checkout — so you never maintain a local `kubernetes/kubernetes` clone.

From `<rdocs-base>` (your `reference-docs` clone):

```shell
cd <rdocs-base>
make updateapispec-enums-from-source
```

{{< note >}}
This step needs network access and the OpenAPI build prerequisites that
`kubernetes/kubernetes` uses (for example, `etcd`). Set `KEEP_TMP=1` to keep the
temporary checkout for debugging.
{{< /note >}}

## Build and publish the reference

`gen-apidocs` auto-detects API groups and versions from `swagger.json`, so there
is no per-release `config.yaml` to edit. From `<rdocs-base>`, build the backend
you need and copy it into `<web-base>`:

```shell
cd <rdocs-base>
make copyapimd    # Hugo-native Markdown -> <web-base>/content/en/docs/reference/kubernetes-api/
make copyapi      # single-page HTML     -> <web-base>/static/docs/reference/generated/kubernetes-api/<version>/
```

The first `make` run downloads the Go module dependencies, which can take a few
minutes.

`gen-apidocs` produces both backends. The older `gen-resourcesdocs` generator,
which once produced the Markdown reference, is deprecated. However, you may
see pages that mention `gen-resourcesdocs` because those guides are not yet
updated.

Check what changed in your website clone:

```shell
cd <web-base>
git status
```

## Test the API reference locally

Preview your changes:

```shell
cd <web-base>
git submodule update --init --recursive --depth 1   # if not already done
make container-serve
```

Using a web browser, open the local preview of the Kubernetes website, and check the pages you updated.
Hugo serves that local preview at http://localhost:1313/
so the page to check is: http://localhost:1313/docs/reference/kubernetes-api/

## Commit the changes

In `<web-base>`, run `git add` and `git commit`, then open a
[pull request](/docs/contribute/new-content/open-a-pr/) to
[kubernetes/website](https://github.com/kubernetes/website). Monitor the pull
request and respond to review comments until it is merged.

## {{% heading "whatsnext" %}}

* [Generating Reference Documentation Quickstart](/docs/contribute/generate-ref-docs/quickstart/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
