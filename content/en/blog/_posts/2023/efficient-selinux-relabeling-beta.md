---
layout: blog
title: "Kubernetes 1.27: Efficient SELinux volume relabeling (Beta)"
date: 2023-04-18T10:00:00-08:00
slug: kubernetes-1-27-efficient-selinux-relabeling-beta
author: >
   Jan Šafránek (Red Hat)
---

## The problem

On Linux with Security-Enhanced Linux (SELinux) enabled, it's traditionally
the container runtime that applies SELinux labels to a Pod and all its volumes.
Kubernetes only passes the SELinux label from a Pod's `securityContext` fields
to the container runtime.

The container runtime then recursively changes SELinux label on all files that
are visible to the Pod's containers. This can be time-consuming if there are
many files on the volume, especially when the volume is on a remote filesystem.

{{% alert title="Note" color="info" %}}
If a container uses `subPath` of a volume, only that `subPath` of the whole
volume is relabeled. This allows two pods that have two different SELinux labels
to use the same volume, as long as they use different subpaths of it.
{{% /alert %}}

If a Pod does not have any SELinux label assigned in Kubernetes API, the
container runtime assigns a unique random one, so a process that potentially
escapes the container boundary cannot access data of any other container on the
host. The container runtime still recursively relabels all pod volumes with this
random SELinux label.

## Improvement using mount options

If a Pod and its volume meet **all** of the following conditions, Kubernetes will
_mount_ the volume directly with the right SELinux label. Such mount will happen
in a constant time and the container runtime will not need to recursively
relabel any files on it.

1. The operating system must support SELinux.

   Without SELinux support detected, kubelet and the container runtime do not
   do anything with regard to SELinux.

1. The [feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
   `ReadWriteOncePod` and `SELinuxMountReadWriteOncePod` must be enabled.
   These feature gates are Beta in Kubernetes 1.27 and Alpha in 1.25.

   With any of these feature gates disabled, SELinux labels will be always
   applied by the container runtime by a recursive walk through the volume
   (or its subPaths).

1. The Pod must have at least `seLinuxOptions.level` assigned in its
   [Pod Security Context](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
   or all Pod containers must have it set in their [Security Contexts](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1).
   Kubernetes will read the default `user`, `role` and `type` from the operating
   system defaults (typically `system_u`, `system_r` and `container_t`).

   Without Kubernetes knowing at least the SELinux `level`, the container
   runtime will assign a random one _after_ the volumes are mounted. The
   container runtime will still relabel the volumes recursively in that case.

1. The volume must be a Persistent Volume with
   [Access Mode](/docs/concepts/storage/persistent-volumes/#access-modes)
   `ReadWriteOncePod`.

   This is a limitation of the initial implementation. As described above,
   two Pods can have a different SELinux label and still use the same volume,
   as long as they use a different `subPath` of it. This use case is not
   possible when the volumes are _mounted_ with the SELinux label, because the
   whole volume is mounted and most filesystems don't support mounting a single
   volume multiple times with multiple SELinux labels.

   If running two Pods with two different SELinux contexts and using
   different `subPaths` of the same volume is necessary in your deployments,
   please comment in the [KEP](https://github.com/kubernetes/enhancements/issues/1710)
   issue (or upvote any existing comment - it's best not to duplicate).
   Such pods may not run when the feature is extended to cover all volume access modes.

1. The volume plugin or the CSI driver responsible for the volume supports
   mounting with SELinux mount options.

   These in-tree volume plugins support mounting with SELinux mount options:
   `fc`, `iscsi`, and `rbd`.

   CSI drivers that support mounting with SELinux mount options must announce
   that in their
   [CSIDriver](/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/)
   instance by setting `seLinuxMount` field.

   Volumes managed by other volume plugins or CSI drivers that don't
   set `seLinuxMount: true` will be recursively relabelled by the container
   runtime.

### Mounting with SELinux context

When all aforementioned conditions are met, kubelet will
pass `-o context=<SELinux label>` mount option to the volume plugin or CSI
driver. CSI driver vendors must ensure that this mount option is supported
by their CSI driver and, if necessary, the CSI driver appends other mount
options that are needed for `-o context` to work.

For example, NFS may need `-o context=<SELinux label>,nosharecache`, so each
volume mounted from the same NFS server can have a different SELinux label
value. Similarly, CIFS may need `-o context=<SELinux label>,nosharesock`.

It's up to the CSI driver vendor to test their CSI driver in a SELinux enabled
environment before setting `seLinuxMount: true` in the CSIDriver instance.

## How can I learn more?

SELinux in containers: see excellent
[visual SELinux guide](https://opensource.com/business/13/11/selinux-policy-guide)
by Daniel J Walsh. Note that the guide is older than Kubernetes, it describes
*Multi-Category Security* (MCS) mode using virtual machines as an example,
however, a similar concept is used for containers.

See a series of blog posts for details how exactly SELinux is applied to
containers by container runtimes:

* [How SELinux separates containers using Multi-Level Security](https://www.redhat.com/en/blog/how-selinux-separates-containers-using-multi-level-security)
* [Why you should be using Multi-Category Security for your Linux containers](https://www.redhat.com/en/blog/why-you-should-be-using-multi-category-security-your-linux-containers)

Read the KEP: [Speed up SELinux volume relabeling using mounts](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling)
