---
title: Platforms
type: docs
description: >
  Documentation about supported build platforms for Kubernetes.
---

<!-- overview -->

The Kubernetes project's development process produces [artifacts](#artifacts)
for different architectures and operating systems. We consider the combination
of architecture (`GOARCH`) and operating system (`GOOS`) as "platforms". Target
of this document is to outline different categories of platforms as well as
guiding through their graduation criteria.

How to introduce new supported architectures and operating systems is outline in
the the [platforms guide](#platforms-guide).

<!-- body -->

## Tiers

Build and release support for different platforms' artifacts are organized into
three tiers, whereas each comes with a different set of guarantees. Tiers can be
scoped to single binaries or a subset of them. This means for example that we
can provide Tier 1 support for client binaries, even if the server binaries do
not exist at all.

### Tier 1

Tier 1 platforms are considered as "expected to work". To achieve this, they
have to fulfill the following criteria:

- Official binary releases are provided for the platform. This includes
  container images as well as deb and rpm packages. Building the artifacts is
  integrated in the release process.
- Continuous Integration is set up to run tests for the platform. Necessary
  tests are defined by SIG Release and usually correspond to the
  [`blocking`](https://testgrid.k8s.io/sig-release-master-blocking) and
  [`informing`](https://testgrid.k8s.io/sig-release-master-informing) testgrid
  dashboards.
- Documentation about the usage of artifacts for the platform is available.

### Tier 2

Tier 2 platforms are considered as "expected to build". To achieve this, they
have to fulfill the following criteria:

- Official binary releases are provided for the platform. Building the artifacts
  is integrated in the release process.
- Automated testing is not or only partially setup.

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

| Platform        |       Tier 1       |       Tier 2       | Tier 3 |
| --------------- | :----------------: | :----------------: | :----: |
| `amd64-linux`   | :heavy_check_mark: |                    |        |
| `arm64-linux`   |                    | :heavy_check_mark: |        |
| `amd64-darwin`  |                    | :heavy_check_mark: |        |
| `386-linux`     |                    | :heavy_check_mark: |        |
| `ppc64le-linux` |                    | :heavy_check_mark: |        |
| `s390x-linux`   |                    | :heavy_check_mark: |        |
| `386-windows`   |                    | :heavy_check_mark: |        |
| `amd64-windows` |                    | :heavy_check_mark: |        |

### Removed platforms

The following platforms have been removed from building officially in
Kubernetes:

- **Platform:** `arm-linux`
  - **Reason:** Due to relocation problems on linking breaking the
    `build-master` job.
  - **Resources:**
    - https://github.com/kubernetes/kubernetes/pull/115742
    - https://github.com/kubernetes/kubernetes/issues/116492
    - https://github.com/kubernetes/kubernetes/issues/115738
    - https://github.com/kubernetes/kubernetes/issues/115675

## Platforms Guide

This section outlines the necessary steps to either add or remove supported
platform builds in Kubernetes.

### Adding supported platforms

The default Kubernetes platform is `linux/amd64`. This platform is fully tested,
where build and release systems initially supported only that. A while ago we
started an [effort to support multiple architectures][0]. As part of this
effort, we added support in our build and release pipelines for the
architectures `arm`, `arm64`, `ppc64le` and `s390x` on different operating
systems like Linux, Windows and macOS.

[0]: https://github.com/kubernetes/kubernetes/issues/38067

The main focus was to have binaries and container images to be available for
these architectures/operating systems. Contributors should be able to to take
these artifacts and set up CI jobs to adequately test these platforms.
Specifically to call out the ability to run conformance tests on these
platforms.

Target of this document is to provide a starting point for adding new platforms
to Kubernetes from a SIG Architecture and SIG Release perspective. This does not
include release mechanics or supportability in terms of functionality.

#### Step 1: Building

The container image based build infrastructure should support this architecture.
This implicitly requires the following:

- golang should support the platform
- All dependencies, whether vendored or run separately, should support this
  platform

In other words, anyone in the community should be able to use our build infra to
generate all artifacts required to stand up Kubernetes.

More information about how to build Kubernetes can be found in [the build
documentation][1].

[1]: https://github.com/kubernetes/kubernetes/tree/3f7c09e/build#building-kubernetes

#### Step 2: Testing

It is not enough for builds to work as it gets bit-rotted quickly when we vendor
in new changes, update versions of things we use etc. So we need a good set of
tests that exercise a wide battery of jobs in this new architecture.

A good starting point from a testing perspective are:

- unit tests
- e2e tests
- node e2e tests

This will ensure that community members can rely on these architectures on a
consistent basis. This will give folks who are making changes a signal when they
break things in a specific architecture.

This implies a set of folks who stand up and maintain both post-submit and
periodic tests, watch them closely and raise the flag when things break. They
will also have to help debug and fix any platform specific issues as well.

Creating custom [testgrid][4] dashboards can help to monitor platform specific
tests.

[4]: https://testgrid.k8s.io

#### Step 3: Releasing

With the first 2 steps we have a reasonable expectation that there are people
taking care of a supported platform and it works in a reproducible environment.

Getting to the next level is a big jump from here. We are talking about real
users who are betting their business literally on the work we are doing here. So
we need guarantees around "can we really ship this!?" question.

Specifically we are talking about a set of CI jobs in our release-informing and
release-blocking tabs of our testgrid. The Kubernetes release team has a "CI
signal" team that relies on the status(es) of these jobs to either ship or hold
a release. Essentially, if things are mostly red with occasional green, it would
be prudent to not even bother making this architecture as part of the release.
CI jobs get added to release-informing first and when these get to a point where
they work really well, then they get promoted to release-blocking.

The problem here is once we start shipping something, users will start to rely
on it, whether we like it or not. So it becomes a trust issue on this team that
is talking care of a platform/architecture. Do we really trust this team not
just for this release but on an ongoing basis. Do they show up consistently when
things break, do they proactively work with testing/release on ongoing efforts
and try to apply them to their architectures. It's very easy to setup a CI job
as a one time thing, tick a box and advocate to get something added. It's a
totally different ball game to be there consistently over time and show that you
mean it. There has to be a consistent body of people working on this over time
(life happens!).

What are we looking for here, a strong green CI signal for release managers
to cut a release and for folks to be able to report problems and them getting
addressed. This includes [conformance testing][2] as use of the Kubernetes
trademark is controlled through a conformance ensurance process. So we are
looking for folks here to work with [the conformance sub project][3] in addition
to testing and release.

[2]: https://github.com/cncf/k8s-conformance
[3]: https://bit.ly/sig-architecture-conformance

#### Step 4: Finishing

If you got this far, you really have made it! You have a clear engagement with
the community, you are working seamlessly with all the relevant SIGs, you have
your content in the Kubernetes release and get end users to adopt your
architecture. Having achieved conformance, you will gain conditional use of the
Kubernetes trademark relative to your offerings.

#### Generic rules to consider

- We should keep it easy for contributors to get into Step 1.
- Step 1, by default things should not build and should be switched off.
- Step 1, should not place undue burden on review or infrastructure (case in
  point - Windows).
- Once Step 2 is done, we could consider switching things on by default (but
  still not in release artifacts).
- Once Step 3 is done, binaries / images in arch can ship with release.
- Step 2 is at least the default e2e-gce equivalent, PLUS the node e2e tests.
  More the better.
- Step 2 will involve 3rd party reporting to test-grid at the least.
- Step 2 may end up needing boskos etc to run against clouds (with these arches)
  where we have credits.
- Step 3 is at least the conformance test suite. More the better. Using
  community tools like prow/kubeadm is encouraged but not mandated.
- Step 4 is where we take this up to CNCF trademark program. For at least a year
  in Step 3 before we go to Step 4.
- If at any stage things bit rot, we go back to a previous step, giving an
  opportunity for the community to step up.

### Deprecating and removing supported platforms

Supported platforms may be considered as deprecated for various reasons, for
example if they are being replaced by new ones, are not actively used or
maintained any more. Deprecating an already supported platform has to follow a
couple of steps:

1. The platform deprecation has been announced on k-dev and links to a k/k issue
   for further discussions and consensus.

1. The deprecation will be active immediately after consensus has been reached
   at a set deadline. This incorporates approval from SIG Release and
   Architecture.

1. Removing the supported platform will be done in the beginning of the next
   minor (v1.N+1.0) release cycle, which means to:
   - Update the k/k build scripts to exclude the platform from all targets
   - Update the k/sig-release repository to reflect the current set of supported
     platforms.

Please note that actively supported release branches are not affected by the
removal. This ensures compatibility with existing artifact consumers.

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

#### Extra files (for GCE)

There are also corresponding `*.sha256` and `*.sha512` for every file below

| File                        |
| --------------------------- |
| configure.sh                |
| master.yaml                 |
| node.yaml                   |
| shutdown.sh                 |
| windows/common.psm1         |
| windows/configure.ps1       |
| windows/install-ssh.psm1    |
| windows/k8s-node-setup.psm1 |
| windows/user-profile.psm1   |

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

#### Other (uncategorized) files

| File                    |
| ----------------------- |
| release/latest-1.16.txt |
| release/latest-1.txt    |
| release/latest.txt      |

Files in directory: **archive**

Comment: It looks like in the directory: **archive** we can find:

- copy of **anago** (script used for building artifacts)
- shallow copy of kubernetes repository

Staged files
It looks like all staged files were copied to release directory, but please be aware there was no effort taken to compare them.

### Packages

The Kubernetes release process ensures that deb and rpm packages will be
available via [pkgs.k8s.io](/blog/2023/08/15/pkgs-k8s-io-introduction) for the
architectures `aarch64`, `ppc64le`, `s390x` and `x86_64`.
