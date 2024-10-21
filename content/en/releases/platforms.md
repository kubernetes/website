---
title: Platforms
type: docs
description: >
  Documentation about supported build platforms for Kubernetes.
---

<!-- overview -->

The Kubernetes project produces [artifacts](#artifacts) for different
architectures and operating systems. [SIG
Release](https://github.com/kubernetes/community/tree/master/sig-release)
considers the combination of architecture (`GOARCH`) and operating system
(`GOOS`) as "platforms". Target of this document is to outlined different
categories of platforms as well as guiding through their graduation criteria.

How to introduce new supported architectures and operating systems is outlined
in the the [platforms guide](https://github.com/kubernetes/community/blob/master/contributors/guide/platforms.md).

<!-- body -->

## Tiers

Build and release support for different platforms' artifacts are organized into
three tiers, whereas each comes with a different set of guarantees. Tiers can be
scoped to single binaries or a subset of them. This means for example that the
project can provide Tier 1 support for client binaries, even if the server
binaries do not exist at all.

### Tier 1

Tier 1 platforms are considered as "expected to work". To achieve this, they
have to fulfill the following criteria:

- Official binary releases are provided for the platform. This includes
  binaries / executables, container images, as well as deb and rpm packages.
  Building the artifacts is integrated in the release process.
- Continuous Integration is set up to run tests for the platform. Necessary
  tests are defined by SIG Release and usually correspond to the
  [`blocking`](https://testgrid.k8s.io/sig-release-master-blocking) and
  [`informing`](https://testgrid.k8s.io/sig-release-master-informing) testgrid
  dashboards. For Tier 1 only the `blocking` jobs are required, the `informing`
  ones are optional.
- Documentation about the usage of artifacts for the platform is available.

### Tier 2

Tier 2 platforms are considered as "expected to build". To achieve this, they
have to fulfill the following criteria:

- Official binary releases are provided for the platform. Building the artifacts
  is integrated in the release process.
- Automated testing is not or only partially set up.

It may be possible that single features are not available for a certain
platform.

### Tier 3

Tier 3 platforms are those that have been demonstrated to work and have a
documented build process that is available to anyone in the community. There is
no guarantee that builds will continue to work, and the platform may be dropped
if documentation is not maintained.

- Official builds are not available.
- Automated testing is not setup.
- Documentation on how to build for the platform is available.

## Currently available Kubernetes platforms

The following table defines the current setup of available Kubernetes platforms:

| Platform        | Tier 1 | Tier 2 | Tier 3 |
| --------------- | :----: | :----: | :----: |
| `amd64-linux`   |   ✅   |        |        |
| `arm64-linux`   |        |   ✅   |        |
| `arm-linux`     |        |   ✅   |        |
| `386-linux`     |        |   ✅   |        |
| `ppc64le-linux` |        |   ✅   |        |
| `s390x-linux`   |        |   ✅   |        |
| `amd64-darwin`  |        |   ✅   |        |
| `arm64-darwin`  |        |   ✅   |        |
| `amd64-windows` |        |   ✅   |        |
| `arm64-windows` |        |   ✅   |        |
| `386-windows`   |        |   ✅   |        |

### Removed platforms

The following platforms have been removed from building officially in
Kubernetes:

- **Platform:** `arm-linux`
  - **Reason:** Due to relocation problems on linking, breaking the
    `build-master` job.
  - **Resources:**
    - https://github.com/kubernetes/kubernetes/pull/115742
    - https://github.com/kubernetes/kubernetes/issues/116492
    - https://github.com/kubernetes/kubernetes/issues/115738
    - https://github.com/kubernetes/kubernetes/issues/115675

## Artifacts

### Container Images

|                         | 386 | amd64 | arm64 | ppc64le | s390x |
| ----------------------- | :-: | :---: | :---: | :-----: | :---: |
| conformance             | ✅  |  ✅   |  ✅   |   ✅    |  ✅   |
| kube-apiserver          | ✅  |  ✅   |  ✅   |   ✅    |  ✅   |
| kube-controller-manager | ✅  |  ✅   |  ✅   |   ✅    |  ✅   |
| kube-proxy              | ✅  |  ✅   |  ✅   |   ✅    |  ✅   |
| kube-scheduler          | ✅  |  ✅   |  ✅   |   ✅    |  ✅   |
| kubectl                 | ✅  |  ✅   |  ✅   |   ✅    |  ✅   |

### Storage

#### Binaries

|                         | darwin/amd64                          | linux/386                             | linux/amd64                                                    | linux/arm64                                                    | linux/ppc64le                                                  | linux/s390x                                                    | windows/386                 | windows/amd64               |
| ----------------------- | ------------------------------------- | ------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------- | --------------------------- |
| apiextensions-apiserver |                                       |                                       | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          |                             |                             |
| kube-apiserver          |                                       |                                       | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 |                             |                             |
| kube-controller-manager |                                       |                                       | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 |                             |                             |
| kube-proxy              |                                       |                                       | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 |                             | exe<br />sha256<br />sha512 |
| kube-scheduler          |                                       |                                       | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 | [binary_file]<br />docker_tag<br />tar<br />sha256<br />sha512 |                             |                             |
| kubeadm                 |                                       |                                       | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          |                             | exe<br />sha256<br />sha512 |
| kubectl                 | [binary_file]<br />sha256<br />sha512 | [binary_file]<br />sha256<br />sha512 | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | exe<br />sha256<br />sha512 | exe<br />sha256<br />sha512 |
| kubelet                 |                                       |                                       | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          |                             | exe<br />sha256<br />sha512 |
| mounter                 |                                       |                                       | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          | [binary_file]<br />sha256<br />sha512                          |                             |                             |

#### Tar archives

There are also corresponding `*.sha256` and `*.sha512` for every file below

| File                                       | darwin/amd64 | linux/386 | linux/amd64 | linux/arm64 | linux/ppc64le | linux/s390x | windows/386 | windows/amd64 | portable |
| ------------------------------------------ | :----------: | :-------: | :---------: | :---------: | :-----------: | :---------: | :---------: | :-----------: | :------: |
| kubernetes-client-**[system-arch]**.tar.gz |      ✅      |    ✅     |     ✅      |     ✅      |      ✅       |     ✅      |     ✅      |      ✅       |          |
| kubernetes-node-**[system-arch]**.tar.gz   |              |           |     ✅      |     ✅      |      ✅       |     ✅      |             |      ✅       |          |
| kubernetes-server-**[system-arch]**.tar.gz |              |           |     ✅      |     ✅      |      ✅       |     ✅      |             |               |          |
| kubernetes-test-**[system-arch]**.tar.gz   |      ✅      |           |     ✅      |     ✅      |      ✅       |     ✅      |             |      ✅       |    ✅    |
| kubernetes-manifests.tar.gz                |              |           |             |             |               |             |             |               |          |
| kubernetes-test.tar.gz                     |              |           |             |             |               |             |             |               |          |
| kubernetes-src.tar.gz                      |              |           |             |             |               |             |             |               |          |
| kubernetes.tar.gz                          |              |           |             |             |               |             |             |               |          |

### Packages

The Kubernetes release process ensures that deb and rpm packages will be
available via [pkgs.k8s.io](/blog/2023/08/15/pkgs-k8s-io-introduction) for the
architectures `aarch64`, `ppc64le`, `s390x` and `x86_64`.
