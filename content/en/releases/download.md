---
title: Download Kubernetes
type: docs
---

Kubernetes ships binaries for each component as well as a standard set of client
applications to bootstrap or interact with a cluster. Components like the
API server are capable of running within container images inside of a
cluster. Those components are also shipped in container images as part of the
official release process. All binaries as well as container images are available
for multiple operating systems as well as hardware architectures.

### kubectl

<!-- overview -->

The Kubernetes command-line tool, [kubectl](/docs/reference/kubectl/kubectl/), allows
you to run commands against Kubernetes clusters.

You can use kubectl to deploy applications, inspect and manage cluster resources,
and view logs. For more information including a complete list of kubectl operations, see the
[`kubectl` reference documentation](/docs/reference/kubectl/).

kubectl is installable on a variety of Linux platforms, macOS and Windows.
Find your preferred operating system below.

- [Install kubectl on Linux](/docs/tasks/tools/install-kubectl-linux)
- [Install kubectl on macOS](/docs/tasks/tools/install-kubectl-macos)
- [Install kubectl on Windows](/docs/tasks/tools/install-kubectl-windows)

## Container images

All Kubernetes container images are deployed to the
`registry.k8s.io` container image registry.

| Container Image                                                           | Supported Architectures           |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### Container image architectures

All container images are available for multiple architectures, whereas the
container runtime should choose the correct one based on the underlying
platform. It is also possible to pull a dedicated architecture by suffixing the
container image name, for example
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### Container image signatures

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

For Kubernetes {{< param "version" >}},
container images are signed using [sigstore](https://sigstore.dev)
signatures:

{{< note >}}
Container image sigstore signatures do currently not match between different geographical locations.
More information about this problem is available in the corresponding
[GitHub issue](https://github.com/kubernetes/registry.k8s.io/issues/187).
{{< /note >}}

The Kubernetes project publishes a list of signed Kubernetes container images
in [SPDX 2.3](https://spdx.dev/specifications/) format.
You can fetch that list using:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

To manually verify signed container images of Kubernetes core components, refer to
[Verify Signed Container Images](/docs/tasks/administer-cluster/verify-signed-artifacts).

If you pull a container image for a specific architecture, the single-architecture image
is signed in the same way as for the multi-architecture manifest lists.

## Binaries

{{< release-binaries >}}
