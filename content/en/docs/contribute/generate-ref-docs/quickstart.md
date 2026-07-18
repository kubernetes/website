---
title: Reference Documentation Quickstart
linkTitle: Quickstart
content_type: task
weight: 10
hide_summary: true
---

<!-- overview -->

This page shows how to generate the Kubernetes reference documentation and copy
the generated pages into a local clone of the Kubernetes website. The reference
documentation pipeline has separate stages for the Kubernetes API, command-line
tools and components, and configuration APIs. Running the stages separately
makes it easier to identify and debug a failure.

If you need to correct text that comes from Kubernetes source code, first
[fix the content upstream](/docs/contribute/generate-ref-docs/contribute-upstream/).

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Set up the local repositories

Clone the website and reference documentation repositories as sibling
directories:

```shell
mkdir kubernetes-reference-docs
cd kubernetes-reference-docs
git clone https://github.com/kubernetes/website
git clone https://github.com/kubernetes-sigs/reference-docs
```

The remaining steps run from the root of the `reference-docs` repository.

```shell
cd reference-docs
```

## Set the build variables

Set `K8S_RELEASE` to the Kubernetes patch release that you want to document.
Set `K8S_WEBROOT` to the absolute path of the website clone.

```shell
export K8S_RELEASE=1.36.0
export K8S_WEBROOT="$(cd ../website && pwd)"
```

Each copy target builds its source before copying the generated output to
`K8S_WEBROOT`.

## Prepare the OpenAPI specification

Generate an OpenAPI specification that includes enum values:

```shell
make updateapispec-enums-from-source
```

This target temporarily clones the `kubernetes/kubernetes` repository at the
release tag, generates the OpenAPI specification, and copies it into the
versioned `gen-apidocs` configuration directory. Run this target before the API
reference target because the checked-in OpenAPI specification does not include
all the enum values needed by the reference documentation.

## Generate the Kubernetes API reference

Generate the Markdown API reference and copy it to the website clone:

```shell
make copyapimd
```

The target writes generated pages to
`content/en/docs/reference/kubernetes-api/` in the website clone.

## Generate the command-line and component references

Generate the references for `kubectl`, `kubeadm`, and the Kubernetes components,
and copy them to the website clone:

```shell
make copycomp
```

The target copies generated pages to these directories in the website clone:

* `content/en/docs/reference/command-line-tools-reference/`
* `content/en/docs/reference/kubectl/generated/`
* `content/en/docs/reference/setup-tools/kubeadm/generated/`

## Generate the configuration API references

Generate the configuration API references and copy them to the website clone:

```shell
make copyconfigapi
```

The target writes generated pages to
`content/en/docs/reference/config-api/` in the website clone.

## Review and preview the generated pages

Review the changes in the website clone:

```shell
cd "$K8S_WEBROOT"
git status --short
git diff --stat
```

The generators can also update files in the `reference-docs` clone, including
Go module files. Only include expected generated website content in a reference
documentation refresh pull request.

To preview the documentation locally, initialize the website submodules and
start the containerized site server:

```shell
git submodule update --init --recursive --depth 1
make container-serve
```

Open
`http://localhost:1313/docs/contribute/generate-ref-docs/quickstart/`
in a browser and review the generated reference pages.

When the changes are ready, follow the instructions for
[opening a pull request](/docs/contribute/new-content/open-a-pr/).

{{< note >}}
The metrics reference uses a generator in the `kubernetes/kubernetes`
repository. To update it, see
[Generating Reference Documentation for Metrics](/docs/contribute/generate-ref-docs/metrics-reference/).
{{< /note >}}

## {{% heading "whatsnext" %}}

* [Generating Reference Documentation for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Contributing to the Upstream Kubernetes Code](/docs/contribute/generate-ref-docs/contribute-upstream/)