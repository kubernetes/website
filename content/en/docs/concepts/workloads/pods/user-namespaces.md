---
title: User Namespaces
reviewers:
content_type: concept
weight: 160
min-kubernetes-server-version: v1.25
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

This page explains how user namespaces are used in Kubernetes pods. A user
namespace allows to isolate the user running inside the container from the one
in the host.

A process running as root in a container can run as a different (non-root) user
in the host; in other words, the process has full privileges for operations
inside the user namespace, but is unprivileged for operations outside the
namespace.

You can use this feature to reduce the damage a compromised container can do to
the host or other pods in the same node. There are [several security
vulnerabilities][KEP-vulns] rated either **HIGH** or **CRITICAL** that were not
exploitable when user namespaces is active. It is expected user namespace will
mitigate some future vulnerabilities too.

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

<!-- body -->
## {{% heading "prerequisites" %}}

{{% thirdparty-content single="true" %}}
<!-- if adding another runtime in the future, omit the single setting -->

This is a Linux only feature. In addition, support is needed in the 
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
to use this feature with Kubernetes stateless pods:

* CRI-O: v1.25 has support for user namespaces.

* containerd: support is planned for the 1.7 release. See containerd
  issue [#7063][containerd-userns-issue] for more details.

Support for this in [cri-dockerd is not planned][CRI-dockerd-issue] yet.

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74
[containerd-userns-issue]: https://github.com/containerd/containerd/issues/7063

## Introduction

User namespaces is a Linux feature that allows to map users in the container to
different users in the host. Furthermore, the capabilities granted to a pod in
a user namespace are valid only in the namespace and void outside of it.

A pod can opt-in to use user nameapces by setting the `pod.spec.hostUsers` field
to `false`.

The kubelet will pick host UIDs/GIDs a pod is mapped to, and will do so in a way
to guarantee that no two stateless pods on the same node use the same mapping.

The `runAsUser`, `runAsGroup`, `fsGroup`, etc. fields in the `pod.spec` always
refer to the user inside the container.

The valid UIDs/GIDs when this feature is enabled is the range 0-65535. This
applies to files and processes (`runAsUser`, `runAsGroup`, etc.).

Files using a UID/GID outside this range will be seen as belonging to the
overflow ID, usually 65534 (configured in `/proc/sys/kernel/overflowuid` and
`/proc/sys/kernel/overflowgid`). However, it is not possible to modify those
files, even by running as the 65534 user/group.

Most applications that need to run as root but don't access other host
namespaces or resources, should continue to run fine without any changes needed
if user namespaces is activated.

## Understanding user namespaces for stateless pods

Several container runtimes with their default configuration (like Docker Engine,
containerd, CRI-O) use Linux namespaces for isolation. Other technologies exist
and can be used with those runtimes too (e.g. Kata Containers uses VMs instead of
Linux namespaces). This page is applicable for container runtimes using Linux
namespaces for isolation.

When creating a pod, by default, several new namespaces are used for isolation:
a network namespace to isolate the network of the container, a PID namespace to
isolate the view of processes, etc. If a user namespace is used, this will
isolate the users in the container from the users in the node.

This means containers can run as root and be mapped to a non-root user on the
host. Inside the container the process will think it is running as root (and
therefore tools like `apt`, `yum`, etc. work fine), while in reality the process
doesn't have privileges on the host. You can verify this, for example, if you
check the user the container process is running `ps` from the host. The user
`ps` shows is not the same as the user you see if you execute inside the
container the command `id`.

This abstraction limits what can happen, for example, if the container manages
to escape to the host. Given that the container is running as a non-privileged
user on the host, it is limited what it can do to the host.

Furthermore, as users on each pod will be mapped to different non-overlapping
users in the host, it is limited what they can do to other pods too.

Capabilities granted to a pod are also limited to the pod user namespace and
mostly invalid out of it, some are even completely void. Here are two examples:
- `CAP_SYS_MODULE` does not have any effect if granted to a pod using user
namespaces, the pod isn't able to load kernel modules.
- `CAP_SYS_ADMIN` is limited to the pod's user namespace and invalid outside
of it.

Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capability were
granted to the container, the capabilities are valid on the host too. None of
this is true when we use user namespaces.

If you want to know more details about what changes when user namespaces are in
use, see `man 7 user_namespaces`.

## Set up a node to support user namespaces

It is recommended that the host's files and host's processes use UIDs/GIDs in
the range of 0-65535.

The kubelet will assign UIDs/GIDs higher than that to pods. Therefore, to
guarantee as much isolation as possible, the UIDs/GIDs used by the host's files
and host's processes should be in the range 0-65535.

Note that this recommendation is important to mitigate the impact of CVEs like
[CVE-2021-25741][CVE-2021-25741], where a pod can potentially read arbitrary
files in the hosts. If the UIDs/GIDs of the pod and the host don't overlap, it
is limited what a pod would be able to do: the pod UID/GID won't match the
host's file owner/group.

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980

## Limitations

When using a user namespace for the pod, it is disallowed to use other host
namespaces. In particular, if you set `hostUsers: false` then you are not
allowed to set any of:

 * `hostNetwork: true`
 * `hostIPC: true`
 * `hostPID: true`

The pod is allowed to use no volumes at all or, if using volumes, only these
volume types are allowed:

 * configmap
 * secret
 * projected
 * downwardAPI
 * emptyDir

To guarantee that the pod can read the files of such volumes, volumes are
created as if you specified `.spec.securityContext.fsGroup` as `0` for the Pod.
If it is specified to a different value, this other value will of course be
honored instead.

As a by-product of this, folders and files for these volumes will have
permissions for the group, even if `defaultMode` or `mode` to specific items of
the volumes were specified without permissions to groups. For example, it is not
possible to mount these volumes in a way that its files have permissions only
for the owner.
