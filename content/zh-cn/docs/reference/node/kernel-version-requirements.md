---
content_type: "reference"
title: Linux 内核版本要求
weight: 10
---
<!--
content_type: "reference"
title: Linux Kernel Version Requirements
weight: 10
-->

{{% thirdparty-content %}}

<!--
Many features rely on specific kernel functionalities and have minimum kernel version requirements.
However, relying solely on kernel version numbers may not be sufficient
for certain operating system distributions,
as maintainers for distributions such as RHEL, Ubuntu and SUSE often backport selected features
to older kernel releases (retaining the older kernel version).
-->
许多特性依赖于特定的内核功能，并且有最低的内核版本要求。
然而，单纯依赖内核版本号可能不足以满足某些操作系统发行版，
因为像 RHEL、Ubuntu 和 SUSE 等发行版的维护者们通常会将选定的特性反向移植到较旧的内核版本（保留较旧的内核版本）。

## Pod sysctls

<!--
On Linux, the `sysctl()` system call configures kernel parameters at run time. There is a command
line tool named `sysctl` that you can use to configure these parameters, and many are exposed via
the `proc` filesystem.

Some sysctls are only available if you have a modern enough kernel.

The following sysctls have a minimal kernel version requirement,
and are supported in the [safe set](/docs/tasks/administer-cluster/sysctl-cluster/#safe-and-unsafe-sysctls):
-->
在 Linux 中，`sysctl()` 系统调用在运行时配置内核参数。
你可以使用名为 `sysctl` 的命令行工具来配置这些参数，许多参数通过 `proc` 文件系统暴露。

某些 sysctl 仅可用于足够新的内核上。

以下 sysctl 具有最低的内核版本要求，
并在[安全集](/zh-cn/docs/tasks/administer-cluster/sysctl-cluster/#safe-and-unsafe-sysctls)中得到了支持：

<!--
Code: https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L19-L45
-->

<!--
- `net.ipv4.ip_local_reserved_ports` (since Kubernetes 1.27, needs kernel 3.16+);
- `net.ipv4.tcp_keepalive_time` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_fin_timeout` (since Kubernetes 1.29, needs kernel 4.6+);
- `net.ipv4.tcp_keepalive_intvl` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_keepalive_probes` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_syncookies` (namespaced since kernel 4.6+).
- `net.ipv4.vs.conn_reuse_mode` (used in `ipvs` proxy mode, needs kernel 4.1+);

### kube proxy `nftables` proxy mode
-->
- `net.ipv4.ip_local_reserved_ports`（自 Kubernetes 1.27 起，需要内核 3.16+）；
- `net.ipv4.tcp_keepalive_time`（自 Kubernetes 1.29 起，需要内核 4.5+）；
- `net.ipv4.tcp_fin_timeout`（自 Kubernetes 1.29 起，需要内核 4.6+）；
- `net.ipv4.tcp_keepalive_intvl`（自 Kubernetes 1.29 起，需要内核 4.5+）；
- `net.ipv4.tcp_keepalive_probes`（自 Kubernetes 1.29 起，需要内核 4.5+）；
- `net.ipv4.tcp_syncookies`（自内核 4.6+ 添加了命名空间作用域）。
- `net.ipv4.vs.conn_reuse_mode`（用于 `ipvs` 代理模式，需要内核 4.1+）；

### kube proxy `nftables` 代理模式   {#kube-proxy-nftables-proxy-mode}

<!--
Code: https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L53-L56
-->

<!--
For Kubernetes {{< skew currentVersion >}}, the
[`nftables` mode](/docs/reference/networking/virtual-ips/#proxy-mode-nftables) of kube-proxy requires
version 1.0.1 or later
of the nft command-line tool, as well as kernel 5.13 or later.

For testing/development purposes, you can use older kernels, as far back as 5.4 if you set the
`nftables.skipKernelVersionCheck` option in the kube-proxy config.
But this is not recommended in production since it may cause problems with other nftables
users on the system.
-->
对于 Kubernetes {{< skew currentVersion >}}，kube-proxy 的
[`nftables` 模式](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-nftables)要求
nft 命令行工具为 v1.0.1 或更高版本，要求内核为 v5.13 或更高版本。

出于测试/开发目的，你可以使用较旧的内核，如果你在 kube-proxy 配置中设置 `nftables.skipKernelVersionCheck` 选项，
最老可以回溯到 v5.4。但在生产环境中不推荐这样做，因为这可能会导致系统上其他 nftables 用户出现问题。

<!--
## Version 2 control groups

Kubernetes cgroup v1 support is in maintained mode starting from Kubernetes v1.31; using cgroup v2
is recommended.
In [Linux 5.8](https://github.com/torvalds/linux/commit/4a7e89c5ec0238017a757131eb9ab8dc111f961c), the system-level `cpu.stat` file was added to the root cgroup for convenience.

In runc document, Kernel older than 5.2 is not recommended due to lack of freezer.
-->
## v2 控制组   {#version2-control-groups}

Kubernetes 对 cgroup v1 的支持从 v1.31 开始处于维护模式；推荐使用 cgroup v2。
在 [Linux 5.8](https://github.com/torvalds/linux/commit/4a7e89c5ec0238017a757131eb9ab8dc111f961c)
中，为了方便使用，系统层面的 `cpu.stat` 文件被添加到根 cgroup。

在 runc 文档中，不推荐使用低于 5.2 的内核，因为其缺少冻结特性。

<!--
## Other kernel requirements {#requirements-other}

Some features may depend on new kernel functionalities and have specific kernel requirements:
-->
## 其他内核要求   {#requirements-other}

某些特性可能依赖于新的内核功能并具有特定的内核要求：

<!--
Code(recursive read only mount): https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/staging/src/k8s.io/cri-api/pkg/apis/runtime/v1/api.proto#L1605-L1609
Code(user namespace and swap): https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L47-L51
-->

<!--
1. [Recursive read only mount](/docs/concepts/storage/volumes/#recursive-read-only-mounts):
    This is implemented by applying the `MOUNT_ATTR_RDONLY` attribute with the `AT_RECURSIVE` flag
    using `mount_setattr`(2) added in Linux kernel v5.12.
2. Pod user namespace support requires minimal kernel version 6.5+, according to
   [KEP-127](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/127-user-namespaces/README.md).
3. For [node system swap](/docs/concepts/architecture/nodes/#swap-memory), tmpfs set to `noswap`
   is not supported until kernel 6.3.
-->
1. [递归只读挂载](/zh-cn/docs/concepts/storage/volumes/#recursive-read-only-mounts)：
   这是通过应用 `MOUNT_ATTR_RDONLY` 属性和 `AT_RECURSIVE` 标志来实现的，使用的是在 Linux
   内核 v5.12 中添加的 `mount_setattr`(2)。
2. Pod 用户命名空间支持需要最低内核版本 6.5+，参阅
   [KEP-127](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/127-user-namespaces/README.md)。
3. 对于[节点系统交换](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)，
   直到内核 6.3 才支持将 tmpfs 设置为 `noswap`。

<!--
## Linux kernel long term maintenance

Active kernel releases can be found in [kernel.org](https://www.kernel.org/category/releases.html).

There are usually several _long term maintenance_ kernel releases provided for the purposes of backporting
bug fixes for older kernel trees. Only important bug fixes are applied to such kernels and they don't
usually see very frequent releases, especially for older trees.
See the Linux kernel website for the [list of releases](https://www.kernel.org/category/releases.html)
in the _Longterm_ category.
-->
## Linux 内核长期维护   {#linux-kernel-long-term-maintenance}

你可以在 [kernel.org](https://www.kernel.org/category/releases.html) 找到活动的内核版本。

通常会提供多个 __长期维护__ 内核版本，用于将 Bug 修复反向移植到较旧的内核树。
特别是对于较旧的树，只有重要的 Bug 修复才会被应用到此类内核，这些内核通常不会频繁发布新版本。
请参阅 Linux 内核网站，了解 _Longterm_ 类别中的[发布列表](https://www.kernel.org/category/releases.html)。

## {{% heading "whatsnext" %}}

<!--
- See [sysctls](/docs/tasks/administer-cluster/sysctl-cluster/) for more details.
- Allow running kube-proxy with in [nftables mode](/docs/reference/networking/virtual-ips/#proxy-mode-nftables).
- Read more information in [cgroups v2](/docs/concepts/architecture/cgroups/).
-->
- 查阅 [sysctls](/zh-cn/docs/tasks/administer-cluster/sysctl-cluster/) 以获取更多细节。
- 允许在 [nftables 模式](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-nftables)下运行 kube-proxy。
- 参阅 [cgroups v2](/zh-cn/docs/concepts/architecture/cgroups/)。
