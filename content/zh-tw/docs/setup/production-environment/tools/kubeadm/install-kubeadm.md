---
title: 安裝 kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 20
  title: 安裝 kubeadm 設定工具
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
<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">This page shows how to install the `kubeadm` toolbox.
For information on how to create a cluster with kubeadm once you have performed this installation process, see the [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) page.
-->
<img src="/images/kubeadm-stacked-color.png" align="right" width="150px">本頁面顯示如何安裝 `kubeadm` 工具箱。
有關在執行此安裝過程後如何使用 kubeadm 建立叢集的資訊，請參見
[使用 kubeadm 建立叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) 頁面。

## {{% heading "prerequisites" %}}

<!--
* A compatible Linux host. The Kubernetes project provides generic instructions for Linux distributions based on Debian and Red Hat, and those distributions without a package manager.
* 2 GB or more of RAM per machine (any less will leave little room for your apps)
* 2 CPUs or more
* Full network connectivity between all machines in the cluster (public or private network is fine)
* Unique hostname, MAC address, and product_uuid for every node. See [here](#verify-mac-address) for more details.
* Certain ports are open on your machines. See [here](#check-required-ports) for more details.
* Swap disabled. You **MUST** disable swap in order for the kubelet to work properly.
-->
* 一臺相容的 Linux 主機。Kubernetes 專案為基於 Debian 和 Red Hat 的 Linux
  發行版以及一些不提供包管理器的發行版提供通用的指令
* 每臺機器 2 GB 或更多的 RAM （如果少於這個數字將會影響你應用的執行記憶體)
* 2 CPU 核或更多
* 叢集中的所有機器的網路彼此均能相互連線(公網和內網都可以)
* 節點之中不可以有重複的主機名、MAC 地址或 product_uuid。請參見[這裡](#verify-mac-address)瞭解更多詳細資訊。
* 開啟機器上的某些埠。請參見[這裡](#check-required-ports) 瞭解更多詳細資訊。
* 禁用交換分割槽。為了保證 kubelet 正常工作，你 **必須** 禁用交換分割槽。

<!-- steps -->

<!--
## Verify the MAC address and product_uuid are unique for every node

* You can get the MAC address of the network interfaces using the command `ip link` or `ifconfig -a`
* The product_uuid can be checked by using the command `sudo cat /sys/class/dmi/id/product_uuid`

It is very likely that hardware devices will have unique addresses, although some virtual machines may have
identical values. Kubernetes uses these values to uniquely identify the nodes in the cluster.
If these values are not unique to each node, the installation process
may [fail](https://github.com/kubernetes/kubeadm/issues/31).
-->
## 確保每個節點上 MAC 地址和 product_uuid 的唯一性    {#verify-mac-address}

* 你可以使用命令 `ip link` 或 `ifconfig -a` 來獲取網路介面的 MAC 地址
* 可以使用 `sudo cat /sys/class/dmi/id/product_uuid` 命令對 product_uuid 校驗

一般來講，硬體裝置會擁有唯一的地址，但是有些虛擬機器的地址可能會重複。
Kubernetes 使用這些值來唯一確定叢集中的節點。
如果這些值在每個節點上不唯一，可能會導致安裝
[失敗](https://github.com/kubernetes/kubeadm/issues/31)。

<!--
## Check network adapters

If you have more than one network adapter, and your Kubernetes components are not reachable on the default
route, we recommend you add IP route(s) so Kubernetes cluster addresses go via the appropriate adapter.
-->
## 檢查網路介面卡

如果你有一個以上的網路介面卡，同時你的 Kubernetes 元件透過預設路由不可達，我們建議你預先新增 IP 路由規則，這樣 Kubernetes 叢集就可以透過對應的介面卡完成連線。

<!--
## Letting iptables see bridged traffic

Make sure that the `br_netfilter` module is loaded. This can be done by running `lsmod | grep br_netfilter`. To load it explicitly call `sudo modprobe br_netfilter`.

As a requirement for your Linux Node's iptables to correctly see bridged traffic, you should ensure `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config, e.g.
-->
## 允許 iptables 檢查橋接流量

確保 `br_netfilter` 模組被載入。這一操作可以透過執行 `lsmod | grep br_netfilter`
來完成。若要顯式載入該模組，可執行 `sudo modprobe br_netfilter`。

為了讓你的 Linux 節點上的 iptables 能夠正確地檢視橋接流量，你需要確保在你的
`sysctl` 配置中將 `net.bridge.bridge-nf-call-iptables` 設定為 1。例如：

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

<!--
For more details please see the [Network Plugin Requirements](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements) page.
-->
更多的相關細節可檢視[網路外掛需求](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements)頁面。

<!--
## Check required ports
These
[required ports](/docs/reference/ports-and-protocols/)
need to be open in order for Kubernetes components to communicate with each other. You can use tools like netcat to check if a port is open. For example:
-->

## 檢查所需埠{#check-required-ports}

啟用這些[必要的埠](/zh-cn/docs/reference/ports-and-protocols/)後才能使 Kubernetes 的各元件相互通訊。可以使用 netcat 之類的工具來檢查埠是否啟用，例如：

```shell
nc 127.0.0.1 6443
```

<!--
The pod network plugin you use may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.
-->
你使用的 Pod 網路外掛 (詳見後續章節) 也可能需要開啟某些特定埠。由於各個 Pod 網路外掛的功能都有所不同，
請參閱他們各自文件中對埠的要求。

<!--
## Installing a container runtime {#installing-runtime}

To run containers in Pods, Kubernetes uses a
{{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.
-->
## 安裝容器執行時{#installing-runtime}

為了在 Pod 中執行容器，Kubernetes 使用
{{< glossary_tooltip term_id="container-runtime" text="容器執行時（Container Runtime）" >}}。

<!--
By default, Kubernetes uses the
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
to interface with your chosen container runtime.

If you don't specify a runtime, kubeadm automatically tries to detect an installed
container runtime by scanning through a list of known endpoints.
-->
預設情況下，Kubernetes 使用
{{< glossary_tooltip term_id="cri" text="容器執行時介面（Container Runtime Interface，CRI）" >}}
來與你所選擇的容器執行時互動。

如果你不指定執行時，kubeadm 會自動嘗試透過掃描已知的端點列表來檢測已安裝的容器執行時。

<!--
If multiple or no container runtimes are detected kubeadm will throw an error
and will request that you specify which one you want to use.

See [container runtimes](/docs/setup/production-environment/container-runtimes/)
for more information.
-->
如果檢測到有多個或者沒有容器執行時，kubeadm 將丟擲一個錯誤並要求你指定一個想要使用的執行時。

參閱[容器執行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
以瞭解更多資訊。

<!--
{{< note >}}
Docker Engine does not implement the [CRI](/docs/concepts/architecture/cri/)
which is a requirement for a container runtime to work with Kubernetes.
For that reason, an additional service [cri-dockerd](https://github.com/Mirantis/cri-dockerd)
has to be installed. cri-dockerd is a project based on the legacy built-in
Docker Engine support that was [removed](/dockershim) from the kubelet in version 1.24.
-->

{{< note >}}
Docker Engine 沒有實現 [CRI](/zh-cn/docs/concepts/architecture/cri/)，而這是容器執行時在 Kubernetes 中工作所需要的。
為此，必須安裝一個額外的服務 [cri-dockerd](https://github.com/Mirantis/cri-dockerd)。
cri-dockerd 是一個基於傳統的內建Docker引擎支援的專案，它在 1.24 版本從 kubelet 中[移除](/zh-cn/dockershim)。
{{< /note >}}

<!--
The tables below include the known endpoints for supported operating systems:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}
-->
下面的表格包括被支援的作業系統的已知端點。

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

<!--
{{< table >}}
| Runtime                            | Path to Unix domain socket                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (using cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}
-->
{{< table >}}
| 執行時                              | Unix 域套接字                                     |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (使用 cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

<!--
{{% tab name="Windows" %}}

{{< table >}}
| Runtime                            | Path to Windows named pipe                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (using cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}
-->
{{% tab name="Windows" %}}

{{< table >}}
| 執行時                              |  Windows 命名管道路徑                         |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (使用 cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

<!--
## Installing kubeadm, kubelet and kubectl

You will install these packages on all of your machines:

* `kubeadm`: the command to bootstrap the cluster.

* `kubelet`: the component that runs on all of the machines in your cluster
    and does things like starting pods and containers.

* `kubectl`: the command line util to talk to your cluster.

kubeadm **will not** install or manage `kubelet` or `kubectl` for you, so you will
need to ensure they match the version of the Kubernetes control plane you want
kubeadm to install for you. If you do not, there is a risk of a version skew occurring that
can lead to unexpected, buggy behaviour. However, _one_ minor version skew between the
kubelet and the control plane is supported, but the kubelet version may never exceed the API
server version. For example, kubelets running 1.7.0 should be fully compatible with a 1.8.0 API server,
but not vice versa.

For information about installing `kubectl`, see [Install and set up kubectl](/docs/tasks/tools/).
-->
## 安裝 kubeadm、kubelet 和 kubectl

你需要在每臺機器上安裝以下的軟體包：

* `kubeadm`：用來初始化叢集的指令。

* `kubelet`：在叢集中的每個節點上用來啟動 Pod 和容器等。

* `kubectl`：用來與叢集通訊的命令列工具。

kubeadm **不能** 幫你安裝或者管理 `kubelet` 或 `kubectl`，所以你需要
確保它們與透過 kubeadm 安裝的控制平面的版本相匹配。
如果不這樣做，則存在發生版本偏差的風險，可能會導致一些預料之外的錯誤和問題。
然而，控制平面與 kubelet 間的相差一個次要版本不一致是支援的，但 kubelet
的版本不可以超過 API 伺服器的版本。
例如，1.7.0 版本的 kubelet 可以完全相容 1.8.0 版本的 API 伺服器，反之則不可以。

有關安裝 `kubectl` 的資訊，請參閱[安裝和設定 kubectl](/zh-cn/docs/tasks/tools/)文件。

{{< warning >}}
<!--
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/).
-->
這些指南不包括系統升級時使用的所有 Kubernetes 程式包。這是因為 kubeadm 和 Kubernetes
有[特殊的升級注意事項](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
{{</ warning >}}

<!--
For more information on version skews, see:

* Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [version skew policy](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)
-->
關於版本偏差的更多資訊，請參閱以下文件：

* Kubernetes [版本與版本間的偏差策略](/zh-cn/docs/setup/release/version-skew-policy/)
* Kubeadm 特定的[版本偏差策略](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="基於 Debian 的發行版" %}}

<!--
1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:
-->
1. 更新 `apt` 包索引並安裝使用 Kubernetes `apt` 倉庫所需要的包：

   ```shell
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl
   ```

<!--
2. Download the Google Cloud public signing key:
-->
2. 下載 Google Cloud 公開簽名秘鑰：

   ```shell
   sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
   ```

<!--
3. Add the Kubernetes `apt` repository:
-->
3. 新增 Kubernetes `apt` 倉庫：

   ```shell
   echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
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

{{% /tab %}}

{{% tab name="基於 Red Hat 的發行版" %}}

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF

# 將 SELinux 設定為 permissive 模式（相當於將其禁用）
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

sudo systemctl enable --now kubelet
```

<!--
  **Note:**

  - Setting SELinux in permissive mode by running `setenforce 0` and `sed ...` effectively disables it.
    This is required to allow containers to access the host filesystem, which is needed by pod networks for example.
    You have to do this until SELinux support is improved in the kubelet.

  - You can leave SELinux enabled if you know how to configure it but it may require settings that are not supported by kubeadm.
  - If the `baseurl` fails because your Red Hat-based distribution cannot interpret `basearch`, replace `\$basearch` with your computer's architecture.
    Type `uname -m` to see that value.
    For example, the `baseurl` URL for `x86_64` could be: `https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64`.
-->
**請注意：**

- 透過執行命令 `setenforce 0` 和 `sed ...` 將 SELinux 設定為 permissive 模式
  可以有效地將其禁用。
  這是允許容器訪問主機檔案系統所必需的，而這些操作時為了例如 Pod 網路工作正常。

  你必須這麼做，直到 kubelet 做出對 SELinux 的支援進行升級為止。

- 如果你知道如何配置 SELinux 則可以將其保持啟用狀態，但可能需要設定 kubeadm 不支援的部分配置
- 如果由於該 Red Hat 的發行版無法解析 `basearch` 導致獲取 `baseurl` 失敗，請將 `\$basearch` 替換為你計算機的架構。
  輸入 `uname -m` 以檢視該值。
  例如，`x86_64` 的 `baseurl` URL 可以是：`https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64`。

{{% /tab %}}
{{% tab name="無包管理器的情況" %}}

<!--
Install CNI plugins (required for most pod network):
-->
安裝 CNI 外掛（大多數 Pod 網路都需要）：

```bash
CNI_VERSION="v0.8.2"
ARCH="amd64"
sudo mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-${ARCH}-${CNI_VERSION}.tgz" | sudo tar -C /opt/cni/bin -xz
```

<!--
Define the directory to download command files
-->
定義要下載命令檔案的目錄。

{{< note >}}
<!--
The `DOWNLOAD_DIR` variable must be set to a writable directory.
If you are running Flatcar Container Linux, set `DOWNLOAD_DIR=/opt/bin`.
-->
`DOWNLOAD_DIR` 變數必須被設定為一個可寫入的目錄。
如果你在執行 Flatcar Container Linux，可將 `DOWNLOAD_DIR` 設定為 `/opt/bin`。
{{< /note >}}

```bash
DOWNLOAD_DIR=/usr/local/bin
sudo mkdir -p $DOWNLOAD_DIR
```

<!--
Install crictl (required for kubeadm / Kubelet Container Runtime Interface (CRI))
-->
安裝 crictl（kubeadm/kubelet 容器執行時介面（CRI）所需）

```bash
CRICTL_VERSION="v1.22.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

<!--
Install `kubeadm`, `kubelet`, `kubectl` and add a `kubelet` systemd service:
-->
安裝 `kubeadm`、`kubelet`、`kubectl` 並新增 `kubelet` 系統服務：

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://storage.googleapis.com/kubernetes-release/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet,kubectl}
sudo chmod +x {kubeadm,kubelet,kubectl}

RELEASE_VERSION="v0.4.0"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service
sudo mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

<!--
Enable and start `kubelet`:
-->
啟用並啟動 `kubelet`：

```bash
systemctl enable --now kubelet
```

{{< note >}}
<!--
The Flatcar Container Linux distribution mounts the `/usr` directory as a read-only filesystem.
Before bootstrapping your cluster, you need to take additional steps to configure a writable directory.
See the [Kubeadm Troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only/) to learn how to set up a writable directory.
-->
Flatcar Container Linux 發行版會將 `/usr/` 目錄掛載為一個只讀檔案系統。
在啟動引導你的叢集之前，你需要執行一些額外的操作來配置一個可寫入的目錄。
參見 [kubeadm 故障排查指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only/)
以瞭解如何配置一個可寫入的目錄。
{{< /note >}}

{{% /tab %}}
{{< /tabs >}}

<!--
The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.
-->
kubelet 現在每隔幾秒就會重啟，因為它陷入了一個等待 kubeadm 指令的死迴圈。

<!--
## Configure cgroup driver

Both the container runtime and the kubelet have a property called
["cgroup driver"](/docs/setup/production-environment/container-runtimes/), which is important
for the management of cgroups on Linux machines.
-->
## 配置 cgroup 驅動程式  {#configure-cgroup-driver}

容器執行時和 kubelet 都具有名字為
["cgroup driver"](/zh-cn/docs/setup/production-environment/container-runtimes/)
的屬性，該屬性對於在 Linux 機器上管理 CGroups 而言非常重要。

{{< warning >}}
<!--
Matching the container runtime and kubelet cgroup drivers is required or otherwise the kubelet process will fail.

See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) for more details.
-->
你需要確保容器執行時和 kubelet 所使用的是相同的 cgroup 驅動，否則 kubelet
程序會失敗。

相關細節可參見[配置 cgroup 驅動](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
{{< /warning >}}

<!--
## Troubleshooting

If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->
## 故障排查   {#troubleshooting}

如果你在使用 kubeadm 時遇到困難，請參閱我們的
[故障排查文件](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

## {{% heading "whatsnext" %}}

<!--
* [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
-->
* [使用 kubeadm 建立叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
