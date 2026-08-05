---
title: Prerequisites for reference documentation generators
description: Required tools and environment for building the Kubernetes reference documentation generators.
headless: true
---

### Requirements:

- You need a machine that is running Linux or macOS. On Windows, use
  [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install),
  since the build tooling relies on `make` and Bash scripts.

- You need to have these tools installed:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Go](https://go.dev/dl/), any recent release (Go downloads the exact toolchain a generator needs automatically)
  - [make](https://www.gnu.org/software/make/)
  - [gcc compiler/linker](https://gcc.gnu.org/)
  - [Docker](https://docs.docker.com/engine/installation/) (required for the local website preview with `make container-serve`, and for the deprecated `gen-kubectl` path — see notes below)

- You need to know how to create a pull request to a GitHub repository.
  This involves creating your own fork of the repository. For more
  information, see [Work from a local clone](/docs/contribute/new-content/open-a-pr/#fork-the-repo).

### Environment variables

Most generator targets read one or more of the following environment variables. Set them once before running any `make` target in your `reference-docs` checkout:

- `K8S_RELEASE` — the Kubernetes release you are generating documentation for, for example `1.34.0`.
- `K8S_WEBROOT` — an absolute path to your local `kubernetes/website` checkout.
- `K8S_ROOT` — an absolute path to a local `kubernetes/kubernetes` checkout that contains `go.mod`. Only required for the `updateapispec` and `updateapispec-enums-from-source` targets. Clone it as a sibling of your `reference-docs` checkout if you need those targets:

  ```shell
  git clone https://github.com/kubernetes/kubernetes
  export K8S_ROOT=$(pwd)/kubernetes
  ```

### macOS notes

The reference documentation generators run natively on macOS. A few macOS-specific things to be aware of:

- **Docker Desktop must be running** before you invoke any `make` target that spawns a container (for example, `make cli` or `make container-serve`). If Docker Desktop is not started, the target fails with `dial unix /Users/<you>/.docker/run/docker.sock: connect: no such file or directory`. Start Docker Desktop from Applications and retry the target.
- **Apple Silicon (arm64):** the deprecated `brianpursley/brodocs:latest` image used by the `cli` target only ships an `amd64` manifest. On M1/M2/M3 Macs, Docker Desktop will run it under `linux/amd64` emulation. It works, but it is slower. The `cli` target is deprecated in favor of `make comp` (via `gen-compdocs`); prefer `gen-compdocs` for new work.

### Deprecated targets

Some legacy targets remain in the `Makefile` for historical reasons and are being phased out:

- `make cli` (uses `gen-kubectldocs`) — deprecated. The generator prints `WARNING: gen-kubectl is deprecated; use gen-compdocs kubectl instead.` Use [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/) with `gen-compdocs` instead.
