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
Kubernetes 爲每個組件提供二進制文件以及一組標準的客戶端應用來引導叢集或與叢集交互。
像 API 伺服器這樣的組件能夠在叢集內的容器映像檔中運行。
這些組件作爲官方發佈過程的一部分，也以容器映像檔的形式提供。
所有二進制文件和容器映像檔都可用於多種操作系統和硬件架構。

### kubectl

<!-- overview -->

<!--
The Kubernetes command-line tool, [kubectl](/docs/reference/kubectl/kubectl/), allows
you to run commands against Kubernetes clusters.

You can use kubectl to deploy applications, inspect and manage cluster resources,
and view logs. For more information including a complete list of kubectl operations, see the
[`kubectl` reference documentation](/docs/reference/kubectl/).
-->
Kubernetes 命令列工具 [kubectl](/zh-cn/docs/reference/kubectl/kubectl/)
允許你對 Kubernetes 叢集執行命令。

你可以使用 kubectl 部署應用，還可以檢查和管理叢集資源以及查看日誌。
有關包括 kubectl 完整操作列表在內的更多信息，請參閱
[`kubectl` 參考文檔](/zh-cn/docs/reference/kubectl/)。

<!--
kubectl is installable on a variety of Linux platforms, macOS and Windows.
Find your preferred operating system below.

- [Install kubectl on Linux](/docs/tasks/tools/install-kubectl-linux)
- [Install kubectl on macOS](/docs/tasks/tools/install-kubectl-macos)
- [Install kubectl on Windows](/docs/tasks/tools/install-kubectl-windows)
-->
kubectl 可安裝在各種 Linux 平臺、macOS 和 Windows 上。
在下方找到你首選的操作系統。

- [在 Linux 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-linux)
- [在 macOS 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-macos)
- [在 Windows 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-windows)

<!--
## Container images

All Kubernetes container images are deployed to the
`registry.k8s.io` container image registry.
-->
## 容器映像檔  {#container-images}

所有 Kubernetes 容器映像檔都被部署到 `registry.k8s.io` 容器映像檔倉庫。

<!--
| Container Image                                                           | Supported Architectures          |
-->
| 容器映像檔                                                                   | 支持架構                           |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

<!--
### Container image architectures
-->
### 容器映像檔架構

<!--
All container images are available for multiple architectures, whereas the
container runtime should choose the correct one based on the underlying
platform. It is also possible to pull a dedicated architecture by suffixing the
container image name, for example
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`. 
-->
所有容器映像檔都支持多架構，而容器運行時應根據下層平臺選擇正確的映像檔。
也可以通過給容器映像檔名稱加後綴來拉取適合特定架構的映像檔，例如
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`。

<!--
### Container image signatures
-->
### 容器映像檔簽名

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

<!--
For Kubernetes {{< param "version" >}},
container images are signed using [sigstore](https://sigstore.dev)
signatures:
-->
對於 Kubernetes {{< param "version" >}}，容器映像檔使用
[sigstore](https://sigstore.dev) 進行簽名：

{{< note >}}
<!--
Container image sigstore signatures do currently not match between different geographical locations.
More information about this problem is available in the corresponding
[GitHub issue](https://github.com/kubernetes/registry.k8s.io/issues/187).
-->
目前，不同地理位置之間的容器映像檔 sigstore 簽名不匹配。
有關此問題的更多信息，請參閱相應的
[GitHub Issue](https://github.com/kubernetes/registry.k8s.io/issues/187)。
{{< /note >}}


<!--
The Kubernetes project publishes a list of signed Kubernetes container images
in [SPDX 2.3](https://spdx.dev/specifications/) format.
You can fetch that list using:
-->
Kubernetes 項目以 [SPDX 2.3](https://spdx.dev/specifications/) 格式發佈已簽名的
Kubernetes 容器映像檔列表。你可以使用以下方法獲取該列表：

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

<!--
To manually verify signed container images of Kubernetes core components, refer to
[Verify Signed Container Images](/docs/tasks/administer-cluster/verify-signed-artifacts).
-->
如需手動驗證 Kubernetes 核心組件的簽名容器映像檔，
請參考[驗證簽名容器映像檔](/zh-cn/docs/tasks/administer-cluster/verify-signed-artifacts)。

<!--
If you pull a container image for a specific architecture, the single-architecture image
is signed in the same way as for the multi-architecture manifest lists.
-->
如果你要拉取特定架構的容器映像檔，則單架構映像檔的簽名方式與多架構清單列表相同。

<!--
## Binaries
-->
## 二進制  {#binaries}

{{< release-binaries >}}
