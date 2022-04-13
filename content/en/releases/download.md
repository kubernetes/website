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

## Container Images

All Kubernetes container images are deployed to the
[k8s.gcr.io](https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/GLOBAL)
container registry.

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

From the beginning of Kubernetes {{< param "version" >}}, the following
container images are signed using [cosign](https://github.com/sigstore/cosign)
signatures:

| Container Image                                                     | Supported Architectures                                                                  |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [k8s.gcr.io/kube-apiserver:{{< param "fullversion" >}}][0]          | [amd64][0-amd64], [arm][0-arm], [arm64][0-arm64], [ppc64le][0-ppc64le], [s390x][0-s390x] |
| [k8s.gcr.io/kube-controller-manager:{{< param "fullversion" >}}][1] | [amd64][1-amd64], [arm][1-arm], [arm64][1-arm64], [ppc64le][1-ppc64le], [s390x][1-s390x] |
| [k8s.gcr.io/kube-proxy:{{< param "fullversion" >}}][2]              | [amd64][2-amd64], [arm][2-arm], [arm64][2-arm64], [ppc64le][2-ppc64le], [s390x][2-s390x] |
| [k8s.gcr.io/kube-scheduler:{{< param "fullversion" >}}][3]          | [amd64][3-amd64], [arm][3-arm], [arm64][3-arm64], [ppc64le][3-ppc64le], [s390x][3-s390x] |
| [k8s.gcr.io/conformance:{{< param "fullversion" >}}][4]             | [amd64][4-amd64], [arm][4-arm], [arm64][4-arm64], [ppc64le][4-ppc64le], [s390x][4-s390x] |

[0]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-apiserver
[0-amd64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-apiserver-amd64
[0-arm]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-apiserver-arm
[0-arm64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-apiserver-arm64
[0-ppc64le]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-apiserver-ppc64le
[0-s390x]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-apiserver-s390x
[1]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-controller-manager
[1-amd64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-controller-manager-amd64
[1-arm]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-controller-manager-arm
[1-arm64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-controller-manager-arm64
[1-ppc64le]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-controller-manager-ppc64le
[1-s390x]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-controller-manager-s390x
[2]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-proxy
[2-amd64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-proxy-amd64
[2-arm]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-proxy-arm
[2-arm64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-proxy-arm64
[2-ppc64le]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-proxy-ppc64le
[2-s390x]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-proxy-s390x
[3]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-scheduler
[3-amd64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-scheduler-amd64
[3-arm]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-scheduler-arm
[3-arm64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-scheduler-arm64
[3-ppc64le]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-scheduler-ppc64le
[3-s390x]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/kube-scheduler-s390x
[4]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/conformance
[4-amd64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/conformance-amd64
[4-arm]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/conformance-arm
[4-arm64]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/conformance-arm64
[4-ppc64le]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/conformance-ppc64le
[4-s390x]: https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/us/conformance-s390x

All container images are available for multiple architectures, whereas the
container runtime should choose the correct one based on the underlying
platform. It is also possible to pull a dedicated architecture by suffixing the
container image name, for example
[`k8s.gcr.io/kube-apiserver-arm64:{{< param "fullversion" >}}`][0-arm64]. All
those derivations are signed in the same way as the multi-architecture manifest lists.

The Kubernetes project publishes a list of signed Kubernetes container images
in SBoM (Software Bill of Materials) format.
You can fetch that list using:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/latest.txt)/release"  | awk '/PackageName: k8s.gcr.io\// {print $2}'
```
For Kubernetes v{{< skew currentVersion >}}, the only kind of code artifact that
you can verify integrity for is a container image, using the experimental
signing support.

To manually verify signed container images of Kubernetes core components, refer to
[Verify Signed Container Images](/docs/tasks/administer-cluster/verify-signed-images).



## Binaries

Find links to download Kubernetes components (and their checksums) in the [CHANGELOG](https://github.com/kubernetes/kubernetes/tree/master/CHANGELOG) files.

Alternately, use [downloadkubernetes.com](https://www.downloadkubernetes.com/) to filter by version and architecture.

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
