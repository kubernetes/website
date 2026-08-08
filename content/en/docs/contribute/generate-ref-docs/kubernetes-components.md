---
title: Generating Reference Pages for Kubernetes Components and Tools
content_type: task
weight: 120
---

<!-- overview -->

This page explains how to generate reference documentation for Kubernetes command-line tools and core components using the `gen-compdocs` generator.

The generated documentation includes:

- `kubectl` command reference
- `kubeadm`
- `kube-apiserver`
- `kube-controller-manager`
- `kube-scheduler`
- `kubelet`
- `kube-proxy`

Running the generator copies the generated reference pages into your local
`kubernetes/website` repository.


## {{% heading "prerequisites" %}}

Start with [Prerequisites for Generating Reference Documentation](/docs/contribute/generate-ref-docs/prerequisites-ref-docs/).


## Set build variables

Before generating the reference documentation, set the following environment variables.

```shell
export K8S_RELEASE=1.36.0
export K8S_WEBROOT=/path/to/website
```

- `K8S_RELEASE` specifies the Kubernetes release version to build.
- `K8S_WEBROOT` points to your local clone of the `kubernetes/website` repository, where the generated documentation is copied.


## Generate the reference pages

From the `reference-docs` repository, run the following command to generate the CLI and component reference documentation.

```shell
cd /path/to/reference-docs
make copycomp
```

Running `make copycomp` performs the following steps:

1. Builds the CLI and component reference documentation using the `gen-compdocs` generator.
2. Generates reference pages for `kubectl`, `kubeadm`, and other Kubernetes components.
3. Copies the generated documentation into the appropriate locations in the `website` repository.


## Generated documentation and verification

Running `make copycomp` updates documentation in your local `kubernetes/website` repository at:

- `content/en/docs/reference/command-line-tools-reference/`
- `content/en/docs/reference/kubectl/generated/`
- `content/en/docs/reference/setup-tools/kubeadm/generated/`

To verify the changed files in your website repository:

```shell
cd $K8S_WEBROOT
git status
```

> **Note:** Running `make copycomp` updates generated documentation in your local `kubernetes/website` repository. Do not include generated documentation or unrelated changes in your documentation-only pull request.


## Preview the documentation locally

From the `website` repository, start a local preview server.

```shell
cd $K8S_WEBROOT
make container-serve
```

This command starts a local development server for the Kubernetes documentation.

Open the following page in your browser to preview the generated documentation:

<http://localhost:1313/docs/contribute/generate-ref-docs/>

<!-- steps -->


## {{% heading "whatsnext" %}}

* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Generating Reference Documentation for the Configuration API](/docs/contribute/generate-ref-docs/config-api/)
* [Contributing to the Upstream Kubernetes Project for Documentation](/docs/contribute/generate-ref-docs/contribute-upstream/)


