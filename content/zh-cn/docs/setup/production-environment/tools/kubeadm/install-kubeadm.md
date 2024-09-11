---
title: 安装 kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 20
  title: 安装 kubeadm 设置工具
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
本页面显示如何安装 `kubeadm` 工具箱。
有关在执行此安装过程后如何使用 kubeadm 创建集群的信息，
请参见[使用 kubeadm 创建集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)。

{{< doc-versions-list "installation guide" >}}

## {{% heading "prerequisites" %}}

<!--
* A compatible Linux host. The Kubernetes project provides generic instructions for Linux distributions
  based on Debian and Red Hat, and those distributions without a package manager.
* 2 GB or more of RAM per machine (any less will leave little room for your apps).
* 2 CPUs or more.
* Full network connectivity between all machines in the cluster (public or private network is fine).
* Unique hostname, MAC address, and product_uuid for every node. See [here](#verify-mac-address) for more details.
* Certain ports are open on your machines. See [here](#check-required-ports) for more details.
* Swap configuration. The default behavior of a kubelet was to fail to start if swap memory was detected on a node.
  See [Swap memory management](/docs/concepts/architecture/nodes/#swap-memory) for more details.
  * You **MUST** disable swap if the kubelet is not properly configured to use swap. For example, `sudo swapoff -a`
    will disable swapping temporarily. To make this change persistent across reboots, make sure swap is disabled in
    config files like `/etc/fstab`, `systemd.swap`, depending how it was configured on your system.
-->
* 一台兼容的 Linux 主机。Kubernetes 项目为基于 Debian 和 Red Hat 的 Linux
  发行版以及一些不提供包管理器的发行版提供通用的指令。
* 每台机器 2 GB 或更多的 RAM（如果少于这个数字将会影响你应用的运行内存）。
* CPU 2 核心及以上。
* 集群中的所有机器的网络彼此均能相互连接（公网和内网都可以）。
* 节点之中不可以有重复的主机名、MAC 地址或 product_uuid。请参见[这里](#verify-mac-address)了解更多详细信息。
* 开启机器上的某些端口。请参见[这里](#check-required-ports)了解更多详细信息。
* 交换分区的配置。kubelet 的默认行为是在节点上检测到交换内存时无法启动。
  更多细节参阅[交换内存管理](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)。
  * 如果 kubelet 未被正确配置使用交换分区，则你**必须**禁用交换分区。
    例如，`sudo swapoff -a` 将暂时禁用交换分区。要使此更改在重启后保持不变，请确保在如
    `/etc/fstab`、`systemd.swap` 等配置文件中禁用交换分区，具体取决于你的系统如何配置。

<!-- steps -->

{{< note >}}
<!--
The `kubeadm` installation is done via binaries that use dynamic linking and assumes that your target system provides `glibc`.
This is a reasonable assumption on many Linux distributions (including Debian, Ubuntu, Fedora, CentOS, etc.)
but it is not always the case with custom and lightweight distributions which don't include `glibc` by default, such as Alpine Linux.
The expectation is that the distribution either includes `glibc` or a [compatibility layer](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)
that provides the expected symbols.
-->
`kubeadm` 的安装是通过使用动态链接的二进制文件完成的，安装时假设你的目标系统提供 `glibc`。
这个假设在许多 Linux 发行版（包括 Debian、Ubuntu、Fedora、CentOS 等）上是合理的，
但对于不包含默认 `glibc` 的自定义和轻量级发行版（如 Alpine Linux），情况并非总是如此。
预期的情况是，发行版要么包含 `glibc`，
要么提供了一个[兼容层](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)以提供所需的符号。
{{< /note >}}

<!--
## Verify the MAC address and product_uuid are unique for every node {#verify-mac-address}

* You can get the MAC address of the network interfaces using the command `ip link` or `ifconfig -a`
* The product_uuid can be checked by using the command `sudo cat /sys/class/dmi/id/product_uuid`

It is very likely that hardware devices will have unique addresses, although some virtual machines may have
identical values. Kubernetes uses these values to uniquely identify the nodes in the cluster.
If these values are not unique to each node, the installation process
may [fail](https://github.com/kubernetes/kubeadm/issues/31).
-->
## 确保每个节点上 MAC 地址和 product_uuid 的唯一性    {#verify-mac-address}

* 你可以使用命令 `ip link` 或 `ifconfig -a` 来获取网络接口的 MAC 地址
* 可以使用 `sudo cat /sys/class/dmi/id/product_uuid` 命令对 product_uuid 校验

一般来讲，硬件设备会拥有唯一的地址，但是有些虚拟机的地址可能会重复。
Kubernetes 使用这些值来唯一确定集群中的节点。
如果这些值在每个节点上不唯一，可能会导致安装[失败](https://github.com/kubernetes/kubeadm/issues/31)。

<!--
## Check network adapters

If you have more than one network adapter, and your Kubernetes components are not reachable on the default
route, we recommend you add IP route(s) so Kubernetes cluster addresses go via the appropriate adapter.
-->
## 检查网络适配器   {#check-network-adapters}

如果你有一个以上的网络适配器，同时你的 Kubernetes 组件通过默认路由不可达，我们建议你预先添加 IP 路由规则，
这样 Kubernetes 集群就可以通过对应的适配器完成连接。

<!--
## Check required ports {#check-required-ports}
These
These [required ports](/docs/reference/networking/ports-and-protocols/)
need to be open in order for Kubernetes components to communicate with each other.
You can use tools like [netcat](https://netcat.sourceforge.net) to check if a port is open. For example:
-->
## 检查所需端口   {#check-required-ports}

启用这些[必要的端口](/zh-cn/docs/reference/networking/ports-and-protocols/)后才能使 Kubernetes 的各组件相互通信。
可以使用 [netcat](https://netcat.sourceforge.net) 之类的工具来检查端口是否开放，例如：

```shell
nc 127.0.0.1 6443 -v
```

<!--
The pod network plugin you use may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.
-->
你使用的 Pod 网络插件 (详见后续章节) 也可能需要开启某些特定端口。
由于各个 Pod 网络插件的功能都有所不同，请参阅他们各自文档中对端口的要求。

<!--
## Swap configuration {#swap-configuration}

The default behavior of a kubelet is to fail to start if swap memory is detected on a node.
This means that swap should either be disabled or tolerated by kubelet.

* To tolerate swap, add `failSwapOn: false` to kubelet configuration or as a command line argument.
  Note: even if `failSwapOn: false` is provided, workloads wouldn't have swap access by default.
  This can be changed by setting a `swapBehavior`, again in the kubelet configuration file. To use swap,
  set a `swapBehavior` other than the default `NoSwap` setting.
  See [Swap memory management](/docs/concepts/architecture/nodes/#swap-memory) for more details.
* To disable swap, `sudo swapoff -a` can be used to disable swapping temporarily.
  To make this change persistent across reboots, make sure swap is disabled in
  config files like `/etc/fstab`, `systemd.swap`, depending how it was configured on your system.
-->
## 交换分区的配置 {#swap-configuration}

kubelet 的默认行为是在节点上检测到交换内存时无法启动。
这意味着要么禁用交换（swap）功能，要么让 kubelet 容忍交换。

* 若需允许交换分区（swap），请在 kubelet 配置文件中添加 `failSwapOn: false`，或通过命令行参数指定。
  注意：即使设置了 `failSwapOn: false`，工作负载默认情况下仍无法访问交换空间。
  可以通过在 kubelet 配置文件中设置 `swapBehavior` 来修改此设置。若要使用交换空间，
  请设置 `swapBehavior` 的值，这个值不能是默认的 `NoSwap`。
  更多细节参阅[交换内存管理](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)。
* 要禁用交换分区（swap），可以使用命令 `sudo swapoff -a` 暂时关闭交换分区功能。
  要使此更改在重启后仍然生效，请确保在系统的配置文件（如 `/etc/fstab` 或 `systemd.swap`）中禁用交换功能，
  具体取决于你的系统配置方式。

<!--
## Installing a container runtime {#installing-runtime}

To run containers in Pods, Kubernetes uses a
{{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.
-->
## 安装容器运行时   {#installing-runtime}

为了在 Pod 中运行容器，Kubernetes 使用
{{< glossary_tooltip term_id="container-runtime" text="容器运行时（Container Runtime）" >}}。

<!--
By default, Kubernetes uses the
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
to interface with your chosen container runtime.

If you don't specify a runtime, kubeadm automatically tries to detect an installed
container runtime by scanning through a list of known endpoints.
-->
默认情况下，Kubernetes 使用
{{< glossary_tooltip term_id="cri" text="容器运行时接口（Container Runtime Interface，CRI）" >}}
来与你所选择的容器运行时交互。

如果你不指定运行时，kubeadm 会自动尝试通过扫描已知的端点列表来检测已安装的容器运行时。

<!--
If multiple or no container runtimes are detected kubeadm will throw an error
and will request that you specify which one you want to use.

See [container runtimes](/docs/setup/production-environment/container-runtimes/)
for more information.
-->
如果检测到有多个或者没有容器运行时，kubeadm 将抛出一个错误并要求你指定一个想要使用的运行时。

参阅[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)
以了解更多信息。

{{< note >}}
<!--
Docker Engine does not implement the [CRI](/docs/concepts/architecture/cri/)
which is a requirement for a container runtime to work with Kubernetes.
For that reason, an additional service [cri-dockerd](https://github.com/Mirantis/cri-dockerd)
has to be installed. cri-dockerd is a project based on the legacy built-in
Docker Engine support that was [removed](/dockershim) from the kubelet in version 1.24.
-->
Docker Engine 没有实现 [CRI](/zh-cn/docs/concepts/architecture/cri/)，
而这是容器运行时在 Kubernetes 中工作所需要的。
为此，必须安装一个额外的服务 [cri-dockerd](https://github.com/Mirantis/cri-dockerd)。
cri-dockerd 是一个基于传统的内置 Docker 引擎支持的项目，
它在 1.24 版本从 kubelet 中[移除](/zh-cn/dockershim)。
{{< /note >}}

<!--
The tables below include the known endpoints for supported operating systems:
-->
下面的表格包括被支持的操作系统的已知端点。

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Linux 容器运行时" >}}
<!--
| Runtime                            | Path to Unix domain socket                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (using cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
-->
| 运行时                              | Unix 域套接字                                 |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine（使用 cri-dockerd）    | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Windows 容器运行时" >}}
<!--
| Runtime                            | Path to Windows named pipe                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (using cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
-->
| 运行时                              |  Windows 命名管道路径                          |
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
## 安装 kubeadm、kubelet 和 kubectl   {#installing-kubeadm-kubelet-and-kubectl}

你需要在每台机器上安装以下的软件包：

* `kubeadm`：用来初始化集群的指令。

* `kubelet`：在集群中的每个节点上用来启动 Pod 和容器等。

* `kubectl`：用来与集群通信的命令行工具。

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
kubeadm **不能**帮你安装或者管理 `kubelet` 或 `kubectl`，
所以你需要确保它们与通过 kubeadm 安装的控制平面的版本相匹配。
如果不这样做，则存在发生版本偏差的风险，可能会导致一些预料之外的错误和问题。
然而，控制平面与 kubelet 之间可以存在**一个**次要版本的偏差，但 kubelet
的版本不可以超过 API 服务器的版本。
例如，1.7.0 版本的 kubelet 可以完全兼容 1.8.0 版本的 API 服务器，反之则不可以。

有关安装 `kubectl` 的信息，请参阅[安装和设置 kubectl](/zh-cn/docs/tasks/tools/) 文档。

{{< warning >}}
<!--
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
-->
这些指南不包括系统升级时使用的所有 Kubernetes 程序包。这是因为 kubeadm 和 Kubernetes
有[特殊的升级注意事项](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
{{</ warning >}}

<!--
For more information on version skews, see:

* Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [version skew policy](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)
-->
关于版本偏差的更多信息，请参阅以下文档：

* Kubernetes [版本与版本间的偏差策略](/zh-cn/releases/version-skew-policy/)
* kubeadm 特定的[版本偏差策略](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
<!--
There's a dedicated package repository for each Kubernetes minor version. If you want to install
a minor version other than {{< skew currentVersion >}}, please see the installation guide for
your desired minor version.
-->
每个 Kubernetes 小版本都有一个专用的软件包仓库。
如果你想安装 {{< skew currentVersion >}} 以外的次要版本，请参阅所需次要版本的安装指南。
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="基于 Debian 的发行版" %}}

<!--
These instructions are for Kubernetes {{< skew currentVersion >}}.
-->
以下指令适用于 Kubernetes {{< skew currentVersion >}}.

<!--
1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:
-->
1. 更新 `apt` 包索引并安装使用 Kubernetes `apt` 仓库所需要的包：

   ```shell
   sudo apt-get update
   # apt-transport-https 可能是一个虚拟包（dummy package）；如果是的话，你可以跳过安装这个包
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

<!--
2. Download the public signing key for the Kubernetes package repositories.
   The same signing key is used for all repositories so you can disregard the version in the URL:
-->
2. 下载用于 Kubernetes 软件包仓库的公共签名密钥。所有仓库都使用相同的签名密钥，因此你可以忽略URL中的版本：

   <!--
   # If the folder `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
   # sudo mkdir -p -m 755 /etc/apt/keyrings 
   -->
   ```shell
   # 如果 `/etc/apt/keyrings` 目录不存在，则应在 curl 命令之前创建它，请阅读下面的注释。
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
<!--
In releases older than Debian 12 and Ubuntu 22.04, folder `/etc/apt/keyrings` does not exist by default, and it should be created before the curl command.
-->
在低于 Debian 12 和 Ubuntu 22.04 的发行版本中，`/etc/apt/keyrings` 默认不存在。
应在 curl 命令之前创建它。
{{< /note >}}

<!--
3. Add the appropriate Kubernetes `apt` repository. Please note that this repository have packages
   only for Kubernetes {{< skew currentVersion >}}; for other Kubernetes minor versions, you need to
   change the Kubernetes minor version in the URL to match your desired minor version
   (you should also check that you are reading the documentation for the version of Kubernetes
   that you plan to install).
-->
3. 添加 Kubernetes `apt` 仓库。
   请注意，此仓库仅包含适用于 Kubernetes {{< skew currentVersion >}} 的软件包；
   对于其他 Kubernetes 次要版本，则需要更改 URL 中的 Kubernetes 次要版本以匹配你所需的次要版本
  （你还应该检查正在阅读的安装文档是否为你计划安装的 Kubernetes 版本的文档）。

   ```shell
   # 此操作会覆盖 /etc/apt/sources.list.d/kubernetes.list 中现存的所有配置。
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

<!--
4. Update `apt` package index, install kubelet, kubeadm and kubectl, and pin their version:
-->
4. 更新 `apt` 包索引，安装 kubelet、kubeadm 和 kubectl，并锁定其版本：

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

{{% /tab %}}

{{% tab name="基于 Red Hat 的发行版" %}}

<!--
1. Set SELinux to `permissive` mode:

   These instructions are for Kubernetes {{< skew currentVersion >}}.

   ```shell
   # Set SELinux in permissive mode (effectively disabling it)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```
-->
1. 将 SELinux 设置为 `permissive` 模式：

   以下指令适用于 Kubernetes {{< skew currentVersion >}}。

   ```shell
   # 将 SELinux 设置为 permissive 模式（相当于将其禁用）
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
- 通过运行命令 `setenforce 0` 和 `sed ...` 将 SELinux 设置为 permissive 模式相当于将其禁用。
  这是允许容器访问主机文件系统所必需的，例如，某些容器网络插件需要这一能力。
  你必须这么做，直到 kubelet 改进其对 SELinux 的支持。
- 如果你知道如何配置 SELinux 则可以将其保持启用状态，但可能需要设定部分 kubeadm 不支持的配置。
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
2. 添加 Kubernetes 的 `yum` 仓库。在仓库定义中的 `exclude` 参数确保了与
   Kubernetes 相关的软件包在运行 `yum update` 时不会升级，因为升级
   Kubernetes 需要遵循特定的过程。请注意，此仓库仅包含适用于
   Kubernetes {{< skew currentVersion >}} 的软件包；
   对于其他 Kubernetes 次要版本，则需要更改 URL 中的 Kubernetes 次要版本以匹配你所需的次要版本
  （你还应该检查正在阅读的安装文档是否为你计划安装的 Kubernetes 版本的文档）。

   ```shell
   # 此操作会覆盖 /etc/yum.repos.d/kubernetes.repo 中现存的所有配置
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
3. 安装 kubelet、kubeadm 和 kubectl，并启用 kubelet 以确保它在启动时自动启动:

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="无包管理器的情况" %}}
<!--
Install CNI plugins (required for most pod network):
-->
安装 CNI 插件（大多数 Pod 网络都需要）：

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
定义要下载命令文件的目录：

{{< note >}}
<!--
The `DOWNLOAD_DIR` variable must be set to a writable directory.
If you are running Flatcar Container Linux, set `DOWNLOAD_DIR="/opt/bin"`.
-->
`DOWNLOAD_DIR` 变量必须被设置为一个可写入的目录。
如果你在运行 Flatcar Container Linux，可设置 `DOWNLOAD_DIR="/opt/bin"`。
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

<!--
Optionally install crictl (required for interaction with the Container Runtime Interface (CRI), optional for kubeadm):
-->
可以选择安装 crictl（与容器运行时接口 (CRI) 交互时必需，但对 kubeadm 来说是可选的）：

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

<!--
Install `kubeadm`, `kubelet`, `kubectl` and add a `kubelet` systemd service:
-->
安装 `kubeadm`、`kubelet`、`kubectl` 并添加 `kubelet` 系统服务：

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
对于默认不包括 `glibc` 的 Linux 发行版，请参阅[开始之前](#before-you-begin)一节的注释。
{{< /note >}}

<!--
Install `kubectl` by following the instructions on [Install Tools page](/docs/tasks/tools/#kubectl).
Enable and start `kubelet`:
-->
请参照[安装工具页面](/zh-cn/docs/tasks/tools/#kubectl)的说明安装 `kubelet`。
激活并启动 `kubelet`：

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
Flatcar Container Linux 发行版会将 `/usr/` 目录挂载为一个只读文件系统。
在启动引导你的集群之前，你需要执行一些额外的操作来配置一个可写入的目录。
参见 [kubeadm 故障排查指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
以了解如何配置一个可写入的目录。
{{< /note >}}

{{% /tab %}}
{{< /tabs >}}

<!--
The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.
-->
kubelet 现在每隔几秒就会重启，因为它陷入了一个等待 kubeadm 指令的死循环。

<!--
## Configuring a cgroup driver

Both the container runtime and the kubelet have a property called
["cgroup driver"](/docs/setup/production-environment/container-runtimes/#cgroup-drivers), which is important
for the management of cgroups on Linux machines.
-->
## 配置 cgroup 驱动程序  {#configuring-a-cgroup-driver}

容器运行时和 kubelet 都具有名字为
["cgroup driver"](/zh-cn/docs/setup/production-environment/container-runtimes/#cgroup-drivers)
的属性，该属性对于在 Linux 机器上管理 CGroups 而言非常重要。

{{< warning >}}
<!--
Matching the container runtime and kubelet cgroup drivers is required or otherwise the kubelet process will fail.

See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) for more details.
-->
你需要确保容器运行时和 kubelet 所使用的是相同的 cgroup 驱动，否则 kubelet
进程会失败。

相关细节可参见[配置 cgroup 驱动](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
{{< /warning >}}

<!--
## Troubleshooting

If you are running into difficulties with kubeadm, please consult our
[troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->
## 故障排查   {#troubleshooting}

如果你在使用 kubeadm 时遇到困难，
请参阅我们的[故障排查文档](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

## {{% heading "whatsnext" %}}

<!--
* [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
-->
* [使用 kubeadm 创建集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
