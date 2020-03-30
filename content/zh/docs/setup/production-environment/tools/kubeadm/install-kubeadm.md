---
title: 安装 kubeadm
content_template: templates/task
weight: 10
card:
  name: setup
  weight: 20
  title: 安装 kubeadm 设置工具
---
<!--
---
title: Installing kubeadm
content_template: templates/task
weight: 10
card:
  name: setup
  weight: 20
  title: Install the kubeadm setup tool
---
-->

{{% capture overview %}}

<!--
<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">This page shows how to install the `kubeadm` toolbox.
For information how to create a cluster with kubeadm once you have performed this installation process, see the [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) page.
-->
<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">本页面显示如何安装 `kubeadm` 工具箱。
有关在执行此安装过程后如何使用 kubeadm 创建集群的信息，请参见[使用 kubeadm 创建集群](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) 页面。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
* One or more machines running one of:
  - Ubuntu 16.04+
  - Debian 9+
  - CentOS 7
  - Red Hat Enterprise Linux (RHEL) 7
  - Fedora 25+
  - HypriotOS v1.0.1+
  - Container Linux (tested with 1800.6.0)
* 2 GB or more of RAM per machine (any less will leave little room for your apps)
* 2 CPUs or more
* Full network connectivity between all machines in the cluster (public or private network is fine)
* Unique hostname, MAC address, and product_uuid for every node. See [here](#verify-the-mac-address-and-product-uuid-are-unique-for-every-node) for more details.
* Certain ports are open on your machines. See [here](#check-required-ports) for more details.
* Swap disabled. You **MUST** disable swap in order for the kubelet to work properly.
-->
* 一台或多台运行着下列系统的机器：
  - Ubuntu 16.04+
  - Debian 9+
  - CentOS 7
  - Red Hat Enterprise Linux (RHEL) 7
  - Fedora 25+
  - HypriotOS v1.0.1+
  - Container Linux (测试 1800.6.0 版本)
* 每台机器 2 GB 或更多的 RAM (如果少于这个数字将会影响您应用的运行内存)
* 2 CPU 核或更多
* 集群中的所有机器的网络彼此均能相互连接(公网和内网都可以)
* 节点之中不可以有重复的主机名、MAC 地址或 product_uuid。请参见[这里](#verify-the-mac-address-and-product-uuid-are-unique-for-every-node) 了解更多详细信息。
* 开启机器上的某些端口。请参见[这里](#check-required-ports) 了解更多详细信息。
* 禁用交换分区。为了保证 kubelet 正常工作，您 **必须** 禁用交换分区。

{{% /capture %}}

{{% capture steps %}}

<!--
## Verify the MAC address and product_uuid are unique for every node

* You can get the MAC address of the network interfaces using the command `ip link` or `ifconfig -a`
* The product_uuid can be checked by using the command `sudo cat /sys/class/dmi/id/product_uuid`

It is very likely that hardware devices will have unique addresses, although some virtual machines may have
identical values. Kubernetes uses these values to uniquely identify the nodes in the cluster.
If these values are not unique to each node, the installation process
may [fail](https://github.com/kubernetes/kubeadm/issues/31).
-->
## 确保每个节点上 MAC 地址和 product_uuid 的唯一性{#verify-the-mac-address-and-product-uuid-are-unique-for-every-node}

* 您可以使用命令 `ip link` 或 `ifconfig -a` 来获取网络接口的 MAC 地址
* 可以使用 `sudo cat /sys/class/dmi/id/product_uuid` 命令对 product_uuid 校验

一般来讲，硬件设备会拥有唯一的地址，但是有些虚拟机的地址可能会重复。Kubernetes 使用这些值来唯一确定集群中的节点。
如果这些值在每个节点上不唯一，可能会导致安装[失败](https://github.com/kubernetes/kubeadm/issues/31)。

<!--
## Check network adapters

If you have more than one network adapter, and your Kubernetes components are not reachable on the default
route, we recommend you add IP route(s) so Kubernetes cluster addresses go via the appropriate adapter.
-->
## 检查网络适配器

如果您有一个以上的网络适配器，同时您的 Kubernetes 组件通过默认路由不可达，我们建议您预先添加 IP 路由规则，这样 Kubernetes 集群就可以通过对应的适配器完成连接。

<!--
## Ensure iptables tooling does not use the nftables backend

In Linux, nftables is available as a modern replacement for the kernel's iptables subsystem. The
`iptables` tooling can act as a compatibility layer, behaving like iptables but actually configuring
nftables. This nftables backend is not compatible with the current kubeadm packages: it causes duplicated
firewall rules and breaks `kube-proxy`.

If your system's `iptables` tooling uses the nftables backend, you will need to switch the `iptables`
tooling to 'legacy' mode to avoid these problems. This is the case on at least Debian 10 (Buster),
Ubuntu 19.04, Fedora 29 and newer releases of these distributions by default. RHEL 8 does not support
switching to legacy mode, and is therefore incompatible with current kubeadm packages.
-->
## 确保 iptables 工具不使用 nftables 后端

在 Linux 中，nftables 当前可以作为内核 iptables 子系统的替代品。
`iptables` 工具可以充当兼容性层，其行为类似于 iptables 但实际上是在配置 nftables。
nftables 后端与当前的 kubeadm 软件包不兼容：它会导致重复防火墙规则并破坏 `kube-proxy`。

如果您系统的 `iptables` 工具使用 nftables 后端，则需要把 `iptables` 工具切换到“旧版”模式来避免这些问题。
默认情况下，至少在 Debian 10 (Buster)、Ubuntu 19.04、Fedora 29 和较新的发行版本中会出现这种问题。RHEL 8 不支持切换到旧版本模式，因此与当前的 kubeadm 软件包不兼容。

{{< tabs name="iptables_legacy" >}}
{{% tab name="Debian 或 Ubuntu" %}}
```bash
update-alternatives --set iptables /usr/sbin/iptables-legacy
update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
update-alternatives --set arptables /usr/sbin/arptables-legacy
update-alternatives --set ebtables /usr/sbin/ebtables-legacy
```
{{% /tab %}}
{{% tab name="Fedora" %}}
```bash
update-alternatives --set iptables /usr/sbin/iptables-legacy
```
{{% /tab %}}
{{< /tabs >}}

<!--
## Check required ports

### Control-plane node(s)

| Protocol | Direction | Port Range | Purpose                 | Used By                   |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | Inbound   | 6443*      | Kubernetes API server   | All                       |
| TCP      | Inbound   | 2379-2380  | etcd server client API  | kube-apiserver, etcd      |
| TCP      | Inbound   | 10250      | Kubelet API             | Self, Control plane       |
| TCP      | Inbound   | 10251      | kube-scheduler          | Self                      |
| TCP      | Inbound   | 10252      | kube-controller-manager | Self                      |
-->
## 检查所需端口{#check-required-ports}

### 控制平面节点

| 协议 | 方向 | 端口范围 | 作用                 | 使用者                   |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | 入站   | 6443*      | Kubernetes API 服务器   | 所有组件                       |
| TCP      | 入站   | 2379-2380  | etcd server client API  | kube-apiserver, etcd      |
| TCP      | 入站   | 10250      | Kubelet API             | kubelet 自身、控制平面组件       |
| TCP      | 入站   | 10251      | kube-scheduler          | kube-scheduler 自身                      |
| TCP      | 入站   | 10252      | kube-controller-manager | kube-controller-manager 自身                      |

<!--
### Worker node(s)

| Protocol | Direction | Port Range  | Purpose               | Used By                 |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | Inbound   | 10250       | Kubelet API           | Self, Control plane     |
| TCP      | Inbound   | 30000-32767 | NodePort Services**   | All                     |

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

| 协议 | 方向 | 端口范围  | 作用               | 使用者                 |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | 入站   | 10250       | Kubelet API           | kubelet 自身、控制平面组件     |
| TCP      | 入站   | 30000-32767 | NodePort 服务**   | 所有组件                     |

** [NodePort 服务](/docs/concepts/services-networking/service/) 的默认端口范围。

使用 * 标记的任意端口号都可以被覆盖，所以您需要保证所定制的端口是开放的。

虽然控制平面节点已经包含了 etcd 的端口，您也可以使用自定义的外部 etcd 集群，或是指定自定义端口。

您使用的 pod 网络插件 (见下) 也可能需要某些特定端口开启。由于各个 pod 网络插件都有所不同，请参阅他们各自文档中对端口的要求。

<!--
## Installing runtime {#installing-runtime}

Since v1.6.0, Kubernetes has enabled the use of CRI, Container Runtime Interface, by default.

Since v1.14.0, kubeadm will try to automatically detect the container runtime on Linux nodes
by scanning through a list of well known domain sockets. The detectable runtimes and the
socket paths, that are used, can be found in the table below.

| Runtime    | Domain Socket                    |
|------------|----------------------------------|
| Docker     | /var/run/docker.sock             |
| containerd | /run/containerd/containerd.sock  |
| CRI-O      | /var/run/crio/crio.sock          |

If both Docker and containerd are detected together, Docker takes precedence. This is
needed, because Docker 18.09 ships with containerd and both are detectable.
If any other two or more runtimes are detected, kubeadm will exit with an appropriate
error message.

On non-Linux nodes the container runtime used by default is Docker.

If the container runtime of choice is Docker, it is used through the built-in
`dockershim` CRI implementation inside of the `kubelet`.

Other CRI-based runtimes include:

- [containerd](https://github.com/containerd/cri) (CRI plugin built into containerd)
- [cri-o](https://cri-o.io/)
- [frakti](https://github.com/kubernetes/frakti)

Refer to the [CRI installation instructions](/docs/setup/cri) for more information.
-->
## 安装 runtime{#installing-runtime}

从 v1.6.0 版本起，Kubernetes 开始默认允许使用 CRI（容器运行时接口）。

从 v1.14.0 版本起，kubeadm 将通过观察已知的 UNIX 域套接字来自动检测 Linux 节点上的容器运行时。
下表中是可检测到的正在运行的 runtime 和 socket 路径。

| 运行时    | 域套接字                    |
|------------|----------------------------------|
| Docker     | /var/run/docker.sock             |
| containerd | /run/containerd/containerd.sock  |
| CRI-O      | /var/run/crio/crio.sock          |

如果同时检测到 docker 和 containerd，则优先选择 docker。
这是必然的，因为 docker 18.09 附带了 containerd 并且两者都是可以检测到的。
如果检测到其他两个或多个运行时，kubeadm 将以一个合理的错误信息退出。

在非 Linux 节点上，默认使用 docker 作为容器 runtime。

如果选择的容器 runtime 是 docker，则通过内置 `dockershim` CRI 在 `kubelet` 的内部实现其的应用。

基于 CRI 的其他 runtimes 有：

- [containerd](https://github.com/containerd/cri) （containerd 的内置 CRI 插件）
- [cri-o](https://cri-o.io/)
- [frakti](https://github.com/kubernetes/frakti)

请参考 [CRI 安装指南](/docs/setup/cri) 获取更多信息。

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

For information about installing `kubectl`, see [Install and set up kubectl](/docs/tasks/tools/install-kubectl/).
-->
## 安装 kubeadm、kubelet 和 kubectl

您需要在每台机器上安装以下的软件包：

* `kubeadm`：用来初始化集群的指令。

* `kubelet`：在集群中的每个节点上用来启动 pod 和容器等。

* `kubectl`：用来与集群通信的命令行工具。

kubeadm **不能** 帮您安装或者管理 `kubelet` 或 `kubectl`，所以您需要确保它们与通过 kubeadm 安装的控制平面的版本相匹配。
如果不这样做，则存在发生版本偏差的风险，可能会导致一些预料之外的错误和问题。
然而，控制平面与 kubelet 间的相差一个次要版本不一致是支持的，但 kubelet 的版本不可以超过 API 服务器的版本。
例如，1.7.0 版本的 kubelet 可以完全兼容 1.8.0 版本的 API 服务器，反之则不可以。

有关安装 `kubectl` 的信息，请参阅[安装和设置 kubectl](/docs/tasks/tools/install-kubectl/)文档。

{{< warning >}}
<!--
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/).
-->
这些指南不包括系统升级时使用的所有 Kubernetes 程序包。这是因为 kubeadm 和 Kubernetes 有[特殊的升级注意事项](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)。
{{</ warning >}}

<!--
For more information on version skews, see:

* Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [version skew policy](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)
-->
关于版本偏差的更多信息，请参阅以下文档：

* Kubernetes [版本与版本间的偏差策略](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [版本偏差策略](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```
{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}
```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

# 将 SELinux 设置为 permissive 模式（相当于将其禁用）
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```
<!--

  **Note:**

  - Setting SELinux in permissive mode by running `setenforce 0` and `sed ...` effectively disables it.
    This is required to allow containers to access the host filesystem, which is needed by pod networks for example.
    You have to do this until SELinux support is improved in the kubelet.
  - Some users on RHEL/CentOS 7 have reported issues with traffic being routed incorrectly due to iptables being bypassed. You should ensure
    `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config, e.g.

    ```bash
    cat <<EOF >  /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```
  - Make sure that the `br_netfilter` module is loaded before this step. This can be done by running `lsmod | grep br_netfilter`. To load it explicitly call `modprobe br_netfilter`.
-->

  **请注意：**

  - 通过运行命令 `setenforce 0` 和 `sed ...` 将 SELinux 设置为 permissive 模式可以有效的将其禁用。
    这是允许容器访问主机文件系统所必须的，例如正常使用 pod 网络。
    您必须这么做，直到 kubelet 做出升级支持 SELinux 为止。
  - 一些 RHEL/CentOS 7 的用户曾经遇到过问题：由于 iptables 被绕过而导致流量无法正确路由的问题。您应该确保
    在 `sysctl` 配置中的 `net.bridge.bridge-nf-call-iptables` 被设置为 1。

    ```bash
    cat <<EOF >  /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```
  - 确保在此步骤之前已加载了 `br_netfilter` 模块。这可以通过运行 `lsmod | grep br_netfilter` 来完成。要显示加载它，请调用 `modprobe br_netfilter`。
{{% /tab %}}
{{% tab name="Container Linux" %}}
<!--
Install CNI plugins (required for most pod network):
-->
安装 CNI 插件（大多数 pod 网络都需要）：

```bash
CNI_VERSION="v0.8.2"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-amd64-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

<!--
Install crictl (required for kubeadm / Kubelet Container Runtime Interface (CRI))
-->
安装 crictl（kubeadm/kubelet 容器运行时接口（CRI）所需）

```bash
CRICTL_VERSION="v1.16.0"
mkdir -p /opt/bin
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | tar -C /opt/bin -xz
```

<!--
Install `kubeadm`, `kubelet`, `kubectl` and add a `kubelet` systemd service:
-->
安装 `kubeadm`、`kubelet`、`kubectl` 并添加 `kubelet` 系统服务：

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"

mkdir -p /opt/bin
cd /opt/bin
curl -L --remote-name-all https://storage.googleapis.com/kubernetes-release/release/${RELEASE}/bin/linux/amd64/{kubeadm,kubelet,kubectl}
chmod +x {kubeadm,kubelet,kubectl}

curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/kubelet.service" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service
mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/10-kubeadm.conf" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

<!--
Enable and start `kubelet`:
-->
开启并启动 `kubelet`：

```bash
systemctl enable --now kubelet
```
{{% /tab %}}
{{< /tabs >}}


<!--
The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.
-->
kubelet 现在每隔几秒就会重启，因为它陷入了一个等待 kubeadm 指令的死循环。

<!--
## Configure cgroup driver used by kubelet on control-plane node

When using Docker, kubeadm will automatically detect the cgroup driver for the kubelet
and set it in the `/var/lib/kubelet/kubeadm-flags.env` file during runtime.

If you are using a different CRI, you have to modify the file
`/etc/default/kubelet` (`/etc/sysconfig/kubelet` for CentOS, RHEL, Fedora) with your `cgroup-driver` value, like so:

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

This file will be used by `kubeadm init` and `kubeadm join` to source extra
user defined arguments for the kubelet.

Please mind, that you **only** have to do that if the cgroup driver of your CRI
is not `cgroupfs`, because that is the default value in the kubelet already.

Restarting the kubelet is required:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

The automatic detection of cgroup driver for other container runtimes
like CRI-O and containerd is work in progress.

-->
## 在控制平面节点上配置 kubelet 使用的 cgroup 驱动程序

使用 docker 时，kubeadm 会自动为其检测 cgroup 驱动并在运行时对 `/var/lib/kubelet/kubeadm-flags.env` 文件进行配置。

如果您使用不同的 CRI，您需要使用 `cgroup-driver` 值修改 `/etc/default/kubelet` 文件（对于 CentOS、RHEL、Fedora，修改 `/etc/sysconfig/kubelet` 文件），像这样：

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

这个文件将由 `kubeadm init` 和 `kubeadm join` 使用以获取额外的用户自定义的 kubelet 参数。

请注意，您 **只** 需要在您的 cgroup 驱动程序不是 `cgroupfs` 时这么做，因为它已经是 kubelet 中的默认值。

需要重新启动 kubelet：

```bash
systemctl daemon-reload
systemctl restart kubelet
```

自动检测其他容器运行时的 cgroup 驱动，例如在进程中工作的 CRI-O 和 containerd。


<!--
## Troubleshooting

If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->
## 故障排查

如果您在使用 kubeadm 时遇到困难，请参阅我们的[故障排查文档](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

{{% capture whatsnext %}}

<!--
* [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
-->
* [使用 kubeadm 创建集群](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

{{% /capture %}}
