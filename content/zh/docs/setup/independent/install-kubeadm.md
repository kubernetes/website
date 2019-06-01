---
title: 安装 kubeadm
content_template: templates/task
weight: 20
---
<!-- 
---
title: Installing kubeadm
content_template: templates/task
weight: 20
--- 
-->

{{% capture overview %}}

<!-- 
<img src="https://raw.githubusercontent.com/cncf/artwork/master/projects/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">This page shows how to install the `kubeadm` toolbox.
For information how to create a cluster with kubeadm once you have performed this installation process,
see the [Using kubeadm to Create a Cluster](/docs/setup/independent/create-cluster-kubeadm/) page.
 -->
 <img src="https://raw.githubusercontent.com/cncf/artwork/master/projects/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">本文会告诉您如何安装 `kubeadm` 工具。完成本文提到的安装步骤后，您可以阅读 [使用 kubeadm 来创建集群](/docs/setup/independent/create-cluster-kubeadm/) 了解如何使用 kubeadm 来创建集群。

{{% /capture %}}

{{% capture prerequisites %}}

<!-- 
* One or more machines running one of:
  - Ubuntu 16.04+
  - Debian 9
  - CentOS 7
  - RHEL 7
  - Fedora 25/26 (best-effort)
  - HypriotOS v1.0.1+
  - Container Linux (tested with 1800.6.0)
* 2 GB or more of RAM per machine (any less will leave little room for your apps)
* 2 CPUs or more
* Full network connectivity between all machines in the cluster (public or private network is fine)
* Unique hostname, MAC address, and product_uuid for every node. See [here](#verify-the-mac-address-and-product-uuid-are-unique-for-every-node) for more details.
* Certain ports are open on your machines. See [here](#check-required-ports) for more details.
* Swap disabled. You **MUST** disable swap in order for the kubelet to work properly. 
-->
* 一台或多台运行着下列系统的机器:
  - Ubuntu 16.04+
  - Debian 9
  - CentOS 7
  - RHEL 7
  - Fedora 25/26 (尽力服务)
  - HypriotOS v1.0.1+
  - Container Linux (针对1800.6.0 版本测试)
* 每台机器 2 GB 或更多的 RAM (如果少于这个数字将会影响您应用的运行内存)
* 2 CPU 核心或更多 
* 集群中的所有机器的网络彼此均能相互连接(公网和内网都可以)
* 节点之中不可以有重复的主机名，MAC 地址，product_uuid。更多详细信息请参见[这里](#verify-the-mac-address-and-product-uuid-are-unique-for-every-node) 。
* 开启主机上的一些特定端口. 更多详细信息请参见[这里](#check-required-ports)。
* 禁用 Swap 交换分区。为了保证 kubelet 正确运行，您 **必须** 禁用交换分区。

{{% /capture %}}

{{% capture steps %}}

<!-- 
## Verify the MAC address and product_uuid are unique for every node 
-->
## 确保每个节点上 MAC 地址和 product_uuid 的唯一性。

<!--
* You can get the MAC address of the network interfaces using the command `ip link` or `ifconfig -a`
* The product_uuid can be checked by using the command `sudo cat /sys/class/dmi/id/product_uuid`
-->
* 您可以使用下列命令获取网络接口的 MAC 地址：`ip link` 或是 `ifconfig -a`
* 下列命令可以用来获取 product_uuid `sudo cat /sys/class/dmi/id/product_uuid`

<!-- 
It is very likely that hardware devices will have unique addresses, although some virtual machines may have
identical values. Kubernetes uses these values to uniquely identify the nodes in the cluster.
If these values are not unique to each node, the installation process
may [fail](https://github.com/kubernetes/kubeadm/issues/31). 
-->
一般来讲，硬件设备会拥有独一无二的地址，但是有些虚拟机可能会雷同。Kubernetes 使用这些值来唯一确定集群中的节点。如果这些值在集群中不唯一，可能会导致安装[失败](https://github.com/kubernetes/kubeadm/issues/31)。

<!--
## Check network adapters
-->

## 检查网络适配器

<!--
If you have more than one network adapter, and your Kubernetes components are not reachable on the default
route, we recommend you add IP route(s) so Kubernetes cluster addresses go via the appropriate adapter.
-->

如果您有一个以上的网络适配器，同时您的 Kubernetes 组件通过默认路由不可达，我们建议您预先添加 IP 路由规则，这样 Kubernetes 集群就可以通过对应的适配器完成连接。

<!--
## Check required ports
-->

## 检查所需端口

<!--
### Master node(s)
| Protocol | Direction | Port Range | Purpose                 | Used By                   |
-->

### Master 节点
| 规则     | 方向       | 端口范围   | 作用                     | 使用者                    |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | Inbound   | 6443*      | Kubernetes API server   | All                       |
| TCP      | Inbound   | 2379-2380  | etcd server client API  | kube-apiserver, etcd      |
| TCP      | Inbound   | 10250      | Kubelet API             | Self, Control plane       |
| TCP      | Inbound   | 10251      | kube-scheduler          | Self                      |
| TCP      | Inbound   | 10252      | kube-controller-manager | Self                      |
<!--
### Worker node(s)
| Protocol | Direction | Port Range  | Purpose               | Used By                 |
-->

### Worker 节点

| 规则     | 方向       | 端口范围    | 作用                   | 使用者                  |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | Inbound   | 10250       | Kubelet API           | Self, Control plane     |
| TCP      | Inbound   | 30000-32767 | NodePort Services**   | All                     |
<!--
** Default port range for [NodePort Services](/docs/concepts/services-networking/service/).
-->

** [NodePort 服务](/docs/concepts/services-networking/service/) 的默认端口范围。

<!-- 
Any port numbers marked with * are overridable, so you will need to ensure any
custom ports you provide are also open. 
-->
任何使用 * 标记的端口号都有可能被覆盖，所以您需要保证您的自定义端口的状态是开放的。

<!-- 
Although etcd ports are included in master nodes, you can also host your own
etcd cluster externally or on custom ports. 
-->
虽然主节点已经包含了 etcd 的端口，您也可以使用自定义的外部 etcd 集群，或是指定自定义端口。
<!--
The pod network plugin you use (see below) may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.
-->
您使用的 pod 网络插件 (见下) 也可能需要某些特定端口开启。由于各个 pod 网络插件都有所不同，请参阅他们各自文档中对端口的要求。

<!-- ## Installing runtime -->
## 安装 runtime

<!-- 
Since v1.6.0, Kubernetes has enabled the use of CRI, Container Runtime Interface, by default.
The container runtime used by default is Docker, which is enabled through the built-in
`dockershim` CRI implementation inside of the `kubelet`. 
-->
从 v1.6.0 起，Kubernetes 开始允许使用 CRI，容器运行时接口。默认的容器运行时是 Docker，这是由 `kubelet` 内置的 CRI 实现 `dockershim` 开启的。

<!-- 
Other CRI-based runtimes include:

- [containerd](https://github.com/containerd/cri) (CRI plugin built into containerd)
- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet) 
-->
其他的容器运行时有：

- [containerd](https://github.com/containerd/cri) (containerd 的内置 CRI 插件)
- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)

<!-- 
Refer to the [CRI installation instructions](/docs/setup/cri) for more information. 
-->
参考 [CRI 安装指南](/docs/setup/cri) 获取更多信息.

<!--
## Installing kubeadm, kubelet and kubectl
-->
## 安装 kubeadm, kubelet 和 kubectl

<!-- 
You will install these packages on all of your machines:

* `kubeadm`: the command to bootstrap the cluster.

* `kubelet`: the component that runs on all of the machines in your cluster
    and does things like starting pods and containers.

* `kubectl`: the command line util to talk to your cluster. 
-->
您需要在每台机器上都安装以下的软件包：

 * `kubeadm`: 用来初始化集群的指令。
  
 * `kubelet`: 在集群中的每个节点上用来启动 pod 和 container 等。
  
 * `kubectl`: 用来与集群通信的命令行工具。

<!-- 
kubeadm **will not** install or manage `kubelet` or `kubectl` for you, so you will
need to ensure they match the version of the Kubernetes control plane you want
kubeadm to install for you. If you do not, there is a risk of a version skew occurring that
can lead to unexpected, buggy behaviour. However, _one_ minor version skew between the
kubelet and the control plane is supported, but the kubelet version may never exceed the API
server version. For example, kubelets running 1.7.0 should be fully compatible with a 1.8.0 API server,
but not vice versa. 
-->
kubeadm **不能** 帮您安装或管理 `kubelet` 或 `kubectl` ，所以您得保证他们满足通过 kubeadm 安装的 Kubernetes 控制层对版本的要求。如果版本没有满足要求，就有可能导致一些难以想到的错误或问题。然而控制层与 kubelet 间的 _小版本号_ 不一致无伤大雅，不过请记住 kubelet 的版本不可以超过 API server 的版本。例如 1.8.0 的 API server 可以适配 1.7.0 的 kubelet，反之就不行了。

<!-- 
{{< warning >}}
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-11/).
{{</ warning >}} 
-->
{{< warning >}}
这些指南不包括所有系统升级时使用的 Kubernetes 程序包。这是因为 kubeadm 和 Kubernetes 需要 [升级时的特别注意事项](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-11/)。
{{</ warning >}} 

<!-- 
For more information on version skews, please read our
[version skew policy](/docs/setup/independent/create-cluster-kubeadm/#version-skew-policy). 
-->

更多关于版本偏差的信息，请参阅 [版本偏差政策](/docs/setup/independent/create-cluster-kubeadm/#version-skew-policy)。

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}} 
```bash
apt-get update && apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl
```

<!--
# Set SELinux in permissive mode (effectively disabling it)
-->

{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kube*
EOF

# 将 SELinux 设置为 permissive 模式(将其禁用)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable kubelet && systemctl start kubelet
```

  <!-- **Note:** -->
  **请注意：**

  <!-- 
  - Setting SELinux in permissive mode by running `setenforce 0` and `sed ...` effectively disables it.
    This is required to allow containers to access the host filesystem, which is needed by pod networks for example.
    You have to do this until SELinux support is improved in the kubelet.
  - Some users on RHEL/CentOS 7 have reported issues with traffic being routed incorrectly due to iptables being bypassed. You should ensure
    `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config, e.g. 
  -->
  - 通过命令 `setenforce 0` 和 `sed ...` 可以将 SELinux 设置为 permissive 模式(将其禁用)。
    只有执行这一操作之后，容器才能访问宿主的文件系统，进而能够正常使用 Pod 网络。您必须这么做，直到 kubelet 做出升级支持 SELinux 为止。
  - 一些 RHEL/CentOS 7 的用户曾经遇到过：由于 iptables 被绕过导致网络请求被错误的路由。您得保证
    在您的 `sysctl` 配置中 `net.bridge.bridge-nf-call-iptables` 被设为1。

    ```bash
    cat <<EOF >  /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```
{{% /tab %}}
{{% tab name="Container Linux" %}}
<!--
Install CNI plugins (required for most pod network):
-->
安装 CNI 插件（大多数 Pod 网络都需要）：

```bash
CNI_VERSION="v0.6.0"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-amd64-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

<!-- 
Install crictl (required for kubeadm / Kubelet Container Runtime Interface (CRI)) 
-->
安装 crictl (kubeadm / Kubelet 的容器运行时接口 (CRI) 要求) 

```bash
CRICTL_VERSION="v1.11.1"
mkdir -p /opt/bin
curl -L "https://github.com/kubernetes-incubator/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | tar -C /opt/bin -xz
```

<!-- 
Install `kubeadm`, `kubelet`, `kubectl` and add a `kubelet` systemd service: -->

安装 `kubeadm`, `kubelet`, `kubectl` 并且添加一个 `kubelet` systemd 服务:

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
启用并启动 `kubelet`:

```bash
systemctl enable kubelet && systemctl start kubelet
```
{{% /tab %}}
{{< /tabs >}}

<!--
The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.
-->
kubelet 现在每隔几秒就会重启，因为它陷入了一个等待 kubeadm 指令的死循环。

<!--
## Configure cgroup driver used by kubelet on Master Node
-->
## 在 Master 节点上配置 kubelet 所需的 cgroup 驱动

<!--
When using Docker, kubeadm will automatically detect the cgroup driver for the kubelet
and set it in the `/var/lib/kubelet/kubeadm-flags.env` file during runtime.
-->
使用 Docker 时，kubeadm 会自动为其检测 cgroup 驱动在运行时对 `/var/lib/kubelet/kubeadm-flags.env` 文件进行配置。
<!--
If you are using a different CRI, you have to modify the file
`/etc/default/kubelet` with your `cgroup-driver` value, like so:
-->
如果您使用了不同的 CRI， 您得把 `/etc/default/kubelet` 文件中的 `cgroup-driver` 位置改为对应的值，像这样：

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

<!--
This file will be used by `kubeadm init` and `kubeadm join` to source extra
user defined arguments for the kubelet.
-->
这个文件将会被 `kubeadm init` 和 `kubeadm join` 用于为 kubelet 获取 额外的用户参数。

<!--
Please mind, that you **only** have to do that if the cgroup driver of your CRI
is not `cgroupfs`, because that is the default value in the kubelet already.
-->
请注意，您**只**需要在您的 cgroup driver 不是 `cgroupfs` 时这么做，因为 `cgroupfs` 已经是 kubelet 的默认值了。

<!--
Restarting the kubelet is required:
-->
需要重启 kubelet：

```bash
systemctl daemon-reload
systemctl restart kubelet
```

<!-- 
## Troubleshooting 
-->
## 查错

<!-- 
If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/independent/troubleshooting-kubeadm/).
-->
如果您在使用 kubeadm 时候遇到问题，请查看我们的[疑难解答文档](/docs/setup/independent/troubleshooting-kubeadm/). 
{{% capture whatsnext %}}
<!-- 
* [Using kubeadm to Create a Cluster](/docs/setup/independent/create-cluster-kubeadm/)
-->
* [使用 kubeadm 来创建集群](/docs/setup/independent/create-cluster-kubeadm/) 

{{% /capture %}}
