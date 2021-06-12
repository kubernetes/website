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
<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">This page shows how to install the `kubeadm` toolbox.
For information how to create a cluster with kubeadm once you have performed this installation process, see the [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) page.
-->
<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">本页面显示如何安装 `kubeadm` 工具箱。
有关在执行此安装过程后如何使用 kubeadm 创建集群的信息，请参见
[使用 kubeadm 创建集群](/zh/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) 页面。

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
* 一台兼容的 Linux 主机。Kubernetes 项目为基于 Debian 和 Red Hat 的 Linux
  发行版以及一些不提供包管理器的发行版提供通用的指令
* 每台机器 2 GB 或更多的 RAM （如果少于这个数字将会影响你应用的运行内存)
* 2 CPU 核或更多
* 集群中的所有机器的网络彼此均能相互连接(公网和内网都可以)
* 节点之中不可以有重复的主机名、MAC 地址或 product_uuid。请参见[这里](#verify-mac-address)了解更多详细信息。
* 开启机器上的某些端口。请参见[这里](#check-required-ports) 了解更多详细信息。
* 禁用交换分区。为了保证 kubelet 正常工作，你 **必须** 禁用交换分区。


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
## 确保每个节点上 MAC 地址和 product_uuid 的唯一性    {#verify-mac-address}

* 你可以使用命令 `ip link` 或 `ifconfig -a` 来获取网络接口的 MAC 地址
* 可以使用 `sudo cat /sys/class/dmi/id/product_uuid` 命令对 product_uuid 校验

一般来讲，硬件设备会拥有唯一的地址，但是有些虚拟机的地址可能会重复。
Kubernetes 使用这些值来唯一确定集群中的节点。
如果这些值在每个节点上不唯一，可能会导致安装
[失败](https://github.com/kubernetes/kubeadm/issues/31)。

<!--
## Check network adapters

If you have more than one network adapter, and your Kubernetes components are not reachable on the default
route, we recommend you add IP route(s) so Kubernetes cluster addresses go via the appropriate adapter.
-->
## 检查网络适配器

如果你有一个以上的网络适配器，同时你的 Kubernetes 组件通过默认路由不可达，我们建议你预先添加 IP 路由规则，这样 Kubernetes 集群就可以通过对应的适配器完成连接。

<!--
## Letting iptables see bridged traffic

Make sure that the `br_netfilter` module is loaded. This can be done by running `lsmod | grep br_netfilter`. To load it explicitly call `sudo modprobe br_netfilter`.

As a requirement for your Linux Node's iptables to correctly see bridged traffic, you should ensure `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config, e.g.
-->
## 允许 iptables 检查桥接流量

确保 `br_netfilter` 模块被加载。这一操作可以通过运行 `lsmod | grep br_netfilter`
来完成。若要显式加载该模块，可执行 `sudo modprobe br_netfilter`。

为了让你的 Linux 节点上的 iptables 能够正确地查看桥接流量，你需要确保在你的
`sysctl` 配置中将 `net.bridge.bridge-nf-call-iptables` 设置为 1。例如：

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
更多的相关细节可查看[网络插件需求](/zh/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements)页面。

<!--
## Check required ports

### Control-plane node(s)

| Protocol   | Direction  | Port Range | Purpose                 | Used By                 |
|------------|------------|------------|-------------------------|-------------------------|
| TCP        | Inbound    | 6443*      | Kubernetes API server   | All                     |
| TCP        | Inbound    | 2379-2380  | etcd server client API  | kube-apiserver, etcd    |
| TCP        | Inbound    | 10250      | Kubelet API             | Self, Control plane     |
| TCP        | Inbound    | 10251      | kube-scheduler          | Self                    |
| TCP        | Inbound    | 10252      | kube-controller-manager | Self                    |
-->
## 检查所需端口{#check-required-ports}

### 控制平面节点

| 协议     | 方向   | 端口范围   | 作用                    | 使用者                       |
|----------|--------|------------|-------------------------|------------------------------|
| TCP      | 入站   | 6443       | Kubernetes API 服务器   | 所有组件                     |
| TCP      | 入站   | 2379-2380  | etcd 服务器客户端 API   | kube-apiserver, etcd         |
| TCP      | 入站   | 10250      | Kubelet API             | kubelet 自身、控制平面组件   |
| TCP      | 入站   | 10251      | kube-scheduler          | kube-scheduler 自身          |
| TCP      | 入站   | 10252      | kube-controller-manager | kube-controller-manager 自身 |

<!--
### Worker node(s)

| Protocol   | Direction  | Port Range  | Purpose             | Used By                 |
|------------|------------|-------------|---------------------|-------------------------|
| TCP        | Inbound    | 10250       | Kubelet API         | Self, Control plane     |
| TCP        | Inbound    | 30000-32767 | NodePort Services** | All                     |

** Default port range for [NodePort Services](/docs/concepts/services-networking/service/).

Any port numbers marked with * are overridable, so you will need to ensure any
custom ports you provide are also open.

Although etcd ports are included in control-plane nodes, you can also host your own
etcd cluster externally or on custom ports.

The pod network plugin you use (see below) may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.
-->
### 工作节点

| 协议 | 方向   | 端口范围    | 作用              | 使用者                      |
|------|--------|-------------|-------------------|-----------------------------|
| TCP  | 入站   | 10250       | Kubelet API       | kubelet 自身、控制平面组件  |
| TCP  | 入站   | 30000-32767 | NodePort 服务†    | 所有组件                    |

† [NodePort 服务](/zh/docs/concepts/services-networking/service/) 的默认端口范围。

使用 * 标记的任意端口号都可以被覆盖，所以你需要保证所定制的端口是开放的。

虽然控制平面节点已经包含了 etcd 的端口，你也可以使用自定义的外部 etcd 集群，或是指定自定义端口。

你使用的 Pod 网络插件 (见下) 也可能需要某些特定端口开启。由于各个 Pod 网络插件都有所不同，
请参阅他们各自文档中对端口的要求。

<!--
## Installing runtime {#installing-runtime}

To run containers in Pods, Kubernetes uses a
{{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.
-->
## 安装 runtime{#installing-runtime}

为了在 Pod 中运行容器，Kubernetes 使用
{{< glossary_tooltip term_id="container-runtime" text="容器运行时（Container Runtime）" >}}。

{{< tabs name="container-runtimes" >}}
{{% tab name="Linux 节点" %}}
<!--
By default, Kubernetes uses the
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
to interface with your chosen container runtime.

If you don't specify a runtime, kubeadm automatically tries to detect an installed
container runtime by scanning through a list of well known Unix domain sockets.
The following table lists container runtimes and their associated socket paths:

| Runtime    | Domain Socket                   |
|------------|---------------------------------|
| Docker     | /var/run/dockershim.sock            |
| containerd | /run/containerd/containerd.sock |
| CRI-O      | /var/run/crio/crio.sock         |
-->
默认情况下，Kubernetes 使用
{{< glossary_tooltip term_id="cri" text="容器运行时接口（Container Runtime Interface，CRI）" >}}
来与你所选择的容器运行时交互。

如果你不指定运行时，则 kubeadm 会自动尝试检测到系统上已经安装的运行时，
方法是扫描一组众所周知的 Unix 域套接字。
下面的表格列举了一些容器运行时及其对应的套接字路径：

| 运行时     | 域套接字                         |
|------------|----------------------------------|
| Docker     | /var/run/dockershim.sock             |
| containerd | /run/containerd/containerd.sock  |
| CRI-O      | /var/run/crio/crio.sock          |

<!--
<br />
If both Docker and containerd are detected, Docker takes precedence. This is
needed because Docker 18.09 ships with containerd and both are detectable even if you only
installed Docker.
If any other two or more runtimes are detected, kubeadm exits with an error.

The kubelet integrates with Docker through the built-in `dockershim` CRI implementation.

See [container runtimes](/docs/setup/production-environment/container-runtimes/)
for more information.
-->
<br/>
如果同时检测到 Docker 和 containerd，则优先选择 Docker。
这是必然的，因为 Docker 18.09 附带了 containerd 并且两者都是可以检测到的，
即使你仅安装了 Docker。
如果检测到其他两个或多个运行时，kubeadm 输出错误信息并退出。

kubelet 通过内置的 `dockershim` CRI 实现与 Docker 集成。

参阅[容器运行时](/zh/docs/setup/production-environment/container-runtimes/)
以了解更多信息。

{{% /tab %}}
{{% tab name="其它操作系统" %}}
<!--
By default, kubeadm uses {{< glossary_tooltip term_id="docker" >}} as the container runtime.
The kubelet integrates with Docker through the built-in `dockershim` CRI implementation.

See [container runtimes](/docs/setup/production-environment/container-runtimes/)
for more information.
-->
默认情况下， kubeadm 使用 {{< glossary_tooltip term_id="docker" >}} 作为容器运行时。
kubelet 通过内置的 `dockershim` CRI 实现与 Docker 集成。
参阅[容器运行时](/zh/docs/setup/production-environment/container-runtimes/)
以了解更多信息。

{{% /tab %}}
{{< /tabs >}}

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
## 安装 kubeadm、kubelet 和 kubectl

你需要在每台机器上安装以下的软件包：

* `kubeadm`：用来初始化集群的指令。

* `kubelet`：在集群中的每个节点上用来启动 Pod 和容器等。

* `kubectl`：用来与集群通信的命令行工具。

kubeadm **不能** 帮你安装或者管理 `kubelet` 或 `kubectl`，所以你需要
确保它们与通过 kubeadm 安装的控制平面的版本相匹配。
如果不这样做，则存在发生版本偏差的风险，可能会导致一些预料之外的错误和问题。
然而，控制平面与 kubelet 间的相差一个次要版本不一致是支持的，但 kubelet
的版本不可以超过 API 服务器的版本。
例如，1.7.0 版本的 kubelet 可以完全兼容 1.8.0 版本的 API 服务器，反之则不可以。

有关安装 `kubectl` 的信息，请参阅[安装和设置 kubectl](/zh/docs/tasks/tools/)文档。

{{< warning >}}
<!--
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/).
-->
这些指南不包括系统升级时使用的所有 Kubernetes 程序包。这是因为 kubeadm 和 Kubernetes
有[特殊的升级注意事项](/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
{{</ warning >}}

<!--
For more information on version skews, see:

* Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [version skew policy](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)
-->
关于版本偏差的更多信息，请参阅以下文档：

* Kubernetes [版本与版本间的偏差策略](/zh/docs/setup/release/version-skew-policy/)
* Kubeadm 特定的[版本偏差策略](/zh/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="基于 Debian 的发行版" %}}

<!--
1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:
-->
1. 更新 `apt` 包索引并安装使用 Kubernetes `apt` 仓库所需要的包：

   ```shell
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl
   ```

<!--
2. Download the Google Cloud public signing key:
-->
2. 下载 Google Cloud 公开签名秘钥：

   ```shell
   sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
   ```

<!--
3. Add the Kubernetes `apt` repository:
-->
3. 添加 Kubernetes `apt` 仓库：

   ```shell
   echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
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

# 将 SELinux 设置为 permissive 模式（相当于将其禁用）
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
-->
**请注意：**

- 通过运行命令 `setenforce 0` 和 `sed ...` 将 SELinux 设置为 permissive 模式
  可以有效地将其禁用。
  这是允许容器访问主机文件系统所必需的，而这些操作时为了例如 Pod 网络工作正常。

  你必须这么做，直到 kubelet 做出对 SELinux 的支持进行升级为止。

- 如果你知道如何配置 SELinux 则可以将其保持启用状态，但可能需要设定 kubeadm 不支持的部分配置

{{% /tab %}}
{{% tab name="无包管理器的情况" %}}

<!--
Install CNI plugins (required for most pod network):
-->
安装 CNI 插件（大多数 Pod 网络都需要）：

```bash
CNI_VERSION="v0.8.2"
sudo mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-amd64-${CNI_VERSION}.tgz" | sudo tar -C /opt/cni/bin -xz
```

<!--
Define the directory to download command files  
-->
定义要下载命令文件的目录。

{{< note >}}
<!--
The `DOWNLOAD_DIR` variable must be set to a writable directory.
If you are running Flatcar Container Linux, set `DOWNLOAD_DIR=/opt/bin`.
-->
`DOWNLOAD_DIR` 变量必须被设置为一个可写入的目录。
如果你在运行 Flatcar Container Linux，可将 `DOWNLOAD_DIR` 设置为 `/opt/bin`。
{{< /note >}}

```bash
DOWNLOAD_DIR=/usr/local/bin
sudo mkdir -p $DOWNLOAD_DIR
```

<!--
Install crictl (required for kubeadm / Kubelet Container Runtime Interface (CRI))
-->
安装 crictl（kubeadm/kubelet 容器运行时接口（CRI）所需）

```bash
CRICTL_VERSION="v1.17.0"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

<!--
Install `kubeadm`, `kubelet`, `kubectl` and add a `kubelet` systemd service:
-->
安装 `kubeadm`、`kubelet`、`kubectl` 并添加 `kubelet` 系统服务：

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://storage.googleapis.com/kubernetes-release/release/${RELEASE}/bin/linux/amd64/{kubeadm,kubelet,kubectl}
sudo chmod +x {kubeadm,kubelet,kubectl}

RELEASE_VERSION="v0.4.0"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service
sudo mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

<!--
Enable and start `kubelet`:
-->
激活并启动 `kubelet`：

```bash
systemctl enable --now kubelet
```

{{< note >}}
<!--
The Flatcar Container Linux distribution mounts the `/usr` directory as a read-only filesystem.
Before bootstrapping your cluster, you need to take additional steps to configure a writable directory.
See the [Kubeadm Troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only/) to learn how to set up a writable directory.
-->
Flatcar Container Linux 发行版会将 `/usr/` 目录挂载为一个只读文件系统。
在启动引导你的集群之前，你需要执行一些额外的操作来配置一个可写入的目录。
参见 [kubeadm 故障排查指南](/zh/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only/)
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
## Configure cgroup driver

Both the container runtime and the kubelet have a property called
["cgroup driver"](/docs/setup/production-environment/container-runtimes/), which is important
for the management of cgroups on Linux machines.
-->
## 配置 cgroup 驱动程序  {#configure-cgroup-driver}

容器运行时和 kubelet 都具有名字为 
["cgroup driver"](/zh/docs/setup/production-environment/container-runtimes/)
的属性，该属性对于在 Linux 机器上管理 CGroups 而言非常重要。

{{< warning >}}
<!--
Matching the container runtime and kubelet cgroup drivers is required or otherwise the kubelet process will fail.

See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) for more details.
-->
你需要确保容器运行时和 kubelet 所使用的是相同的 cgroup 驱动，否则 kubelet
进程会失败。

相关细节可参见[配置 cgroup 驱动](/zh/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
{{< /warning >}}

<!--
## Troubleshooting

If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->
## 故障排查   {#troubleshooting}

如果你在使用 kubeadm 时遇到困难，请参阅我们的
[故障排查文档](/zh/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

## {{% heading "whatsnext" %}}

<!--
* [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
-->
* [使用 kubeadm 创建集群](/zh/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

