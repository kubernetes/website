---
title: 下載 Kubernetes
type: docs
---
<!-- 
title: Download Kubernetes
type: docs
-->

<!-- 
Kubernetes ships binaries for each component as well as a standard set of client
applications to bootstrap or interact with a cluster. Components like the
API server are capable of running within container images inside of a
cluster. Those components are also shipped in container images as part of the
official release process. All binaries as well as container images are available
for multiple operating systems as well as hardware architectures.
-->
Kubernetes 為每個元件提供二進位制檔案以及一組標準的客戶端應用程式用來引導叢集或與叢集互動。
像 API 伺服器這樣的元件能夠在叢集內的容器映象中執行。
作為官方釋出過程的一部分，這些元件也以容器映象的形式提供。
所有二進位制檔案和容器映象都可用於多種作業系統和硬體架構。

<!-- 
## Container Images

All Kubernetes container images are deployed to the
[k8s.gcr.io](https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/GLOBAL)
container registry.
-->
## 容器映象

所有 Kubernetes 容器映象都部署到
[k8s.gcr.io](https://console.cloud.google.com/gcr/images/k8s-artifacts-prod/GLOBAL) 容器倉庫。


{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

<!-- 
For Kubernetes {{< param "version" >}}, the following
container images are signed using [cosign](https://github.com/sigstore/cosign)
signatures:
-->
對於 Kubernetes {{< param "version" >}}，以下容器映象使用
[cosign](https://github.com/sigstore/cosign) 進行簽名：

<!-- 
| Container Image                                                     | Supported Architectures                                                                  |
-->
| 容器映象                                                             | 支援架構                                                                                  |
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

<!-- 
All container images are available for multiple architectures, whereas the
container runtime should choose the correct one based on the underlying
platform. It is also possible to pull a dedicated architecture by suffixing the
container image name, for example
[`k8s.gcr.io/kube-apiserver-arm64:{{< param "fullversion" >}}`][0-arm64]. All
those derivations are signed in the same way as the multi-architecture manifest lists.
-->
所有容器映象都支援多種體系結構，容器執行時應根據下層平臺選擇正確的映象。
也可以透過給容器映象名稱加字尾來拉取特定體系結構的映象，例如
[`k8s.gcr.io/kube-apiserver-arm64:{{< param "fullversion" >}}`][0-arm64]。
所有這些派生映象都以與多架構清單列表相同的方式簽名。

<!-- 
The Kubernetes project publishes a list of signed Kubernetes container images
in SBoM (Software Bill of Materials) format.
You can fetch that list using:
-->
Kubernetes 專案以 SBoM（軟體物料清單）格式釋出已簽名的 Kubernetes 容器映象列表。
你可以使用以下方法獲取該列表：

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/latest.txt)/release"  | awk '/PackageName: k8s.gcr.io\// {print $2}'
```
<!-- 
For Kubernetes v{{< skew currentVersion >}}, the only kind of code artifact that
you can verify integrity for is a container image, using the experimental
signing support.

To manually verify signed container images of Kubernetes core components, refer to
[Verify Signed Container Images](/docs/tasks/administer-cluster/verify-signed-images).
-->
對於 Kubernetes v{{< skew currentVersion >}}，唯一可以驗證完整性的程式碼工件就是容器映象，它使用實驗性簽名支援。

如需手動驗證 Kubernetes 核心元件的簽名容器映象，請參考[驗證簽名容器映象](/zh-cn/docs/tasks/administer-cluster/verify-signed-images)。

<!-- 
## Binaries

Find links to download Kubernetes components (and their checksums) in the [CHANGELOG](https://github.com/kubernetes/kubernetes/tree/master/CHANGELOG) files.

Alternately, use [downloadkubernetes.com](https://www.downloadkubernetes.com/) to filter by version and architecture.
-->
## 二進位制

在 [CHANGELOG](https://github.com/kubernetes/kubernetes/tree/master/CHANGELOG) 檔案中找到下載 Kubernetes 元件（及其校驗和）的連結。

或者，使用 [downloadkubernetes.com](https://www.downloadkubernetes.com/) 按版本和架構進行過濾。

### kubectl

<!-- overview -->

<!-- 
The Kubernetes command-line tool, [kubectl](/docs/reference/kubectl/kubectl/), allows
you to run commands against Kubernetes clusters.

You can use kubectl to deploy applications, inspect and manage cluster resources,
and view logs. For more information including a complete list of kubectl operations, see the
[`kubectl` reference documentation](/docs/reference/kubectl/).
-->
Kubernetes 命令列工具 [kubectl](/zh-cn/docs/reference/kubectl/kubectl/) 允許你對 Kubernetes 叢集執行命令。

你可以使用 kubectl 部署應用程式、檢查和管理叢集資源以及檢視日誌。
有關更多資訊，包括 kubectl 操作的完整列表，請參閱
[`kubectl` 參考文件](/zh-cn/docs/reference/kubectl/)。

<!-- 
kubectl is installable on a variety of Linux platforms, macOS and Windows.
Find your preferred operating system below.

- [Install kubectl on Linux](/docs/tasks/tools/install-kubectl-linux)
- [Install kubectl on macOS](/docs/tasks/tools/install-kubectl-macos)
- [Install kubectl on Windows](/docs/tasks/tools/install-kubectl-windows)
-->
kubectl 可安裝在各種 Linux 平臺、macOS 和 Windows 上。
在下方找到你首選的作業系統。

- [在 Linux 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-linux)
- [在 macOS 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-macos)
- [在 Windows 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-windows)
