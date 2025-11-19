---
title: 安裝 kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 20
  title: 安裝 kubeadm 設置工具
---
<!--
title: Installing kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 20
  title: Install the kubeadm setup tool
-->

<!-- overview -->

<!--
<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
This page shows how to install the `kubeadm` toolbox.
For information on how to create a cluster with kubeadm once you have performed this installation process,
see the [Creating a cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) page.
-->
<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
本頁面顯示如何安裝 `kubeadm` 工具箱。
有關在執行此安裝過程後如何使用 kubeadm 創建集羣的信息，
請參見[使用 kubeadm 創建集羣](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)。

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
* 一臺兼容的 Linux 主機。Kubernetes 項目爲基於 Debian 和 Red Hat 的 Linux
  發行版以及一些不提供包管理器的發行版提供通用的指令。
* 每臺機器 2 GB 或更多的 RAM（如果少於這個數字將會影響你應用的運行內存）。
* 控制平面機器需要 CPU 2 核心或更多。
* 集羣中的所有機器的網絡彼此均能相互連接（公網和內網都可以）。
* 節點之中不可以有重複的主機名、MAC 地址或 product_uuid。請參見[這裏](#verify-mac-address)瞭解更多詳細信息。
* 開啓機器上的某些端口。請參見[這裏](#check-required-ports)瞭解更多詳細信息。

{{< note >}}
<!--
The `kubeadm` installation is done via binaries that use dynamic linking and assumes that your target system provides `glibc`.
This is a reasonable assumption on many Linux distributions (including Debian, Ubuntu, Fedora, CentOS, etc.)
but it is not always the case with custom and lightweight distributions which don't include `glibc` by default, such as Alpine Linux.
The expectation is that the distribution either includes `glibc` or a
[compatibility layer](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)
that provides the expected symbols.
-->
`kubeadm` 的安裝是通過使用動態鏈接的二進制文件完成的，安裝時假設你的目標系統提供 `glibc`。
這個假設在許多 Linux 發行版（包括 Debian、Ubuntu、Fedora、CentOS 等）上是合理的，
但對於不包含默認 `glibc` 的自定義和輕量級發行版（如 Alpine Linux），情況並非總是如此。
預期的情況是，發行版要麼包含 `glibc`，
要麼提供了一個[兼容層](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)以提供所需的符號。
{{< /note >}}

<!-- steps -->

<!--
## Check your OS version
-->
## 檢查你的操作系統版本   {#check-your-os-version}

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

<!--
* The kubeadm project supports LTS kernels. See [List of LTS kernels](https://www.kernel.org/category/releases.html).
* You can get the kernel version using the command `uname -r`

For more information, see [Linux Kernel Requirements](/docs/reference/node/kernel-version-requirements/).
-->
* kubeadm 項目支持 LTS 內核。參閱 [LTS 內核列表](https://www.kernel.org/category/releases.html)。
* 你可以使用命令 `uname -r` 獲取內核版本。

欲瞭解更多信息，參閱 [Linux 內核要求](/zh-cn/docs/reference/node/kernel-version-requirements/)。

{{% /tab %}}

{{% tab name="Windows" %}}

<!--
* The kubeadm project supports recent kernel versions. For a list of recent kernels, see [Windows Server Release Information](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info).
* You can get the kernel version (also called the OS version) using the command `systeminfo`

For more information, see [Windows OS version compatibility](/docs/concepts/windows/intro/#windows-os-version-support).
-->
* kubeadm 項目支持最近的內核版本。有關最新內核的列表，參閱
  [Windows Server 版本信息](https://learn.microsoft.com/zh-cn/windows/release-health/windows-server-release-info)。
* 你可以使用命令 `systeminfo` 獲取內核版本（也稱爲操作系統版本）。

欲瞭解更多信息，參閱 [Windows 操作系統版本兼容性](/zh-cn/docs/concepts/windows/intro/#windows-os-version-support)。

{{% /tab %}}
{{< /tabs >}}

<!--
A Kubernetes cluster created by kubeadm depends on software that use kernel features.
This software includes, but is not limited to the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}},
the {{< glossary_tooltip term_id="kubelet" text="kubelet">}}, and a {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}} plugin.
-->
由 kubeadm 創建的 Kubernetes 集羣依賴於使用內核特性的相關軟件。  
這些軟件包括但不限於{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}、  
{{< glossary_tooltip term_id="kubelet" text="kubelet">}}
和{{< glossary_tooltip text="容器網絡接口（CNI）" term_id="cni" >}}插件。

<!--
To help you avoid unexpected errors as a result of an unsupported kernel version, kubeadm runs the `SystemVerification`
pre-flight check. This check fails if the kernel version is not supported.

You may choose to skip the check, if you know that your kernel
provides the required features, even though kubeadm does not support its version.
-->
爲幫助你避免因內核版本不受支持而引發的意外錯誤，kubeadm 運行 `SystemVerification` 執行預檢。  
如果內核版本不受支持，預檢將失敗。

如果你確認你的內核具備所需特性，儘管其版本不在 kubeadm 支持範圍內，你也可以選擇跳過此檢查。

<!--
## Verify the MAC address and product_uuid are unique for every node {#verify-mac-address}

* You can get the MAC address of the network interfaces using the command `ip link` or `ifconfig -a`
* The product_uuid can be checked by using the command `sudo cat /sys/class/dmi/id/product_uuid`

It is very likely that hardware devices will have unique addresses, although some virtual machines may have
identical values. Kubernetes uses these values to uniquely identify the nodes in the cluster.
If these values are not unique to each node, the installation process
may [fail](https://github.com/kubernetes/kubeadm/issues/31).
-->
## 確保每個節點上 MAC 地址和 product_uuid 的唯一性    {#verify-mac-address}

* 你可以使用命令 `ip link` 或 `ifconfig -a` 來獲取網絡接口的 MAC 地址
* 可以使用 `sudo cat /sys/class/dmi/id/product_uuid` 命令對 product_uuid 校驗

一般來講，硬件設備會擁有唯一的地址，但是有些虛擬機的地址可能會重複。
Kubernetes 使用這些值來唯一確定集羣中的節點。
如果這些值在每個節點上不唯一，可能會導致安裝[失敗](https://github.com/kubernetes/kubeadm/issues/31)。

<!--
## Check network adapters

If you have more than one network adapter, and your Kubernetes components are not reachable on the default
route, we recommend you add IP route(s) so Kubernetes cluster addresses go via the appropriate adapter.
-->
## 檢查網絡適配器   {#check-network-adapters}

如果你有一個以上的網絡適配器，同時你的 Kubernetes 組件通過默認路由不可達，我們建議你預先添加 IP 路由規則，
這樣 Kubernetes 集羣就可以通過對應的適配器完成連接。

<!--
## Check required ports {#check-required-ports}
These
These [required ports](/docs/reference/networking/ports-and-protocols/)
need to be open in order for Kubernetes components to communicate with each other.
You can use tools like [netcat](https://netcat.sourceforge.net) to check if a port is open. For example:
-->
## 檢查所需端口   {#check-required-ports}

啓用這些[必要的端口](/zh-cn/docs/reference/networking/ports-and-protocols/)後才能使 Kubernetes 的各組件相互通信。
可以使用 [netcat](https://netcat.sourceforge.net) 之類的工具來檢查端口是否開放，例如：

```shell
nc 127.0.0.1 6443 -zv -w 2
```

<!--
The pod network plugin you use may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.
-->
你使用的 Pod 網絡插件 (詳見後續章節) 也可能需要開啓某些特定端口。
由於各個 Pod 網絡插件的功能都有所不同，請參閱他們各自文檔中對端口的要求。

<!--
## Swap configuration {#swap-configuration}

The default behavior of a kubelet is to fail to start if swap memory is detected on a node.
This means that swap should either be disabled or tolerated by kubelet.

* To tolerate swap, add `failSwapOn: false` to kubelet configuration or as a command line argument.
  Note: even if `failSwapOn: false` is provided, workloads wouldn't have swap access by default.
  This can be changed by setting a `swapBehavior`, again in the kubelet configuration file. To use swap,
  set a `swapBehavior` other than the default `NoSwap` setting.
  See [Swap memory management](/docs/concepts/cluster-administration/swap-memory-management) for more details.
* To disable swap, `sudo swapoff -a` can be used to disable swapping temporarily.
  To make this change persistent across reboots, make sure swap is disabled in
  config files like `/etc/fstab`, `systemd.swap`, depending how it was configured on your system.
-->
## 交換分區的配置 {#swap-configuration}

kubelet 的默認行爲是在節點上檢測到交換內存時無法啓動。
這意味着要麼禁用交換（swap）功能，要麼讓 kubelet 容忍交換。

* 若需允許交換分區（swap），請在 kubelet 配置文件中添加 `failSwapOn: false`，或通過命令行參數指定。
  注意：即使設置了 `failSwapOn: false`，工作負載默認情況下仍無法訪問交換空間。
  可以通過在 kubelet 配置文件中設置 `swapBehavior` 來修改此設置。若要使用交換空間，
  請設置 `swapBehavior` 的值，這個值不能是默認的 `NoSwap`。
  更多細節參閱[交換內存管理](/zh-cn/docs/concepts/cluster-administration/swap-memory-management)。
* 要禁用交換分區（swap），可以使用命令 `sudo swapoff -a` 暫時關閉交換分區功能。
  要使此更改在重啓後仍然生效，請確保在系統的配置文件（如 `/etc/fstab` 或 `systemd.swap`）中禁用交換功能，
  具體取決於你的系統配置方式。

<!--
## Installing a container runtime {#installing-runtime}

To run containers in Pods, Kubernetes uses a
{{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.
-->
## 安裝容器運行時   {#installing-runtime}

爲了在 Pod 中運行容器，Kubernetes
使用{{< glossary_tooltip term_id="container-runtime" text="容器運行時（Container Runtime）" >}}。

<!--
By default, Kubernetes uses the
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
to interface with your chosen container runtime.

If you don't specify a runtime, kubeadm automatically tries to detect an installed
container runtime by scanning through a list of known endpoints.
-->
默認情況下，Kubernetes
使用{{< glossary_tooltip term_id="cri" text="容器運行時接口（Container Runtime Interface，CRI）" >}}
來與你所選擇的容器運行時交互。

如果你不指定運行時，kubeadm 會自動嘗試通過掃描已知的端點列表來檢測已安裝的容器運行時。

<!--
If multiple or no container runtimes are detected kubeadm will throw an error
and will request that you specify which one you want to use.

See [container runtimes](/docs/setup/production-environment/container-runtimes/)
for more information.
-->
如果檢測到有多個或者沒有容器運行時，kubeadm 將拋出一個錯誤並要求你指定一個想要使用的運行時。

參閱[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)以瞭解更多信息。

{{< note >}}
<!--
Docker Engine does not implement the [CRI](/docs/concepts/architecture/cri/)
which is a requirement for a container runtime to work with Kubernetes.
For that reason, an additional service [cri-dockerd](https://mirantis.github.io/cri-dockerd/)
has to be installed. cri-dockerd is a project based on the legacy built-in
Docker Engine support that was [removed](/dockershim) from the kubelet in version 1.24.
-->
Docker Engine 沒有實現 [CRI](/zh-cn/docs/concepts/architecture/cri/)，
而這是容器運行時在 Kubernetes 中工作所需要的。
爲此，必須安裝一個額外的服務 [cri-dockerd](https://mirantis.github.io/cri-dockerd/)。
cri-dockerd 是一個基於傳統的內置 Docker 引擎支持的項目，
它在 1.24 版本從 kubelet 中[移除](/zh-cn/dockershim)。
{{< /note >}}

<!--
The tables below include the known endpoints for supported operating systems:
-->
下面的表格包括被支持的操作系統的已知端點。

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Linux 容器運行時" >}}
<!--
| Runtime                            | Path to Unix domain socket                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (using cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
-->
| 運行時                              | Unix 域套接字                                 |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine（使用 cri-dockerd）    | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Windows 容器運行時" >}}
<!--
| Runtime                            | Path to Windows named pipe                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (using cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
-->
| 運行時                              |  Windows 命名管道路徑                          |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine（使用 cri-dockerd）    | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

<!--
## Installing kubeadm, kubelet and kubectl

You will install these packages on all of your machines:

* `kubeadm`: the command to bootstrap the cluster.

* `kubelet`: the component that runs on all of the machines in your cluster
  and does things like starting pods and containers.

* `kubectl`: the command line util to talk to your cluster.
-->
## 安裝 kubeadm、kubelet 和 kubectl   {#installing-kubeadm-kubelet-and-kubectl}

你需要在每臺機器上安裝以下的軟件包：

* `kubeadm`：用來初始化集羣的指令。

* `kubelet`：在集羣中的每個節點上用來啓動 Pod 和容器等。

* `kubectl`：用來與集羣通信的命令行工具。

<!--
kubeadm **will not** install or manage `kubelet` or `kubectl` for you, so you will
need to ensure they match the version of the Kubernetes control plane you want
kubeadm to install for you. If you do not, there is a risk of a version skew occurring that
can lead to unexpected, buggy behaviour. However, _one_ minor version skew between the
kubelet and the control plane is supported, but the kubelet version may never exceed the API
server version. For example, the kubelet running 1.7.0 should be fully compatible with a 1.8.0 API server,
but not vice versa.

For information about installing `kubectl`, see [Install and set up kubectl](/docs/tasks/tools/).
-->
kubeadm **不能**幫你安裝或者管理 `kubelet` 或 `kubectl`，
所以你需要確保它們與通過 kubeadm 安裝的控制平面的版本相匹配。
如果不這樣做，則存在發生版本偏差的風險，可能會導致一些預料之外的錯誤和問題。
然而，控制平面與 kubelet 之間可以存在**一個**次要版本的偏差，但 kubelet
的版本不可以超過 API 服務器的版本。
例如，1.7.0 版本的 kubelet 可以完全兼容 1.8.0 版本的 API 服務器，反之則不可以。

有關安裝 `kubectl` 的信息，請參閱[安裝和設置 kubectl](/zh-cn/docs/tasks/tools/) 文檔。

{{< warning >}}
<!--
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
-->
這些指南不包括系統升級時使用的所有 Kubernetes 程序包。這是因爲 kubeadm 和 Kubernetes
有[特殊的升級注意事項](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
{{</ warning >}}

<!--
For more information on version skews, see:

* Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [version skew policy](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)
-->
關於版本偏差的更多信息，請參閱以下文檔：

* Kubernetes [版本與版本間的偏差策略](/zh-cn/releases/version-skew-policy/)
* kubeadm 特定的[版本偏差策略](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
<!--
There's a dedicated package repository for each Kubernetes minor version. If you want to install
a minor version other than {{< skew currentVersion >}}, please see the installation guide for
your desired minor version.
-->
每個 Kubernetes 小版本都有一個專用的軟件包倉庫。
如果你想安裝 {{< skew currentVersion >}} 以外的次要版本，請參閱所需次要版本的安裝指南。
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="基於 Debian 的發行版" %}}

<!--
These instructions are for Kubernetes {{< skew currentVersion >}}.
-->
以下指令適用於 Kubernetes {{< skew currentVersion >}}.

<!--
1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:

   ```shell
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```
-->
1. 更新 `apt` 包索引並安裝使用 Kubernetes `apt` 倉庫所需要的包：

   ```shell
   sudo apt-get update
   # apt-transport-https 可能是一個虛擬包（dummy package）；如果是的話，你可以跳過安裝這個包
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

<!--
2. Download the public signing key for the Kubernetes package repositories.
   The same signing key is used for all repositories so you can disregard the version in the URL:

   ```shell
   # If the directory `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```
-->
2. 下載用於 Kubernetes 軟件包倉庫的公共簽名密鑰。所有倉庫都使用相同的簽名密鑰，因此你可以忽略URL中的版本：

   ```shell
   # 如果 `/etc/apt/keyrings` 目錄不存在，則應在 curl 命令之前創建它，請閱讀下面的註釋。
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
<!--
In releases older than Debian 12 and Ubuntu 22.04, directory `/etc/apt/keyrings` does not
exist by default, and it should be created before the curl command.
-->
在低於 Debian 12 和 Ubuntu 22.04 的發行版本中，`/etc/apt/keyrings` 默認不存在。
應在 curl 命令之前創建它。
{{< /note >}}

<!--
3. Add the appropriate Kubernetes `apt` repository. Please note that this repository have packages
   only for Kubernetes {{< skew currentVersion >}}; for other Kubernetes minor versions, you need to
   change the Kubernetes minor version in the URL to match your desired minor version
   (you should also check that you are reading the documentation for the version of Kubernetes
   that you plan to install).
-->
3. 添加 Kubernetes `apt` 倉庫。
   請注意，此倉庫僅包含適用於 Kubernetes {{< skew currentVersion >}} 的軟件包；
   對於其他 Kubernetes 次要版本，則需要更改 URL 中的 Kubernetes 次要版本以匹配你所需的次要版本
  （你還應該檢查正在閱讀的安裝文檔是否爲你計劃安裝的 Kubernetes 版本的文檔）。

   <!--
   ```shell
   # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```
   -->
   ```shell
   # 此操作會覆蓋 /etc/apt/sources.list.d/kubernetes.list 中現存的所有配置。
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

<!--
4. Update `apt` package index, install kubelet, kubeadm and kubectl, and pin their version:
-->
4. 更新 `apt` 包索引，安裝 kubelet、kubeadm 和 kubectl，並鎖定其版本：

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

<!--
5. (Optional) Enable the kubelet service before running kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```
-->
5. （可選）先啓用 kubelet 服務，再運行 kubeadm：

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}

{{% tab name="基於 Red Hat 的發行版" %}}

<!--
1. Set SELinux to `permissive` mode:

   These instructions are for Kubernetes {{< skew currentVersion >}}.

   ```shell
   # Set SELinux in permissive mode (effectively disabling it)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```
-->
1. 將 SELinux 設置爲 `permissive` 模式：

   以下指令適用於 Kubernetes {{< skew currentVersion >}}。

   ```shell
   # 將 SELinux 設置爲 permissive 模式（相當於將其禁用）
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
- 通過運行命令 `setenforce 0` 和 `sed ...` 將 SELinux 設置爲 permissive 模式相當於將其禁用。
  這是允許容器訪問主機文件系統所必需的，例如，某些容器網絡插件需要這一能力。
  你必須這麼做，直到 kubelet 改進其對 SELinux 的支持。
- 如果你知道如何配置 SELinux 則可以將其保持啓用狀態，但可能需要設定部分 kubeadm 不支持的配置。
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

   ```shell
   # This overwrites any existing configuration in /etc/yum.repos.d/kubernetes.repo
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
-->
2. 添加 Kubernetes 的 `yum` 倉庫。在倉庫定義中的 `exclude` 參數確保了與
   Kubernetes 相關的軟件包在運行 `yum update` 時不會升級，因爲升級
   Kubernetes 需要遵循特定的過程。請注意，此倉庫僅包含適用於
   Kubernetes {{< skew currentVersion >}} 的軟件包；
   對於其他 Kubernetes 次要版本，則需要更改 URL 中的 Kubernetes 次要版本以匹配你所需的次要版本
  （你還應該檢查正在閱讀的安裝文檔是否爲你計劃安裝的 Kubernetes 版本的文檔）。

   ```shell
   # 此操作會覆蓋 /etc/yum.repos.d/kubernetes.repo 中現存的所有配置
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
3. Install kubelet, kubeadm and kubectl, and enable kubelet to ensure it's automatically started on startup:
-->
3. 安裝 kubelet、kubeadm 和 kubectl，並啓用 kubelet 以確保它在啓動時自動啓動:

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="無包管理器的情況" %}}
<!--
Install CNI plugins (required for most pod network):
-->
安裝 CNI 插件（大多數 Pod 網絡都需要）：

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
定義要下載命令文件的目錄：

{{< note >}}
<!--
The `DOWNLOAD_DIR` variable must be set to a writable directory.
If you are running Flatcar Container Linux, set `DOWNLOAD_DIR="/opt/bin"`.
-->
`DOWNLOAD_DIR` 變量必須被設置爲一個可寫入的目錄。
如果你在運行 Flatcar Container Linux，可設置 `DOWNLOAD_DIR="/opt/bin"`。
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

<!--
Optionally install crictl (required for interaction with the Container Runtime Interface (CRI), optional for kubeadm):
-->
可以選擇安裝 crictl（與容器運行時接口 (CRI) 交互時必需，但對 kubeadm 來說是可選的）：

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

<!--
Install `kubeadm`, `kubelet`, `kubectl` and add a `kubelet` systemd service:
-->
安裝 `kubeadm`、`kubelet`、`kubectl` 並添加 `kubelet` 系統服務：

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
對於默認不包括 `glibc` 的 Linux 發行版，請參閱[開始之前](#before-you-begin)一節的註釋。
{{< /note >}}

<!--
Install `kubectl` by following the instructions on [Install Tools page](/docs/tasks/tools/#kubectl).
Enable and start `kubelet`:
-->
請參照[安裝工具頁面](/zh-cn/docs/tasks/tools/#kubectl)的說明安裝 `kubelet`。
激活並啓動 `kubelet`：

```bash
systemctl enable --now kubelet
```

{{< note >}}
<!--
The Flatcar Container Linux distribution mounts the `/usr` directory as a read-only filesystem.
Before bootstrapping your cluster, you need to take additional steps to configure a writable directory.
See the [Kubeadm Troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
to learn how to set up a writable directory.
-->
Flatcar Container Linux 發行版會將 `/usr/` 目錄掛載爲一個只讀文件系統。
在啓動引導你的集羣之前，你需要執行一些額外的操作來配置一個可寫入的目錄。
參見 [kubeadm 故障排查指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
以瞭解如何配置一個可寫入的目錄。
{{< /note >}}

{{% /tab %}}
{{< /tabs >}}

<!--
The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.
-->
kubelet 現在每隔幾秒就會重啓，因爲它陷入了一個等待 kubeadm 指令的死循環。

<!--
## Configuring a cgroup driver

Both the container runtime and the kubelet have a property called
["cgroup driver"](/docs/setup/production-environment/container-runtimes/#cgroup-drivers), which is important
for the management of cgroups on Linux machines.
-->
## 配置 cgroup 驅動程序  {#configuring-a-cgroup-driver}

容器運行時和 kubelet 都具有名字爲
["cgroup driver"](/zh-cn/docs/setup/production-environment/container-runtimes/#cgroup-drivers)
的屬性，該屬性對於在 Linux 機器上管理 CGroups 而言非常重要。

{{< warning >}}
<!--
Matching the container runtime and kubelet cgroup drivers is required or otherwise the kubelet process will fail.

See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) for more details.
-->
你需要確保容器運行時和 kubelet 所使用的是相同的 cgroup 驅動，否則 kubelet
進程會失敗。

相關細節可參見[配置 cgroup 驅動](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
{{< /warning >}}

<!--
## Troubleshooting

If you are running into difficulties with kubeadm, please consult our
[troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->
## 故障排查   {#troubleshooting}

如果你在使用 kubeadm 時遇到困難，
請參閱我們的[故障排查文檔](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

## {{% heading "whatsnext" %}}

<!--
* [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
-->
* [使用 kubeadm 創建集羣](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
