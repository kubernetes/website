---
title: User Namespaces
reviewers:
content_type: concept
weight: 160
min-kubernetes-server-version: v1.25
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.30" state="beta" >}}

This page explains how user namespaces are used in Kubernetes pods. A user
namespace isolates the user running inside the container from the one
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

{{% thirdparty-content %}}

This is a Linux-only feature and support is needed in Linux for idmap mounts on
the filesystems used. This means:

* On the node, the filesystem you use for `/var/lib/kubelet/pods/`, or the
  custom directory you configure for this, needs idmap mount support.
* All the filesystems used in the pod's volumes must support idmap mounts.

In practice this means you need at least Linux 6.3, as tmpfs started supporting
idmap mounts in that version. This is usually needed as several Kubernetes
features use tmpfs (the service account token that is mounted by default uses a
tmpfs, Secrets use a tmpfs, etc.)

Some popular filesystems that support idmap mounts in Linux 6.3 are: btrfs,
ext4, xfs, fat, tmpfs, overlayfs.

In addition, the container runtime and its underlying OCI runtime must support
user namespaces. The following OCI runtimes offer support:

* [crun](https://github.com/containers/crun) version 1.9 or greater (it's recommend version 1.13+).

<!-- ideally, update this if a newer minor release of runc comes out, whether or not it includes the idmap support -->
{{< note >}}
Many OCI runtimes do not include the support needed for using user namespaces in
Linux pods. If you use a managed Kubernetes, or have downloaded it from packages
and set it up, it's likely that nodes in your cluster use a runtime that doesn't
include this support. For example, the most widely used OCI runtime is `runc`,
and version `1.1.z` of runc doesn't support all the features needed by the
Kubernetes implementation of user namespaces.

If there is a newer release of runc than 1.1 available for use, check its
documentation and release notes for compatibility (look for idmap mounts support
in particular, because that is the missing feature).
{{< /note >}}

To use user namespaces with Kubernetes, you also need to use a CRI
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
to use this feature with Kubernetes pods:

* CRI-O: version 1.25 (and later) supports user namespaces for containers.

containerd v1.7 is not compatible with the userns support in Kubernetes v1.27 to v{{< skew latestVersion >}}.
Kubernetes v1.25 and v1.26 used an earlier implementation that **is** compatible with containerd v1.7,
in terms of userns support.
If you are using a version of Kubernetes other than {{< skew currentVersion >}},
check the documentation for that version of Kubernetes for the most relevant information.
If there is a newer release of containerd than v1.7 available for use, also check the containerd
documentation for compatibility information.

You can see the status of user namespaces support in cri-dockerd tracked in an [issue][CRI-dockerd-issue]
on GitHub.

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74

## Introduction

User namespaces is a Linux feature that allows to map users in the container to
different users in the host. Furthermore, the capabilities granted to a pod in
a user namespace are valid only in the namespace and void outside of it.

A pod can opt-in to use user namespaces by setting the `pod.spec.hostUsers` field
to `false`.

The kubelet will pick host UIDs/GIDs a pod is mapped to, and will do so in a way
to guarantee that no two pods on the same node use the same mapping.

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

## Understanding user namespaces for pods {#pods-and-userns}

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
check which user the container process is running by executing `ps aux` from
the host. The user `ps` shows is not the same as the user you see if you
execute inside the container the command `id`.

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

By default, the kubelet assigns pods UIDs/GIDs above the range 0-65535, based on
the assumption that the host's files and processes use UIDs/GIDs within this
range, which is standard for most Linux distributions. This approach prevents
any overlap between the UIDs/GIDs of the host and those of the pods.

Avoiding the overlap is important to mitigate the impact of vulnerabilities such
as [CVE-2021-25741][CVE-2021-25741], where a pod can potentially read arbitrary
files in the host. If the UIDs/GIDs of the pod and the host don't overlap, it is
limited what a pod would be able to do: the pod UID/GID won't match the host's
file owner/group.

The kubelet can use a custom range for user IDs and group IDs for pods. To
configure a custom range, the node needs to have:

 * A user `kubelet` in the system (you cannot use any other username here)
 * The binary `getsubids` installed (part of [shadow-utils][shadow-utils]) and
   in the `PATH` for the kubelet binary.
 * A configuration of subordinate UIDs/GIDs for the `kubelet` user (see
   [`man 5 subuid`](https://man7.org/linux/man-pages/man5/subuid.5.html) and
   [`man 5 subgid`](https://man7.org/linux/man-pages/man5/subgid.5.html)).

This setting only gathers the UID/GID range configuration and does not change
the user executing the `kubelet`.

You must follow some constraints for the subordinate ID range that you assign
to the `kubelet` user:

* The subordinate user ID, that starts the UID range for Pods, **must** be a
  multiple of 65536 and must also be greater than or equal to 65536. In other
  words, you cannot use any ID from the range 0-65535 for Pods; the kubelet
  imposes this restriction to make it difficult to create an accidentally insecure
  configuration.

* The subordinate ID count must be a multiple of 65536

* The subordinate ID count must be at least `65536 x <maxPods>` where `<maxPods>`
  is the maximum number of pods that can run on the node.

* You must assign the same range for both user IDs and for group IDs, It doesn't
  matter if other users have user ID ranges that don't align with the group ID
  ranges.

* None of the assigned ranges should overlap with any other assignment.

* The subordinate configuration must be only one line. In other words, you can't
  have multiple ranges.

For example, you could define `/etc/subuid` and `/etc/subgid` to both have
these entries for the `kubelet` user:

```
# The format is
#   name:firstID:count of IDs
# where
# - firstID is 65536 (the minimum value possible)
# - count of IDs is 110 (default limit for number of) * 65536
kubelet:65536:7208960
```

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980
[shadow-utils]: https://github.com/shadow-maint/shadow

## Integration with Pod security admission checks

{{< feature-state state="alpha" for_k8s_version="v1.29" >}}

For Linux Pods that enable user namespaces, Kubernetes relaxes the application of
[Pod Security Standards](/docs/concepts/security/pod-security-standards) in a controlled way.
This behavior can be controlled by the [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/)
`UserNamespacesPodSecurityStandards`, which allows an early opt-in for end
users. Admins have to ensure that user namespaces are enabled by all nodes
within the cluster if using the feature gate.

If you enable the associated feature gate and create a Pod that uses user
namespaces, the following fields won't be constrained even in contexts that enforce the
_Baseline_ or _Restricted_ pod security standard. This behavior does not
present a security concern because `root` inside a Pod with user namespaces
actually refers to the user inside the container, that is never mapped to a
privileged user on the host. Here's the list of fields that are **not** checks for Pods in those
circumstances:

- `spec.securityContext.runAsNonRoot`
- `spec.containers[*].securityContext.runAsNonRoot`
- `spec.initContainers[*].securityContext.runAsNonRoot`
- `spec.ephemeralContainers[*].securityContext.runAsNonRoot`
- `spec.securityContext.runAsUser`
- `spec.containers[*].securityContext.runAsUser`
- `spec.initContainers[*].securityContext.runAsUser`
- `spec.ephemeralContainers[*].securityContext.runAsUser`

## Limitations

When using a user namespace for the pod, it is disallowed to use other host
namespaces. In particular, if you set `hostUsers: false` then you are not
allowed to set any of:

 * `hostNetwork: true`
 * `hostIPC: true`
 * `hostPID: true`

## {{% heading "whatsnext" %}}

* Take a look at [Use a User Namespace With a Pod](/docs/tasks/configure-pod-container/user-namespaces/)
