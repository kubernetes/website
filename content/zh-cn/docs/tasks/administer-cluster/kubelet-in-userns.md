---
title: 以非 root 用户身份运行 Kubernetes 节点组件
content_type: task
min-kubernetes-server-version: 1.22
weight: 300
---

<!--
title: Running Kubernetes Node Components as a Non-root User
content_type: task
min-kubernetes-server-version: 1.22
weight: 300
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

<!--
This document describes how to run Kubernetes Node components such as kubelet, CRI, OCI, and CNI
without root privileges, by using a {{< glossary_tooltip text="user namespace" term_id="userns" >}}.

This technique is also known as _rootless mode_.

{{< note >}}
This document describes how to run Kubernetes Node components (and hence pods) as a non-root user.

If you are just looking for how to run a pod as a non-root user, see [SecurityContext](/docs/tasks/configure-pod-container/security-context/).
{{< /note >}}
-->

这个文档描述了怎样不使用 root 特权，而是通过使用 {{< glossary_tooltip text="用户命名空间" term_id="userns" >}}
去运行 Kubernetes 节点组件（例如 kubelet、CRI、OCI、CNI）。

这种技术也叫做 **rootless 模式（Rootless mode）**。

{{< note >}}
这个文档描述了怎么以非 root 用户身份运行 Kubernetes 节点组件以及 Pod。
如果你只是想了解如何以非 root 身份运行 Pod，请参阅 [SecurityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)。
{{< /note >}}

<!--
## {{% heading "prerequisites" %}}

{{% version-check %}}

* [Enable Cgroup v2](https://rootlesscontaine.rs/getting-started/common/cgroup2/)
* [Enable systemd with user session](https://rootlesscontaine.rs/getting-started/common/login/)
* [Configure several sysctl values, depending on host Linux distribution](https://rootlesscontaine.rs/getting-started/common/sysctl/)
* [Ensure that your unprivileged user is listed in `/etc/subuid` and `/etc/subgid`](https://rootlesscontaine.rs/getting-started/common/subuid/)
* Enable the `KubeletInUserNamespace` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
-->

## {{% heading "prerequisites" %}}

{{% version-check %}}

* [启用 cgroup v2](https://rootlesscontaine.rs/getting-started/common/cgroup2/)
* [在 systemd 中启用 user session](https://rootlesscontaine.rs/getting-started/common/login/)
* [根据不同的 Linux 发行版，配置 sysctl 的值](https://rootlesscontaine.rs/getting-started/common/sysctl/)
* [确保你的非特权用户被列在 `/etc/subuid` 和 `/etc/subgid` 文件中](https://rootlesscontaine.rs/getting-started/common/subuid/)
* 启用 `KubeletInUserNamespace` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)

<!-- steps -->

<!--
## Running Kubernetes inside Rootless Docker/Podman

### kind

[kind](https://kind.sigs.k8s.io/) supports running Kubernetes inside Rootless Docker or Rootless Podman.

See [Running kind with Rootless Docker](https://kind.sigs.k8s.io/docs/user/rootless/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) also supports running Kubernetes inside Rootless Docker or Rootless Podman.

See the Minikube documentation:

* [Rootless Docker](https://minikube.sigs.k8s.io/docs/drivers/docker/)
* [Rootless Podman](https://minikube.sigs.k8s.io/docs/drivers/podman/)
-->

## 使用 Rootless 模式的 Docker/Podman 运行 Kubernetes

### kind

[kind](https://kind.sigs.k8s.io/) 支持使用 Rootless 模式的 Docker 或者 Podman 运行 Kubernetes。

请参阅[使用 Rootless 模式的 Docker 运行 kind](https://kind.sigs.k8s.io/docs/user/rootless/)。

### minikube

[minikube](https://minikube.sigs.k8s.io/) 也支持使用 Rootless 模式的 Docker 或 Podman 运行 Kubernetes。

请参阅 Minikube 文档：

* [Rootless Docker](https://minikube.sigs.k8s.io/docs/drivers/docker/)
* [Rootless Podman](https://minikube.sigs.k8s.io/docs/drivers/podman/)

<!--
## Running Kubernetes inside Unprivileged Containers

{{% thirdparty-content %}}

### sysbox

-->

## 在非特权容器内运行 Kubernetes

{{% thirdparty-content %}}

### sysbox

<!--
[Sysbox](https://github.com/nestybox/sysbox) is an open-source container runtime
(similar to "runc") that supports running system-level workloads such as Docker
and Kubernetes inside unprivileged containers isolated with the Linux user
namespace.
-->

[Sysbox](https://github.com/nestybox/sysbox) 是一个开源容器运行时
(类似于 “runc”），支持在 Linux 用户命名空间隔离的非特权容器内运行系统级工作负载，
比如 Docker 和 Kubernetes。

<!--
See [Sysbox Quick Start Guide: Kubernetes-in-Docker](https://github.com/nestybox/sysbox/blob/master/docs/quickstart/kind.md) for more info.
-->

查看 [Sysbox 快速入门指南: Kubernetes-in-Docker](https://github.com/nestybox/sysbox/blob/master/docs/quickstart/kind.md)
了解更多细节。

<!--
Sysbox supports running Kubernetes inside unprivileged containers without
requiring Cgroup v2 and without the `KubeletInUserNamespace` feature gate. It
does this by exposing specially crafted `/proc` and `/sys` filesystems inside
the container plus several other advanced OS virtualization techniques.
-->

Sysbox 支持在非特权容器内运行 Kubernetes，
而不需要 cgroup v2 和 “KubeletInUserNamespace” 特性门控。
Sysbox 通过在容器内暴露特定的 `/proc` 和 `/sys` 文件系统，
以及其它一些先进的操作系统虚拟化技术来实现。

<!--
## Running Rootless Kubernetes directly on a host

{{% thirdparty-content %}}

### K3s

[K3s](https://k3s.io/) experimentally supports rootless mode.

See [Running K3s with Rootless mode](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental) for the usage.

### Usernetes
[Usernetes](https://github.com/rootless-containers/usernetes) is a reference distribution of Kubernetes that can be installed under `$HOME` directory without the root privilege.

Usernetes supports both containerd and CRI-O as CRI runtimes.
Usernetes supports multi-node clusters using Flannel (VXLAN).

See [the Usernetes repo](https://github.com/rootless-containers/usernetes) for the usage.
-->

## 直接在主机上运行 Rootless 模式的 Kubernetes

{{% thirdparty-content %}}

### K3s

[K3s](https://k3s.io/) 实验性支持了 Rootless 模式。

请参阅[使用 Rootless 模式运行 K3s](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental)
页面中的用法.

### Usernetes
[Usernetes](https://github.com/rootless-containers/usernetes) 是 Kubernetes 的一个参考发行版，
它可以在不使用 root 特权的情况下安装在 `$HOME` 目录下。

Usernetes 支持使用 containerd 和 CRI-O 作为 CRI 运行时。
Usernetes 支持配置了 Flannel (VXLAN)的多节点集群。

关于用法，请参阅 [Usernetes 仓库](https://github.com/rootless-containers/usernetes)。

<!--
## Manually deploy a node that runs the kubelet in a user namespace {#userns-the-hard-way}

This section provides hints for running Kubernetes in a user namespace manually.

{{< note >}}
This section is intended to be read by developers of Kubernetes distributions, not by end users.
{{< /note >}}
-->

## 手动部署一个在用户命名空间运行 kubelet 的节点{#userns-the-hard-way}

本节提供在用户命名空间手动运行 Kubernetes 的注意事项。

{{< note >}}
本节是面向 Kubernetes 发行版的开发者，而不是最终用户。
{{< /note >}}

<!--
### Creating a user namespace

The first step is to create a {{< glossary_tooltip text="user namespace" term_id="userns" >}}.

If you are trying to run Kubernetes in a user-namespaced container such as
Rootless Docker/Podman or LXC/LXD, you are all set, and you can go to the next subsection.

Otherwise you have to create a user namespace by yourself, by calling `unshare(2)` with `CLONE_NEWUSER`.

A user namespace can be also unshared by using command line tools such as:

- [`unshare(1)`](https://man7.org/linux/man-pages/man1/unshare.1.html)
- [RootlessKit](https://github.com/rootless-containers/rootlesskit)
- [become-root](https://github.com/giuseppe/become-root)

After unsharing the user namespace, you will also have to unshare other namespaces such as mount namespace.

You do *not* need to call `chroot()` nor `pivot_root()` after unsharing the mount namespace,
however, you have to mount writable filesystems on several directories *in* the namespace.

At least, the following directories need to be writable *in* the namespace (not *outside* the namespace):

- `/etc`
- `/run`
- `/var/logs`
- `/var/lib/kubelet`
- `/var/lib/cni`
- `/var/lib/containerd` (for containerd)
- `/var/lib/containers` (for CRI-O)
-->

### 创建用户命名空间

第一步是创建一个 {{< glossary_tooltip text="用户命名空间" term_id="userns" >}}。

如果你正在尝试使用用户命名空间的容器（例如 Rootless 模式的 Docker/Podman 或 LXC/LXD）
运行 Kubernetes，那么你已经准备就绪，可以直接跳到下一小节。

否则你需要通过传递参数 `CLONE_NEWUSER` 调用 `unshare(2)`，自己创建一个命名空间。

用户命名空间也可以通过如下所示的命令行工具取消共享：

- [`unshare(1)`](https://man7.org/linux/man-pages/man1/unshare.1.html)
- [RootlessKit](https://github.com/rootless-containers/rootlesskit)
- [become-root](https://github.com/giuseppe/become-root)

在取消命名空间的共享之后，你也必须对其它的命名空间例如 mount 命名空间取消共享。

在取消 mount 命名空间的共享之后，你**不**需要调用 `chroot()` 或者 `pivot_root()`，
但是你必须**在这个命名空间内**挂载可写的文件系统到几个目录上。

请确保**这个命名空间内**(不是这个命名空间外部)至少以下几个目录是可写的：

- `/etc`
- `/run`
- `/var/logs`
- `/var/lib/kubelet`
- `/var/lib/cni`
- `/var/lib/containerd` (参照 containerd)
- `/var/lib/containers` (参照 CRI-O)

<!--
### Creating a delegated cgroup tree

In addition to the user namespace, you also need to have a writable cgroup tree with cgroup v2.

{{< note >}}
Kubernetes support for running Node components in user namespaces requires cgroup v2.
Cgroup v1 is not supported.
{{< /note >}}

If you are trying to run Kubernetes in Rootless Docker/Podman or LXC/LXD on a systemd-based host, you are all set.

Otherwise you have to create a systemd unit with `Delegate=yes` property to delegate a cgroup tree with writable permission.

On your node, systemd must already be configured to allow delegation; for more details, see
[cgroup v2](https://rootlesscontaine.rs/getting-started/common/cgroup2/) in the Rootless
Containers documentation.
-->

### 创建委派 cgroup 树

除了用户命名空间，你也需要有一个版本为 cgroup v2 的可写 cgroup 树。

{{< note >}}
Kubernetes 需要 cgroup v2 才支持在用户命名空间运行节点组件。
cgroup v1 是不支持的。
{{< /note >}}

如果你在一个采用 systemd 机制的主机上使用用户命名空间的容器（例如 Rootless 模式的 Docker/Podman
或 LXC/LXD）来运行 Kubernetes，那么你已经准备就绪。

否则你必须创建一个具有 `Delegate=yes` 属性的 systemd 单元，来委派一个具有可写权限的 cgroup 树。

在你的节点上，systemd 必须已经配置为允许委派。更多细节请参阅 Rootless 容器文档的
[cgroup v2](https://rootlesscontaine.rs/getting-started/common/cgroup2/) 部分。

<!--
### Configuring network

{{% thirdparty-content %}}

The network namespace of the Node components has to have a non-loopback interface, which can be for example configured with
[slirp4netns](https://github.com/rootless-containers/slirp4netns),
[VPNKit](https://github.com/moby/vpnkit), or
[lxc-user-nic(1)](https://www.man7.org/linux/man-pages/man1/lxc-user-nic.1.html).

The network namespaces of the Pods can be configured with regular CNI plugins.
For multi-node networking, Flannel (VXLAN, 8472/UDP) is known to work.

Ports such as the kubelet port (10250/TCP) and `NodePort` service ports have to be exposed from the Node network namespace to
the host with an external port forwarder, such as RootlessKit, slirp4netns, or
[socat(1)](https://linux.die.net/man/1/socat).

You can use the port forwarder from K3s.
See [Running K3s in Rootless Mode](https://rancher.com/docs/k3s/latest/en/advanced/#known-issues-with-rootless-mode)
for more details.
The implementation can be found in [the `pkg/rootlessports` package](https://github.com/k3s-io/k3s/blob/v1.22.3+k3s1/pkg/rootlessports/controller.go) of k3s.

### Configuring CRI

The kubelet relies on a container runtime. You should deploy a container runtime such as
containerd or CRI-O and ensure that it is running within the user namespace before the kubelet starts.
-->

### 配置网络

{{% thirdparty-content %}}

节点组件的网络命名空间必须有一个非本地回路的网卡。它可以使用
[slirp4netns](https://github.com/rootless-containers/slirp4netns)、
[VPNKit](https://github.com/moby/vpnkit)、
[lxc-user-nic(1)](https://www.man7.org/linux/man-pages/man1/lxc-user-nic.1.html)
等工具进行配置。

Pod 的网络命名空间可以使用常规的 CNI 插件配置。对于多节点的网络，已知 Flannel (VXLAN、8472/UDP) 可以正常工作。

诸如 kubelet 端口（10250/TCP）和 `NodePort` 服务端口之类的端口必须通过外部端口转发器
（例如 RootlessKit、slirp4netns 或
[socat(1)](https://linux.die.net/man/1/socat)) 从节点网络命名空间暴露给主机。

你可以使用 K3s 的端口转发器。更多细节请参阅
[在 Rootless 模式下运行 K3s](https://rancher.com/docs/k3s/latest/en/advanced/#known-issues-with-rootless-mode)。
该实现可以在 k3s 的 [`pkg/rootlessports` 包](https://github.com/k3s-io/k3s/blob/v1.22.3+k3s1/pkg/rootlessports/controller.go)中找到。

### 配置 CRI

kubelet 依赖于容器运行时。你需要部署一个容器运行时（例如 containerd 或 CRI-O），
并确保它在 kubelet 启动之前已经在用户命名空间内运行。

<!--
{{< tabs name="cri" >}}
{{% tab name="containerd" %}}

Running CRI plugin of containerd in a user namespace is supported since containerd 1.4.

Running containerd within a user namespace requires the following configurations.

```toml
version = 2

[plugins."io.containerd.grpc.v1.cri"]
# Disable AppArmor
  disable_apparmor = true
# Ignore an error during setting oom_score_adj
  restrict_oom_score_adj = true
# Disable hugetlb cgroup v2 controller (because systemd does not support delegating hugetlb controller)
  disable_hugetlb_controller = true

[plugins."io.containerd.grpc.v1.cri".containerd]
# Using non-fuse overlayfs is also possible for kernel >= 5.11, but requires SELinux to be disabled
  snapshotter = "fuse-overlayfs"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
# We use cgroupfs that is delegated by systemd, so we do not use SystemdCgroup driver
# (unless you run another systemd in the namespace)
  SystemdCgroup = false
```

The default path of the configuration file is `/etc/containerd/config.toml`.
The path can be specified with `containerd -c /path/to/containerd/config.toml`.

{{% /tab %}}

{{% tab name="CRI-O" %}}

Running CRI-O in a user namespace is supported since CRI-O 1.22.

CRI-O requires an environment variable `_CRIO_ROOTLESS=1` to be set.

The following configurations are also recommended:

```toml
[crio]
  storage_driver = "overlay"
# Using non-fuse overlayfs is also possible for kernel >= 5.11, but requires SELinux to be disabled
  storage_option = ["overlay.mount_program=/usr/local/bin/fuse-overlayfs"]

[crio.runtime]
# We use cgroupfs that is delegated by systemd, so we do not use "systemd" driver
# (unless you run another systemd in the namespace)
  cgroup_manager = "cgroupfs"
```

The default path of the configuration file is `/etc/crio/crio.conf`.
The path can be specified with `crio --config /path/to/crio/crio.conf`.
{{% /tab %}}
{{< /tabs >}}
-->

{{< tabs name="cri" >}}
{{% tab name="containerd" %}}

containerd 1.4 开始支持在用户命名空间运行 containerd 的 CRI 插件。

在用户命名空间运行 containerd 必须进行如下配置：

```toml
version = 2

[plugins."io.containerd.grpc.v1.cri"]
# 禁用 AppArmor
  disable_apparmor = true
# 忽略配置 oom_score_adj 时的错误
  restrict_oom_score_adj = true
# 禁用 hugetlb cgroup v2 控制器（因为 systemd 不支持委派 hugetlb controller）
  disable_hugetlb_controller = true

[plugins."io.containerd.grpc.v1.cri".containerd]
# 如果内核 >= 5.11 , 也可以使用 non-fuse overlayfs， 但需要禁用 SELinux
  snapshotter = "fuse-overlayfs"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
# 我们使用的 cgroupfs 已经被 systemd 委派，所以我们不使用 SystemdCgroup 驱动
# (除非你在命名空间内运行了另一个 systemd)
  SystemdCgroup = false
```
配置文件的默认路径是 `/etc/containerd/config.toml`。
可以用 `containerd -c /path/to/containerd/config.toml` 来指定该路径。
{{% /tab %}}

{{% tab name="CRI-O" %}}

CRI-O 1.22 开始支持在用户命名空间运行 CRI-O。

CRI-O 必须配置一个环境变量 `_CRIO_ROOTLESS=1`。

也推荐使用以下配置：

```toml
[crio]
  storage_driver = "overlay"
# 如果内核 >= 5.11 , 也可以使用 non-fuse overlayfs， 但需要禁用 SELinux
  storage_option = ["overlay.mount_program=/usr/local/bin/fuse-overlayfs"]

[crio.runtime]
# 我们使用的 cgroupfs 已经被 systemd 委派，所以我们不使用 "systemd" 驱动
# (除非你在命名空间内运行了另一个 systemd)
  cgroup_manager = "cgroupfs"
```
配置文件的默认路径是 `/etc/containerd/config.toml`。
可以用 `containerd -c /path/to/containerd/config.toml` 来指定该路径。
{{% /tab %}}
{{< /tabs >}}

<!--
### Configuring kubelet

Running kubelet in a user namespace requires the following configuration:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  KubeletInUserNamespace: true
# We use cgroupfs that is delegated by systemd, so we do not use "systemd" driver
# (unless you run another systemd in the namespace)
cgroupDriver: "cgroupfs"
```

When the `KubeletInUserNamespace` feature gate is enabled, the kubelet ignores errors
that may happen during setting the following sysctl values on the node.

- `vm.overcommit_memory`
- `vm.panic_on_oom`
- `kernel.panic`
- `kernel.panic_on_oops`
- `kernel.keys.root_maxkeys`
- `kernel.keys.root_maxbytes`.

Within a user namespace, the kubelet also ignores any error raised from trying to open `/dev/kmsg`.
This feature gate also allows kube-proxy to ignore an error during setting `RLIMIT_NOFILE`.

The `KubeletInUserNamespace` feature gate was introduced in Kubernetes v1.22 with "alpha" status.

Running kubelet in a user namespace without using this feature gate is also possible
by mounting a specially crafted proc filesystem (as done by [Sysbox](https://github.com/nestybox/sysbox)), but not officially supported.
-->

### 配置 kubelet

在用户命名空间运行 kubelet 必须进行如下配置：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  KubeletInUserNamespace: true
# 我们使用的 cgroupfs 已经被 systemd 委派，所以我们不使用 "systemd" 驱动
# (除非你在命名空间内运行了另一个 systemd)
cgroupDriver: "cgroupfs"
```

当 `KubeletInUserNamespace` 特性门控被启用时， kubelet 会忽略节点内由于配置如下几个 sysctl
参数值而可能产生的错误。

- `vm.overcommit_memory`
- `vm.panic_on_oom`
- `kernel.panic`
- `kernel.panic_on_oops`
- `kernel.keys.root_maxkeys`
- `kernel.keys.root_maxbytes`.

在用户命名空间内， kubelet 也会忽略任何由于打开 `/dev/kmsg` 而产生的错误。
这个特性门控也允许 kube-proxy 忽略由于配置 `RLIMIT_NOFILE` 而产生的一个错误。

`KubeletInUserNamespace` 特性门控从 Kubernetes v1.22 被引入， 标记为 "alpha" 状态。

通过挂载特制的 proc 文件系统 （比如 [Sysbox](https://github.com/nestybox/sysbox)），
也可以在不使用这个特性门控的情况下在用户命名空间运行 kubelet，但这不受官方支持。

<!--
### Configuring kube-proxy

Running kube-proxy in a user namespace requires the following configuration:

```yaml
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: "iptables" # or "userspace"
conntrack:
# Skip setting sysctl value "net.netfilter.nf_conntrack_max"
  maxPerCore: 0
# Skip setting "net.netfilter.nf_conntrack_tcp_timeout_established"
  tcpEstablishedTimeout: 0s
# Skip setting "net.netfilter.nf_conntrack_tcp_timeout_close"
  tcpCloseWaitTimeout: 0s
```
-->

### 配置 kube-proxy

在用户命名空间运行 kube-proxy 需要进行以下配置：

```yaml
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: "iptables" # or "userspace"
conntrack:
# 跳过配置 sysctl 的值 "net.netfilter.nf_conntrack_max"
  maxPerCore: 0
# 跳过配置 "net.netfilter.nf_conntrack_tcp_timeout_established"
  tcpEstablishedTimeout: 0s
# 跳过配置 "net.netfilter.nf_conntrack_tcp_timeout_close"
  tcpCloseWaitTimeout: 0s
```

<!--
## Caveats

- Most of "non-local" volume drivers such as `nfs` and `iscsi` do not work.
  Local volumes like `local`, `hostPath`, `emptyDir`, `configMap`, `secret`, and `downwardAPI` are known to work.

- Some CNI plugins may not work. Flannel (VXLAN) is known to work.

For more on this, see the [Caveats and Future work](https://rootlesscontaine.rs/caveats/) page
on the rootlesscontaine.rs website.
-->

## 注意事项   {#caveats}

- 大部分“非本地”的卷驱动（例如 `nfs` 和 `iscsi`）不能正常工作。
  已知诸如 `local`、`hostPath`、`emptyDir`、`configMap`、`secret` 和 `downwardAPI`
  这些本地卷是能正常工作的。

- 一些 CNI 插件可能不正常工作。已知 Flannel (VXLAN) 是能正常工作的。

更多细节请参阅 rootlesscontaine.rs 站点的 [Caveats and Future work](https://rootlesscontaine.rs/caveats/) 页面。

<!--
## {{% heading "seealso" %}}

- [rootlesscontaine.rs](https://rootlesscontaine.rs/)
- [Rootless Containers 2020 (KubeCon NA 2020)](https://www.slideshare.net/AkihiroSuda/kubecon-na-2020-containerd-rootless-containers-2020)
- [Running kind with Rootless Docker](https://kind.sigs.k8s.io/docs/user/rootless/)
- [Usernetes](https://github.com/rootless-containers/usernetes)
- [Running K3s with rootless mode](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental)
- [KEP-2033: Kubelet-in-UserNS (aka Rootless mode)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2033-kubelet-in-userns-aka-rootless)
-->

## {{% heading "seealso" %}}

- [rootlesscontaine.rs](https://rootlesscontaine.rs/)
- [Rootless Containers 2020 (KubeCon NA 2020)](https://www.slideshare.net/AkihiroSuda/kubecon-na-2020-containerd-rootless-containers-2020)
- [使用 Rootless 模式的 Docker 运行 kind](https://kind.sigs.k8s.io/docs/user/rootless/)
- [Usernetes](https://github.com/rootless-containers/usernetes)
- [使用 Rootless 模式运行 K3s](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental)
- [KEP-2033: Kubelet-in-UserNS (aka Rootless mode)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2033-kubelet-in-userns-aka-rootless)