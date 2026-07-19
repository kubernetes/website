---
title: Generating Reference Documentation for Configuration APIs
content_type: task
weight: 60
---

<!-- overview -->

This page shows how you can generate updated reference documentation for Kubernetes Configuration APIs. It is aimed at people who are contributing to Kubernetes.

The Configuration API reference documents the configuration formats for Kubernetes tools and
components — for example, `kubelet`, `kube-apiserver`, `kube-scheduler`, `kubeconfig`, and 
`kubeadm` formats. The published reference is at [/docs/reference/config-api/](/docs/reference/config-api/).

`genref`, in [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs),
is the generator that builds this reference. It reads each component's Go configuration types and renders them as markdown.

If you find bugs in the generated content, you most likely need to
[fix them upstream](/docs/contribute/generate-ref-docs/contribute-upstream/).

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

Set this in your shell. It applies to every `make` command in the steps that
follow, whichever directory you run it from.

```shell
export K8S_WEBROOT=/path/to/your/website   # your website clone (<web-base>)
```

## Build and publish the Configuration API reference

From `<rdocs-base>`:

```shell
cd <rdocs-base>
make copyconfigapi
```

This command runs in two stages:
1. **`configapi`** - builds and runs `genref`, which generates Markdown to `genref/output/md`
2. **`copyconfigapi`** - copies the generated files into your website clone at
`<web-base>/content/en/docs/reference/config-api/`.

The first run downloads the Go module dependencies and it may take several minutes.

Check what changed in your website clone:
```shell
cd <web-base>
git status
```

Look for updates made under `content/en/docs/reference/config-api` - for example:

```text
content/en/docs/reference/config-api/kubelet-config.v1beta1.md
content/en/docs/reference/config-api/kubeadm-config.v1beta4.md
content/en/docs/reference/config-api/apiserver-config.v1.md
content/en/docs/reference/config-api/client-authentication.v1.md
```

## Preview website and test locally

Preview your updates:
```shell
cd <web-base>
git submodule update --init --recursive --depth 1   # if not already done
make container-serve
```

Then open a local preview through your web browser and confirm that the 
pages you updated load properly. 
Hugo serves that local preview at http://localhost:1313/
So the page to check is http://localhost:1313/docs/reference/config-api/

## Commit the changes

If you regenerated the Configuration API reference for a release update,
commit the changed files under `content/en/docs/reference/config-api/` in
`<web-base>`, then open a [pull request](/docs/contribute/new-content/open-a-pr/)
to [kubernetes/website](https://github.com/kubernetes/website).

## {{% heading "whatsnext" %}}

* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Generating Reference Documentation Quickstart](/docs/contribute/generate-ref-docs/quickstart/)
* [Contributing to Upstream Reference Docs](/docs/contribute/generate-ref-docs/contribute-upstream/)
