---
title: Reference documentation contributor guide
main_menu: true
weight: 80
---

This section explains how the Kubernetes reference documentation is
generated, and how to update the pages under
[/docs/reference/](/docs/reference/).

The reference documentation is not written by hand. Generators in
[`kubernetes-sigs/reference-docs`](https://github.com/kubernetes-sigs/reference-docs)
read source-of-truth artifacts — the OpenAPI swagger, `kubectl` and
`kube-*` binaries, and the componentconfig Go types — and emit Markdown
into this repository.

Each generator is self-contained. Pick the page that matches what you
need to update; every page includes its own prerequisites, source-repo
checkout, and `make` target.

## Generators

| What you want to update | Generator | Guide |
| ----------------------- | --------- | ----- |
| Kubernetes API reference | `gen-apidocs` (from the OpenAPI swagger) | [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/) |
| `kubectl` command reference | `gen-compdocs` | [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/) |
| `kubeadm` and `kube-*` component pages | `gen-compdocs` | [Generating Reference Pages for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/) |
| Configuration API reference | `genref` | [Generating Reference Documentation for Configuration APIs](/docs/contribute/generate-ref-docs/config-api/) |
| Kubernetes metrics reference | `genref` (metrics profile) | [Generating the Kubernetes Metrics Reference](/docs/contribute/generate-ref-docs/metrics-reference/) |

When you see bugs in the generated documentation, the fix usually
belongs in the upstream project rather than in this repository. See
[Contributing to the Upstream Kubernetes Code](/docs/contribute/generate-ref-docs/contribute-upstream/).
