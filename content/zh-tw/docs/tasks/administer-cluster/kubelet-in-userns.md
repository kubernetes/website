---
title: 以非 root 使用者身份運行 Kubernetes 節點組件
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

這個文檔描述了怎樣不使用 root 特權，而是通過使用 {{< glossary_tooltip text="使用者命名空間" term_id="userns" >}}
去運行 Kubernetes 節點組件（例如 kubelet、CRI、OCI、CNI）。

這種技術也叫做 **rootless 模式（Rootless mode）**。

{{< note >}}
這個文檔描述了怎麼以非 root 使用者身份運行 Kubernetes 節點組件以及 Pod。
如果你只是想了解如何以非 root 身份運行 Pod，請參閱 [SecurityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)。
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

* [啓用 cgroup v2](https://rootlesscontaine.rs/getting-started/common/cgroup2/)
* [在 systemd 中啓用 user session](https://rootlesscontaine.rs/getting-started/common/login/)
* [根據不同的 Linux 發行版，設定 sysctl 的值](https://rootlesscontaine.rs/getting-started/common/sysctl/)
* [確保你的非特權使用者被列在 `/etc/subuid` 和 `/etc/subgid` 檔案中](https://rootlesscontaine.rs/getting-started/common/subuid/)
* 啓用 `KubeletInUserNamespace` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)

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

## 使用 Rootless 模式的 Docker/Podman 運行 Kubernetes

### kind

[kind](https://kind.sigs.k8s.io/) 支持使用 Rootless 模式的 Docker 或者 Podman 運行 Kubernetes。

請參閱[使用 Rootless 模式的 Docker 運行 kind](https://kind.sigs.k8s.io/docs/user/rootless/)。

### minikube

[minikube](https://minikube.sigs.k8s.io/) 也支持使用 Rootless 模式的 Docker 或 Podman 運行 Kubernetes。

請參閱 Minikube 文檔：

* [Rootless Docker](https://minikube.sigs.k8s.io/docs/drivers/docker/)
* [Rootless Podman](https://minikube.sigs.k8s.io/docs/drivers/podman/)

<!--
## Running Kubernetes inside Unprivileged Containers

{{% thirdparty-content %}}

### sysbox

-->

## 在非特權容器內運行 Kubernetes

{{% thirdparty-content %}}

### sysbox

<!--
[Sysbox](https://github.com/nestybox/sysbox) is an open-source container runtime
(similar to "runc") that supports running system-level workloads such as Docker
and Kubernetes inside unprivileged containers isolated with the Linux user
namespace.
-->

[Sysbox](https://github.com/nestybox/sysbox) 是一個開源容器運行時
(類似於 “runc”），支持在 Linux 使用者命名空間隔離的非特權容器內運行系統級工作負載，
比如 Docker 和 Kubernetes。

<!--
See [Sysbox Quick Start Guide: Kubernetes-in-Docker](https://github.com/nestybox/sysbox/blob/master/docs/quickstart/kind.md) for more info.
-->

查看 [Sysbox 快速入門指南: Kubernetes-in-Docker](https://github.com/nestybox/sysbox/blob/master/docs/quickstart/kind.md)
瞭解更多細節。

<!--
Sysbox supports running Kubernetes inside unprivileged containers without
requiring Cgroup v2 and without the `KubeletInUserNamespace` feature gate. It
does this by exposing specially crafted `/proc` and `/sys` filesystems inside
the container plus several other advanced OS virtualization techniques.
-->

Sysbox 支持在非特權容器內運行 Kubernetes，
而不需要 cgroup v2 和 “KubeletInUserNamespace” 特性門控。
Sysbox 通過在容器內暴露特定的 `/proc` 和 `/sys` 檔案系統，
以及其它一些先進的操作系統虛擬化技術來實現。

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

## 直接在主機上運行 Rootless 模式的 Kubernetes

{{% thirdparty-content %}}

### K3s

[K3s](https://k3s.io/) 實驗性支持了 Rootless 模式。

請參閱[使用 Rootless 模式運行 K3s](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental)
頁面中的用法.

### Usernetes
[Usernetes](https://github.com/rootless-containers/usernetes) 是 Kubernetes 的一個參考發行版，
它可以在不使用 root 特權的情況下安裝在 `$HOME` 目錄下。

Usernetes 支持使用 containerd 和 CRI-O 作爲 CRI 運行時。
Usernetes 支持設定了 Flannel (VXLAN)的多節點叢集。

關於用法，請參閱 [Usernetes 倉庫](https://github.com/rootless-containers/usernetes)。

<!--
## Manually deploy a node that runs the kubelet in a user namespace {#userns-the-hard-way}

This section provides hints for running Kubernetes in a user namespace manually.

{{< note >}}
This section is intended to be read by developers of Kubernetes distributions, not by end users.
{{< /note >}}
-->

## 手動部署一個在使用者命名空間運行 kubelet 的節點{#userns-the-hard-way}

本節提供在使用者命名空間手動運行 Kubernetes 的注意事項。

{{< note >}}
本節是面向 Kubernetes 發行版的開發者，而不是最終使用者。
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

### 創建使用者命名空間

第一步是創建一個 {{< glossary_tooltip text="使用者命名空間" term_id="userns" >}}。

如果你正在嘗試使用使用者命名空間的容器（例如 Rootless 模式的 Docker/Podman 或 LXC/LXD）
運行 Kubernetes，那麼你已經準備就緒，可以直接跳到下一小節。

否則你需要通過傳遞參數 `CLONE_NEWUSER` 調用 `unshare(2)`，自己創建一個命名空間。

使用者命名空間也可以通過如下所示的命令列工具取消共享：

- [`unshare(1)`](https://man7.org/linux/man-pages/man1/unshare.1.html)
- [RootlessKit](https://github.com/rootless-containers/rootlesskit)
- [become-root](https://github.com/giuseppe/become-root)

在取消命名空間的共享之後，你也必須對其它的命名空間例如 mount 命名空間取消共享。

在取消 mount 命名空間的共享之後，你**不**需要調用 `chroot()` 或者 `pivot_root()`，
但是你必須**在這個命名空間內**掛載可寫的檔案系統到幾個目錄上。

請確保**這個命名空間內**(不是這個命名空間外部)至少以下幾個目錄是可寫的：

- `/etc`
- `/run`
- `/var/logs`
- `/var/lib/kubelet`
- `/var/lib/cni`
- `/var/lib/containerd` (參照 containerd)
- `/var/lib/containers` (參照 CRI-O)

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

### 創建委派 cgroup 樹

除了使用者命名空間，你也需要有一個版本爲 cgroup v2 的可寫 cgroup 樹。

{{< note >}}
Kubernetes 需要 cgroup v2 才支持在使用者命名空間運行節點組件。
cgroup v1 是不支持的。
{{< /note >}}

如果你在一個採用 systemd 機制的主機上使用使用者命名空間的容器（例如 Rootless 模式的 Docker/Podman
或 LXC/LXD）來運行 Kubernetes，那麼你已經準備就緒。

否則你必須創建一個具有 `Delegate=yes` 屬性的 systemd 單元，來委派一個具有可寫權限的 cgroup 樹。

在你的節點上，systemd 必須已經設定爲允許委派。更多細節請參閱 Rootless 容器文檔的
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

### 設定網路

{{% thirdparty-content %}}

節點組件的網路命名空間必須有一個非本地迴路的網卡。它可以使用
[slirp4netns](https://github.com/rootless-containers/slirp4netns)、
[VPNKit](https://github.com/moby/vpnkit)、
[lxc-user-nic(1)](https://www.man7.org/linux/man-pages/man1/lxc-user-nic.1.html)
等工具進行設定。

Pod 的網路命名空間可以使用常規的 CNI 插件設定。對於多節點的網路，已知 Flannel (VXLAN、8472/UDP) 可以正常工作。

諸如 kubelet 端口（10250/TCP）和 `NodePort` 服務端口之類的端口必須通過外部端口轉發器
（例如 RootlessKit、slirp4netns 或
[socat(1)](https://linux.die.net/man/1/socat)) 從節點網路命名空間暴露給主機。

你可以使用 K3s 的端口轉發器。更多細節請參閱
[在 Rootless 模式下運行 K3s](https://rancher.com/docs/k3s/latest/en/advanced/#known-issues-with-rootless-mode)。
該實現可以在 k3s 的 [`pkg/rootlessports` 包](https://github.com/k3s-io/k3s/blob/v1.22.3+k3s1/pkg/rootlessports/controller.go)中找到。

### 設定 CRI

kubelet 依賴於容器運行時。你需要部署一個容器運行時（例如 containerd 或 CRI-O），
並確保它在 kubelet 啓動之前已經在使用者命名空間內運行。

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

containerd 1.4 開始支持在使用者命名空間運行 containerd 的 CRI 插件。

在使用者命名空間運行 containerd 必須進行如下設定：

```toml
version = 2

[plugins."io.containerd.grpc.v1.cri"]
# 禁用 AppArmor
  disable_apparmor = true
# 忽略配置 oom_score_adj 時的錯誤
  restrict_oom_score_adj = true
# 禁用 hugetlb cgroup v2 控制器（因爲 systemd 不支持委派 hugetlb controller）
  disable_hugetlb_controller = true

[plugins."io.containerd.grpc.v1.cri".containerd]
# 如果內核 >= 5.11 , 也可以使用 non-fuse overlayfs， 但需要禁用 SELinux
  snapshotter = "fuse-overlayfs"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
# 我們使用的 cgroupfs 已經被 systemd 委派，所以我們不使用 SystemdCgroup 驅動
# (除非你在命名空間內運行了另一個 systemd)
  SystemdCgroup = false
```
設定檔案的預設路徑是 `/etc/containerd/config.toml`。
可以用 `containerd -c /path/to/containerd/config.toml` 來指定該路徑。
{{% /tab %}}

{{% tab name="CRI-O" %}}

CRI-O 1.22 開始支持在使用者命名空間運行 CRI-O。

CRI-O 必須設定一個環境變量 `_CRIO_ROOTLESS=1`。

也推薦使用以下設定：

```toml
[crio]
  storage_driver = "overlay"
# 如果內核 >= 5.11 , 也可以使用 non-fuse overlayfs， 但需要禁用 SELinux
  storage_option = ["overlay.mount_program=/usr/local/bin/fuse-overlayfs"]

[crio.runtime]
# 我們使用的 cgroupfs 已經被 systemd 委派，所以我們不使用 "systemd" 驅動
# (除非你在命名空間內運行了另一個 systemd)
  cgroup_manager = "cgroupfs"
```
設定檔案的預設路徑是 `/etc/containerd/config.toml`。
可以用 `containerd -c /path/to/containerd/config.toml` 來指定該路徑。
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

### 設定 kubelet

在使用者命名空間運行 kubelet 必須進行如下設定：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  KubeletInUserNamespace: true
# 我們使用的 cgroupfs 已經被 systemd 委派，所以我們不使用 "systemd" 驅動
# (除非你在命名空間內運行了另一個 systemd)
cgroupDriver: "cgroupfs"
```

當 `KubeletInUserNamespace` 特性門控被啓用時， kubelet 會忽略節點內由於設定如下幾個 sysctl
參數值而可能產生的錯誤。

- `vm.overcommit_memory`
- `vm.panic_on_oom`
- `kernel.panic`
- `kernel.panic_on_oops`
- `kernel.keys.root_maxkeys`
- `kernel.keys.root_maxbytes`.

在使用者命名空間內， kubelet 也會忽略任何由於打開 `/dev/kmsg` 而產生的錯誤。
這個特性門控也允許 kube-proxy 忽略由於設定 `RLIMIT_NOFILE` 而產生的一個錯誤。

`KubeletInUserNamespace` 特性門控從 Kubernetes v1.22 被引入， 標記爲 "alpha" 狀態。

通過掛載特製的 proc 檔案系統 （比如 [Sysbox](https://github.com/nestybox/sysbox)），
也可以在不使用這個特性門控的情況下在使用者命名空間運行 kubelet，但這不受官方支持。

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

### 設定 kube-proxy

在使用者命名空間運行 kube-proxy 需要進行以下設定：

```yaml
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: "iptables" # or "userspace"
conntrack:
# 跳過配置 sysctl 的值 "net.netfilter.nf_conntrack_max"
  maxPerCore: 0
# 跳過配置 "net.netfilter.nf_conntrack_tcp_timeout_established"
  tcpEstablishedTimeout: 0s
# 跳過配置 "net.netfilter.nf_conntrack_tcp_timeout_close"
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

## 注意事項   {#caveats}

- 大部分“非本地”的卷驅動（例如 `nfs` 和 `iscsi`）不能正常工作。
  已知諸如 `local`、`hostPath`、`emptyDir`、`configMap`、`secret` 和 `downwardAPI`
  這些本地卷是能正常工作的。

- 一些 CNI 插件可能不正常工作。已知 Flannel (VXLAN) 是能正常工作的。

更多細節請參閱 rootlesscontaine.rs 站點的 [Caveats and Future work](https://rootlesscontaine.rs/caveats/) 頁面。

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
- [使用 Rootless 模式的 Docker 運行 kind](https://kind.sigs.k8s.io/docs/user/rootless/)
- [Usernetes](https://github.com/rootless-containers/usernetes)
- [使用 Rootless 模式運行 K3s](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental)
- [KEP-2033: Kubelet-in-UserNS (aka Rootless mode)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2033-kubelet-in-userns-aka-rootless)