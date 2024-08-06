---
content_type: "reference"
title: Linux Kernel Version Requirements
weight: 10
---

{{% thirdparty-content %}}

Many features rely on specific kernel functionalities and have minimum kernel version requirements.
However, relying solely on kernel version numbers may not be sufficient
for certain operating system distributions,
as maintainers for distributions such as RHEL, Ubuntu and SUSE often backport selected features
to older kernel releases (retaining the older kernel version).

## Pod sysctls

On Linux, the `sysctl()` system call configures kernel parameters at run time. There is a command
line tool named `sysctl` that you can use to configure these parameters, and many are exposed via
the `proc` filesystem.

Some sysctls are only available if you have a modern enough kernel.

The following sysctls have a minimal kernel version requirement,
and are supported in the [safe set](/docs/tasks/administer-cluster/sysctl-cluster/#safe-and-unsafe-sysctls):

<!--
Code: https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L19-L45
-->
- `net.ipv4.ip_local_reserved_ports` (since Kubernetes 1.27, needs kernel 3.16+);
- `net.ipv4.tcp_keepalive_time` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_fin_timeout` (since Kubernetes 1.29, needs kernel 4.6+);
- `net.ipv4.tcp_keepalive_intvl` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_keepalive_probes` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_syncookies` (namespaced since kernel 4.6+).
- `net.ipv4.vs.conn_reuse_mode` (used in `ipvs` proxy mode, needs kernel 4.1+);

### kube proxy `nftables` proxy mode

<!--
Code: https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L53-L56
-->
For Kubernetes {{< skew currentVersion >}}, the
[`nftables` mode](/docs/reference/networking/virtual-ips/#proxy-mode-nftables) of kube-proxy requires
version 1.0.1 or later
of the nft command-line tool, as well as kernel 5.13 or later.

For testing/development purposes, you can use older kernels, as far back as 5.4 if you set the
`nftables.skipKernelVersionCheck` option in the kube-proxy config.
But this is not recommended in production since it may cause problems with other nftables
users on the system.

## Version 2 control groups

Kubernetes cgroup v1 support is in maintained mode starting from Kubernetes v1.31; using cgroup v2
is recommended.
In [Linux 5.8](https://github.com/torvalds/linux/commit/4a7e89c5ec0238017a757131eb9ab8dc111f961c), the system-level `cpu.stat` file was added to the root cgroup for convenience.

In runc document, Kernel older than 5.2 is not recommended due to lack of freezer.

## Other kernel requirements {#requirements-other}

Some features may depend on new kernel functionalities and have specific kernel requirements:

<!--
Code(recursive read only mount): https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/staging/src/k8s.io/cri-api/pkg/apis/runtime/v1/api.proto#L1605-L1609
Code(user namespace and swap): https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L47-L51
-->
1. [Recursive read only mount](/docs/concepts/storage/volumes/#recursive-read-only-mounts):
    This is implemented by applying the `MOUNT_ATTR_RDONLY` attribute with the `AT_RECURSIVE` flag
    using `mount_setattr`(2) added in Linux kernel v5.12.
2. Pod user namespace support requires minimal kernel version 6.5+, according to
   [KEP-127](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/127-user-namespaces/README.md).
3. For [node system swap](/docs/concepts/architecture/nodes/#swap-memory), tmpfs set to `noswap`
   is not supported until kernel 6.3.

## Linux kernel long term maintenance

Active kernel releases can be found in [kernel.org](https://www.kernel.org/category/releases.html).

There are usually several _long term maintenance_ kernel releases provided for the purposes of backporting
bug fixes for older kernel trees. Only important bug fixes are applied to such kernels and they don't
usually see very frequent releases, especially for older trees.
See the Linux kernel website for the [list of releases](https://www.kernel.org/category/releases.html)
in the _Longterm_ category.

## {{% heading "whatsnext" %}}

- See [sysctls](/docs/tasks/administer-cluster/sysctl-cluster/) for more details.
- Allow running kube-proxy with in [nftables mode](/docs/reference/networking/virtual-ips/#proxy-mode-nftables).
- Read more information in [cgroups v2](/docs/concepts/architecture/cgroups/).
