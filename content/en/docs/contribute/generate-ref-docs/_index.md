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

## The four build stages

The full reference set rebuilds in four ordered stages. Each stage has a
dedicated `make` target and its own contributor page.

| Stage | Generator | What it produces | Page |
| ----- | --------- | ---------------- | ---- |
| 1 | swagger enum patch | Enum-complete `api/openapi-spec/swagger.json` (feeds stages 2 and 4) | *(prerequisite for stages 2 and 4)* |
| 2 | `gen-apidocs` | API reference Markdown and single-page HTML | [Generating API reference](/docs/contribute/generate-ref-docs/kubernetes-api/) |
| 3 | `gen-compdocs` | `kubectl`, `kubeadm`, and `kube-*` component pages | [Generating CLI and component pages](/docs/contribute/generate-ref-docs/kubectl/) |
| 4 | `genref` | Componentconfig and structured Config API pages | [Generating the Config API reference](/docs/contribute/generate-ref-docs/config-api/) |

Stage 1 must run first — stages 2 and 4 read the swagger it prepares.
Each `copy*` target then builds its own source.

## Before you start

Read the following before picking up any per-generator page:

* [Contributing to upstream Kubernetes](/docs/contribute/generate-ref-docs/contribute-upstream/) — when the fix belongs in `kubernetes/kubernetes` rather than in the docs.

## Full-refresh command sequence

To rebuild every reference page — for example, ahead of a release — run
the four stages in order from your `reference-docs` checkout:

```shell
export K8S_RELEASE=1.34.0
export K8S_WEBROOT=/path/to/website

make updateapispec-enums-from-source   # Stage 1: enum-complete swagger
make copyapimd                         # Stage 2: API reference (Markdown)
make copycomp                          # Stage 3: kubectl and kube-* components
make copyconfigapi                     # Stage 4: Config API (genref)
```

To rebuild only one section, run the corresponding stage from the table
above.
