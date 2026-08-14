---
title: 安裝 kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: 安裝 kubeadm 設定工具
---
<!--
---
title: Installing kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: Install the kubeadm setup tool
---
-->

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
<!--
This page shows how to install the `kubeadm` toolbox.
For information on how to create a cluster with kubeadm once you have performed this installation process,
see the [Creating a cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) page.
-->
本頁面說明如何安裝 `kubeadm` 工具箱。
完成本安裝流程後，若想了解如何使用 kubeadm 建立叢集，
請參閱[使用 kubeadm 建立叢集](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)頁面。

{{< doc-versions-list "installation guide" >}}

## {{% heading "prerequisites" %}}

<!--
* A compatible Linux host. The Kubernetes project provides generic instructions for Linux distributions
  based on Debian and Red Hat, and those distributions without a package manager.
* 2 GB or more of RAM per machine (any less will leave little room for your apps).
* 2 CPUs or more for control plane machines.
* Full network connectivity between all machines in the cluster (public or private network is fine).
* Unique hostname, MAC address, and product_uuid for every node. See [here](#verify-mac-address) for more details.
* Certain ports are open on your machines. See [here](#check-required-ports) for more details.
-->
* 一台相容的 Linux 主機。Kubernetes 專案針對基於 Debian 與 Red Hat 的 Linux 發行版，
  以及未提供套件管理器的發行版，提供了通用的操作說明。
* 每台機器至少 2 GB 記憶體（低於此容量將幾乎沒有空間執行您的應用程式）。
* 控制平面機器至少需要 2 顆 CPU。
* 叢集中所有機器之間必須能完全互相連線（使用公開網路或私有網路皆可）。
* 每個節點都必須有唯一的主機名稱、MAC 位址與 product_uuid。
  詳情請參閱[此處](#verify-mac-address)。
* 機器上必須開放特定連接埠。詳情請參閱[此處](#check-required-ports)。

{{< note >}}
<!--
The `kubeadm` installation is done via binaries that use dynamic linking and assumes that your target system provides `glibc`.
This is a reasonable assumption on many Linux distributions (including Debian, Ubuntu, Fedora, CentOS, etc.)
but it is not always the case with custom and lightweight distributions which don't include `glibc` by default, such as Alpine Linux.
The expectation is that the distribution either includes `glibc` or a
[compatibility layer](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)
that provides the expected symbols.
-->
`kubeadm` 是透過採用動態連結的二進位檔進行安裝，因此會假設您的目標系統提供 `glibc`。
在許多 Linux 發行版（包括 Debian、Ubuntu、Fedora、CentOS 等）上，這是合理的假設；
但對於預設不含 `glibc` 的自訂或輕量化發行版（例如 Alpine Linux）則未必成立。
預期的情況是：該發行版本身包含 `glibc`，
或提供能夠提供所需符號（symbol）的[相容層](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)。
{{< /note >}}

<!-- steps -->

<!--
## Check your OS version
-->
## 檢查您的作業系統版本 {#check-your-os-version}

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

<!--
* The kubeadm project supports LTS kernels. See [List of LTS kernels](https://www.kernel.org/category/releases.html).
* You can get the kernel version using the command `uname -r`
-->
* kubeadm 專案支援 LTS 核心。請參閱 [LTS 核心列表](https://www.kernel.org/category/releases.html)。
* 您可以使用 `uname -r` 指令取得核心版本。

<!--
For more information, see [Linux Kernel Requirements](/docs/reference/node/kernel-version-requirements/).
-->
詳情請參閱 [Linux 核心需求](/docs/reference/node/kernel-version-requirements/)。

{{% /tab %}}

{{% tab name="Windows" %}}

<!--
* The kubeadm project supports recent kernel versions. For a list of recent kernels, see [Windows Server Release Information](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info).
* You can get the kernel version (also called the OS version) using the command `systeminfo`
-->
* kubeadm 專案支援較新的核心版本。近期核心版本的列表請參閱
  [Windows Server 發行資訊](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info)。
* 您可以使用 `systeminfo` 指令取得核心版本（也稱為作業系統版本）。

<!--
For more information, see [Windows OS version compatibility](/docs/concepts/windows/intro/#windows-os-version-support).
-->
詳情請參閱 [Windows 作業系統版本相容性](/docs/concepts/windows/intro/#windows-os-version-support)。

{{% /tab %}}
{{< /tabs >}}

<!--
A Kubernetes cluster created by kubeadm depends on software that use kernel features.
This software includes, but is not limited to the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}},
the {{< glossary_tooltip term_id="kubelet" text="kubelet">}}, and a {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}} plugin.
-->
由 kubeadm 建立的 Kubernetes 叢集，會依賴一些使用核心功能的軟體。
這些軟體包括但不限於{{< glossary_tooltip text="容器執行階段" term_id="container-runtime" >}}、
{{< glossary_tooltip term_id="kubelet" text="kubelet">}}，
以及 {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}（CNI，容器網路介面）外掛程式。

<!--
To help you avoid unexpected errors as a result of an unsupported kernel version, kubeadm runs the `SystemVerification`
pre-flight check. This check fails if the kernel version is not supported.
-->
為協助您避免因核心版本不受支援而產生非預期的錯誤，
kubeadm 會執行 `SystemVerification` 預檢（pre-flight check）。
若核心版本不受支援，這項檢查就會失敗。

<!--
You may choose to skip the check, if you know that your kernel
provides the required features, even though kubeadm does not support its version.
-->
如果您確定自己的核心已提供所需功能，即使 kubeadm 並不支援該版本，
您也可以選擇略過這項檢查。

<!--
## Verify the MAC address and product_uuid are unique for every node {#verify-mac-address}
-->
## 確認每個節點的 MAC 位址與 product_uuid 都是唯一的 {#verify-mac-address}

<!--
* You can get the MAC address of the network interfaces using the command `ip link` or `ifconfig -a`
* The product_uuid can be checked by using the command `sudo cat /sys/class/dmi/id/product_uuid`
-->
* 您可以使用 `ip link` 或 `ifconfig -a` 指令取得各網路介面的 MAC 位址。
* 您可以使用 `sudo cat /sys/class/dmi/id/product_uuid` 指令檢查 product_uuid。

<!--
It is very likely that hardware devices will have unique addresses, although some virtual machines may have
identical values. Kubernetes uses these values to uniquely identify the nodes in the cluster.
If these values are not unique to each node, the installation process
may [fail](https://github.com/kubernetes/kubeadm/issues/31).
-->
硬體裝置通常都會有唯一的位址，不過某些虛擬機器可能會出現相同的值。
Kubernetes 會利用這些值來唯一識別叢集中的節點。
如果這些值在各節點之間並非唯一，
安裝過程可能會[失敗](https://github.com/kubernetes/kubeadm/issues/31)。

<!--
## Check network adapters
-->
## 檢查網路介面卡 {#check-network-adapters}

<!--
If you have more than one network adapter, and your Kubernetes components are not reachable on the default
route, we recommend you add IP route(s) so Kubernetes cluster addresses go via the appropriate adapter.
-->
如果您有多張網路介面卡，且 Kubernetes 組件無法透過預設路由連線，
建議您新增 IP 路由，讓 Kubernetes 叢集位址經由適當的介面卡傳送。

<!--
## Check required ports {#check-required-ports}
-->
## 檢查必要的連接埠 {#check-required-ports}

<!--
These [required ports](/docs/reference/networking/ports-and-protocols/)
need to be open in order for Kubernetes components to communicate with each other.
You can use tools like [netcat](https://netcat.sourceforge.net) to check if a port is open. For example:
-->
為了讓 Kubernetes 組件之間能夠互相通訊，必須開放這些[必要的連接埠](/docs/reference/networking/ports-and-protocols/)。
您可以使用 [netcat](https://netcat.sourceforge.net) 之類的工具檢查連接埠是否已開放。例如：

```shell
nc 127.0.0.1 6443 -zv -w 2
```

<!--
The pod network plugin you use may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.
-->
您所使用的 Pod 網路外掛程式可能也需要開放特定的連接埠。
由於各個 Pod 網路外掛程式的需求不同，
請參閱該外掛程式的文件，以了解它需要哪些連接埠。

<!--
## Swap configuration {#swap-configuration}
-->
## Swap 設定 {#swap-configuration}

<!--
The default behavior of a kubelet is to fail to start if swap memory is detected on a node.
This means that swap should either be disabled or tolerated by kubelet.
-->
kubelet 的預設行為是：只要偵測到節點上有 swap 記憶體，就會啟動失敗。
這表示您必須停用 swap，或是讓 kubelet 容許 swap。

<!--
* To tolerate swap, add `failSwapOn: false` to kubelet configuration or as a command line argument.
  Note: even if `failSwapOn: false` is provided, workloads wouldn't have swap access by default.
  This can be changed by setting a `swapBehavior`, again in the kubelet configuration file. To use swap,
  set a `swapBehavior` other than the default `NoSwap` setting.
  See [Swap memory management](/docs/concepts/cluster-administration/swap-memory-management) for more details.
* To disable swap, `sudo swapoff -a` can be used to disable swapping temporarily.
  To make this change persistent across reboots, make sure swap is disabled in
  config files like `/etc/fstab`, `systemd.swap`, depending how it was configured on your system.
-->
* 若要容許 swap，請在 kubelet 設定中加入 `failSwapOn: false`，或以命令列參數的方式提供。
  請注意：即使指定了 `failSwapOn: false`，工作負載預設仍無法使用 swap。
  您可以在 kubelet 設定檔中設定 `swapBehavior` 來改變這個行為。
  若要使用 swap，請將 `swapBehavior` 設定為預設值 `NoSwap` 以外的選項。
  詳情請參閱 [Swap 記憶體管理](/docs/concepts/cluster-administration/swap-memory-management)。
* 若要停用 swap，可以使用 `sudo swapoff -a` 暫時關閉 swap。
  若要讓這項變更在重新開機後仍然有效，請依照您系統的設定方式，
  確認已在 `/etc/fstab`、`systemd.swap` 等設定檔中停用 swap。

<!--
## Installing a container runtime {#installing-runtime}
-->
## 安裝容器執行階段 {#installing-runtime}

<!--
To run containers in Pods, Kubernetes uses a
{{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.
-->
為了在 Pod 中執行容器，Kubernetes 會使用{{< glossary_tooltip term_id="container-runtime" text="容器執行階段" >}}。

<!--
By default, Kubernetes uses the
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
to interface with your chosen container runtime.
-->
預設情況下，Kubernetes 會透過 {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}}
（CRI，容器執行階段介面）與您所選擇的容器執行階段互動。

<!--
If you don't specify a runtime, kubeadm automatically tries to detect an installed
container runtime by scanning through a list of known endpoints.
-->
如果您沒有指定執行階段，kubeadm 會掃描一份已知端點的列表，
自動嘗試偵測已安裝的容器執行階段。

<!--
If multiple or no container runtimes are detected kubeadm will throw an error
and will request that you specify which one you want to use.
-->
若偵測到多個容器執行階段，或完全沒有偵測到，kubeadm 就會拋出錯誤，
並要求您指定想要使用哪一個。

<!--
See [container runtimes](/docs/setup/production-environment/container-runtimes/)
for more information.
-->
詳情請參閱[容器執行階段](/docs/setup/production-environment/container-runtimes/)。

{{< note >}}
<!--
Docker Engine does not implement the [CRI](/docs/concepts/architecture/cri/)
which is a requirement for a container runtime to work with Kubernetes.
For that reason, an additional service [cri-dockerd](https://mirantis.github.io/cri-dockerd/)
has to be installed. cri-dockerd is a project based on the legacy built-in
Docker Engine support that was [removed](/dockershim) from the kubelet in version 1.24.
-->
Docker Engine 並未實作 [CRI](/docs/concepts/architecture/cri/)，
而 CRI 是容器執行階段與 Kubernetes 搭配運作的必要條件。
因此，您必須額外安裝 [cri-dockerd](https://mirantis.github.io/cri-dockerd/) 服務。
cri-dockerd 這個專案源自 kubelet 內建的舊版 Docker Engine 支援，
該支援已在 1.24 版中從 kubelet [移除](/dockershim)。
{{< /note >}}

<!--
The tables below include the known endpoints for supported operating systems:
-->
下列表格列出各個受支援作業系統的已知端點：

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Linux 容器執行階段" >}}
<!--
| Runtime                            | Path to Unix domain socket                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (using cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
-->
| 執行階段                            | Unix domain socket 路徑                       |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine（使用 cri-dockerd）    | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Windows 容器執行階段" >}}
<!--
| Runtime                            | Path to Windows named pipe                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (using cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
-->
| 執行階段                            | Windows 具名管道路徑                          |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine（使用 cri-dockerd）    | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

<!--
## Installing kubeadm, kubelet and kubectl
-->
## 安裝 kubeadm、kubelet 與 kubectl {#installing-kubeadm-kubelet-and-kubectl}

<!--
You will install these packages on all of your machines:
-->
您需要在所有機器上安裝以下套件：

<!--
* `kubeadm`: the command to bootstrap the cluster.

* `kubelet`: the component that runs on all of the machines in your cluster
  and does things like starting pods and containers.

* `kubectl`: the command line util to talk to your cluster.
-->
* `kubeadm`：用來引導叢集的指令。

* `kubelet`：在叢集所有機器上執行的組件，
  負責啟動 Pod 與容器等工作。

* `kubectl`：用來與叢集溝通的命令列工具。

<!--
kubeadm **will not** install or manage `kubelet` or `kubectl` for you, so you will
need to ensure they match the version of the Kubernetes control plane you want
kubeadm to install for you. If you do not, there is a risk of a version skew occurring that
can lead to unexpected, buggy behaviour. However, _one_ minor version skew between the
kubelet and the control plane is supported, but the kubelet version may never exceed the API
server version. For example, the kubelet running 1.7.0 should be fully compatible with a 1.8.0 API server,
but not vice versa.
-->
kubeadm **不會**為您安裝或管理 `kubelet` 與 `kubectl`，
因此您必須自行確保它們的版本，與您希望 kubeadm 為您安裝的 Kubernetes 控制平面版本相符。
若沒有這麼做，就有可能發生版本偏差（version skew），導致非預期的錯誤行為。
不過，kubelet 與控制平面之間允許相差**一個**次要版本，
但 kubelet 的版本絕不可高於 API 伺服器的版本。
例如，執行 1.7.0 的 kubelet 可以與 1.8.0 的 API 伺服器完全相容，但反過來則不行。

<!--
For information about installing `kubectl`, see [Install and set up kubectl](/docs/tasks/tools/).
-->
關於安裝 `kubectl` 的資訊，請參閱[安裝與設定 kubectl](/docs/tasks/tools/)。

{{< warning >}}
<!--
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
-->
以下操作說明會將所有 Kubernetes 套件排除在系統升級之外。
這是因為 kubeadm 與 Kubernetes 的[升級需要特別留意](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
{{</ warning >}}

<!--
For more information on version skews, see:

* Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [version skew policy](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)
-->
關於版本偏差的更多資訊，請參閱：

* Kubernetes [版本與版本偏差政策](/docs/setup/release/version-skew-policy/)
* kubeadm 專屬的[版本偏差政策](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
<!--
There's a dedicated package repository for each Kubernetes minor version. If you want to install
a minor version other than v{{< skew currentVersion >}}, please see the installation guide for
your desired minor version.
-->
每個 Kubernetes 次要版本都有專屬的套件儲存庫。
如果您想安裝 v{{< skew currentVersion >}} 以外的次要版本，
請參閱您所需次要版本的安裝指南。
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="基於 Debian 的發行版" %}}

<!--
These instructions are for Kubernetes v{{< skew currentVersion >}}.
-->
以下操作說明適用於 Kubernetes v{{< skew currentVersion >}}。

<!--
1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:
-->
1. 更新 `apt` 套件索引，並安裝使用 Kubernetes `apt` 儲存庫所需的套件：

   ```shell
   sudo apt-get update
   # apt-transport-https 可能只是個空套件（dummy package）；若是如此，您可以略過該套件
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

<!--
2. Download the public signing key for the Kubernetes package repositories.
   The same signing key is used for all repositories so you can disregard the version in the URL:
-->
2. 下載 Kubernetes 套件儲存庫的公開簽署金鑰。
   所有儲存庫都使用同一組簽署金鑰，因此您可以忽略 URL 中的版本：

   ```shell
   # 如果 `/etc/apt/keyrings` 目錄不存在，應在執行 curl 指令之前先建立，請參閱下方的注意事項。
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
<!--
In releases older than Debian 12 and Ubuntu 22.04, directory `/etc/apt/keyrings` does not
exist by default, and it should be created before the curl command.
-->
在 Debian 12 與 Ubuntu 22.04 之前的版本中，`/etc/apt/keyrings` 目錄預設並不存在，
應在執行 curl 指令之前先建立它。
{{< /note >}}

<!--
3. Add the appropriate Kubernetes `apt` repository. Please note that this repository have packages
   only for Kubernetes {{< skew currentVersion >}}; for other Kubernetes minor versions, you need to
   change the Kubernetes minor version in the URL to match your desired minor version
   (you should also check that you are reading the documentation for the version of Kubernetes
   that you plan to install).
-->
3. 加入適當的 Kubernetes `apt` 儲存庫。請注意，此儲存庫只提供 Kubernetes
   {{< skew currentVersion >}} 的套件；若要使用其他 Kubernetes 次要版本，
   您必須將 URL 中的 Kubernetes 次要版本改為您想要的版本
   （同時也請確認您閱讀的是您打算安裝之 Kubernetes 版本的文件）。

   ```shell
   # 這會覆寫 /etc/apt/sources.list.d/kubernetes.list 中既有的所有設定
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

<!--
4. Update the `apt` package index, install kubelet, kubeadm and kubectl, and pin their version:
-->
4. 更新 `apt` 套件索引，安裝 kubelet、kubeadm 與 kubectl，並鎖定它們的版本：

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

<!--
5. (Optional) Enable the kubelet service before running kubeadm:
-->
5. （選用）在執行 kubeadm 之前先啟用 kubelet 服務：

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="基於 Red Hat 的發行版" %}}

<!--
1. Set SELinux to `permissive` mode:

   These instructions are for Kubernetes {{< skew currentVersion >}}.
-->
1. 將 SELinux 設定為 `permissive` 模式：

   以下操作說明適用於 Kubernetes {{< skew currentVersion >}}。

   ```shell
   # 將 SELinux 設為 permissive 模式（實際上等同於停用它）
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
<!--
- Setting SELinux in permissive mode by running `setenforce 0` and `sed ...`
  effectively disables it. This is required to allow containers to access the host
  filesystem; for example, some cluster network plugins require that. You have to
  do this until SELinux support is improved in the kubelet.
- You can leave SELinux enabled if you know how to configure it but it may require
  settings that are not supported by kubeadm.
-->
- 執行 `setenforce 0` 與 `sed ...` 將 SELinux 設為 permissive 模式，實際上等同於停用它。
  這是為了讓容器能夠存取主機的檔案系統；例如某些叢集網路外掛程式就有這項需求。
  在 kubelet 對 SELinux 的支援改善之前，您都必須這麼做。
- 如果您知道該如何設定 SELinux，也可以讓它保持啟用，
  但這可能需要一些 kubeadm 並不支援的設定。
{{< /caution >}}

<!--
2. Add the Kubernetes `yum` repository. The `exclude` parameter in the
   repository definition ensures that the packages related to Kubernetes are
   not upgraded upon running `yum update` as there's a special procedure that
   must be followed for upgrading Kubernetes. Please note that this repository
   have packages only for Kubernetes {{< skew currentVersion >}}; for other
   Kubernetes minor versions, you need to change the Kubernetes minor version
   in the URL to match your desired minor version (you should also check that
   you are reading the documentation for the version of Kubernetes that you
   plan to install).
-->
2. 加入 Kubernetes `yum` 儲存庫。儲存庫定義中的 `exclude` 參數可確保執行
   `yum update` 時不會升級 Kubernetes 相關套件，因為升級 Kubernetes 必須遵循特定的程序。
   請注意，此儲存庫只提供 Kubernetes {{< skew currentVersion >}} 的套件；
   若要使用其他 Kubernetes 次要版本，
   您必須將 URL 中的 Kubernetes 次要版本改為您想要的版本
   （同時也請確認您閱讀的是您打算安裝之 Kubernetes 版本的文件）。

   ```shell
   # 這會覆寫 /etc/yum.repos.d/kubernetes.repo 中既有的所有設定
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

<!--
3. Install kubelet, kubeadm and kubectl:

   For systems with DNF:
-->
3. 安裝 kubelet、kubeadm 與 kubectl：

   適用於使用 DNF 的系統：
   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```
   <!--
   For systems with DNF5:
   -->
   適用於使用 DNF5 的系統：
   ```shell
   sudo yum install -y kubelet kubeadm kubectl --setopt=disable_excludes=kubernetes
   ```

<!--
4. (Optional) Enable the kubelet service before running kubeadm:
-->
4. （選用）在執行 kubeadm 之前先啟用 kubelet 服務：

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="未使用套件管理器" %}}
<!--
Install CNI plugins (required for most pod network):
-->
安裝 CNI 外掛程式（大多數的 Pod 網路都需要）：

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

<!--
Define the directory to download command files:
-->
定義用來下載指令檔案的目錄：

{{< note >}}
<!--
The `DOWNLOAD_DIR` variable must be set to a writable directory.
If you are running Flatcar Container Linux, set `DOWNLOAD_DIR="/opt/bin"`.
-->
`DOWNLOAD_DIR` 變數必須設定為一個可寫入的目錄。
若您執行的是 Flatcar Container Linux，請設定 `DOWNLOAD_DIR="/opt/bin"`。
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

<!--
Optionally install crictl (required for interaction with the Container Runtime Interface (CRI), optional for kubeadm):
-->
您可以選擇性安裝 crictl（與 Container Runtime Interface（CRI）互動時必備，對 kubeadm 而言為選用）：

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

<!--
Install `kubeadm`, `kubelet` and add a `kubelet` systemd service:
-->
安裝 `kubeadm`、`kubelet`，並新增 `kubelet` 的 systemd 服務：

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
<!--
Please refer to the note in the [Before you begin](#before-you-begin) section for Linux distributions
that do not include `glibc` by default.
-->
關於預設未包含 `glibc` 的 Linux 發行版，請參閱[開始之前](#before-you-begin)一節中的注意事項。
{{< /note >}}

<!--
Install `kubectl` by following the instructions on [Install Tools page](/docs/tasks/tools/#kubectl).
-->
請依照[安裝工具頁面](/docs/tasks/tools/#kubectl)的說明來安裝 `kubectl`。

<!--
Optionally, enable the kubelet service before running kubeadm:
-->
您也可以選擇在執行 kubeadm 之前先啟用 kubelet 服務：

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
<!--
The Flatcar Container Linux distribution mounts the `/usr` directory as a read-only filesystem.
Before bootstrapping your cluster, you need to take additional steps to configure a writable directory.
See the [Kubeadm Troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
to learn how to set up a writable directory.
-->
Flatcar Container Linux 發行版會將 `/usr` 目錄掛載為唯讀檔案系統。
在引導叢集之前，您需要執行額外的步驟來設定一個可寫入的目錄。
請參閱 [kubeadm 疑難排解指南](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)，
以了解如何設定可寫入的目錄。
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

<!--
The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.
-->
此時 kubelet 會每隔幾秒重新啟動一次，因為它正處於當機重啟迴圈（crashloop）中，
等待 kubeadm 告訴它該做什麼。

<!--
## Configuring a cgroup driver
-->
## 設定 cgroup 驅動程式 {#configuring-a-cgroup-driver}

<!--
Both the container runtime and the kubelet have a property called
["cgroup driver"](/docs/setup/production-environment/container-runtimes/#cgroup-drivers), which is important
for the management of cgroups on Linux machines.
-->
容器執行階段與 kubelet 都有一個稱為
[「cgroup 驅動程式」](/docs/setup/production-environment/container-runtimes/#cgroup-drivers)的屬性，
它對於 Linux 機器上的 cgroup 管理相當重要。

{{< warning >}}
<!--
Matching the container runtime and kubelet cgroup drivers is required or otherwise the kubelet process will fail.

See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) for more details.
-->
容器執行階段與 kubelet 的 cgroup 驅動程式必須一致，否則 kubelet 行程將會失敗。

詳情請參閱[設定 cgroup 驅動程式](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
{{< /warning >}}

<!--
## Troubleshooting
-->
## 疑難排解 {#troubleshooting}

<!--
If you are running into difficulties with kubeadm, please consult our
[troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->
如果您在使用 kubeadm 時遇到困難，
請參閱我們的[疑難排解文件](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

## {{% heading "whatsnext" %}}

<!--
* [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
-->
* [使用 kubeadm 建立叢集](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
