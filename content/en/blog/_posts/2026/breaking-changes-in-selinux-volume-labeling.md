---
layout: blog
title: "SELinux Volume Label Changes goes GA (and likely implications in v1.37)"
date: 2026-04-22T10:35:00-08:00
slug: breaking-changes-in-selinux-volume-labeling
author: >
  [Jan Šafránek](https://github.com/jsafrane) (Red Hat)
  [Swathi Rao](https://github.com/SwathiR03) (Independent)
---

If you run Kubernetes on Linux with SELinux in enforcing mode, plan ahead: a future release (anticipated to be v1.37) is
expected to turn the `SELinuxMount` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) on by default. This makes volume setup faster
for most workloads, but **it can break applications** that still depend on the older recursive relabeling
model in subtle ways (for example, sharing one volume between privileged and unprivileged Pods on the same node).
Kubernetes v1.36 is the right release to audit your cluster and fix or opt out of this change.

If your nodes do not use SELinux, nothing changes for you: the kubelet skips the whole
SELinux logic when SELinux is unavailable or disabled in the Linux kernel. You can skip this article completely.

This blog builds on the earlier work described in the
[Kubernetes 1.27: Efficient SELinux Relabeling (Beta)](https://kubernetes.io/blog/2023/04/18/kubernetes-1-27-efficient-selinux-relabeling-beta/)
post, where the `SELinuxMountReadWriteOncePod` feature gate was described. The problem to be addressed remains
the same, however, this blog extends that same approach to all volumes.

## The problem
Linux systems with Security Enhanced Linux (SELinux) enabled use labels attached to objects
(for example, files and network sockets) to make access control decisions.
Historically, the container runtime applies SELinux labels to a Pod and all its volumes. Kubernetes only passes the SELinux label from a Pod's `securityContext` fields
to the container runtime.

The container runtime then recursively changes the SELinux label on all files that
are visible to the Pod's containers. This can be time-consuming if there are
many files on the volume, especially when the volume is on a remote filesystem.

{{< caution >}}
If a container uses `subPath` of a volume, only that `subPath` of the whole
volume is relabeled. This allows two Pods that have two different SELinux labels
to use the same volume, as long as they use different subpaths of it.
{{< /caution >}}

If a Pod does not have any SELinux label assigned in the Kubernetes API, the
container runtime assigns a unique random label, so a process that potentially
escapes the container boundary cannot access data of any other container on the
host. The container runtime still recursively relabels all Pod volumes with this
random SELinux label.

## What Kubernetes is improving

Where the stack supports it, the kubelet can mount the volume with `-o context=<label>` so the kernel
applies the correct label for all inodes on that mount without a recursive inode traversal. That path is
gated by feature flags and requires, among other things, that the Pod expose enough of an SELinux
label (for example `spec.securityContext.seLinuxOptions.level`) and that the volume driver opts in (for CSI,
CSIDriver field `spec.seLinuxMount: true`).

The project rolled this out in phases:

- ReadWriteOncePod volumes were handled under the `SELinuxMountReadWriteOncePod` feature gate, on by default since v1.28 and GA in v1.36.
- Broader coverage was handled under the `SELinuxMount` flag, paired with the `spec.securityContext.seLinuxChangePolicy` field on Pods.

<!-- a heavily edited copy from the previous blog + docs in https://kubernetes.io/docs/tasks/configure-pod-container/security-context/ -->

If a Pod and its volume meet **all** of the following conditions, Kubernetes will
mount the volume directly with the right SELinux label. Such a mount will happen
in a constant time and the container runtime will not need to recursively
relabel any files on it. For such a mount to happen: 

1. The operating system must support SELinux. Without SELinux support detected, the kubelet and the container runtime do not
   do anything with regard to SELinux.

1. The [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
   `SELinuxMountReadWriteOncePod` must be enabled.
   If you're running Kubernetes v1.36, the feature is enabled unconditionally.

1. The Pod must use a PersistentVolumeClaim with applicable `accessModes`:
   * Either the volume has `accessModes: ["ReadWriteOncePod"]`
   * or the volume can use any other access mode(s), provided that the feature gates
     `SELinuxChangePolicy` and `SELinuxMount` are both enabled
     **and** the Pod has `spec.securityContext.seLinuxChangePolicy` set to nil (default) or as `MountOption`.

   The feature gate `SELinuxMount` is Beta and disabled by default in Kubernetes 1.36. 
   All other SELinux-related feature gates are now General Availability (GA).

   With any of these feature gates disabled, SELinux labels will always be
   applied by the container runtime via recursively traversing through the volume
   (or its subPaths).

1. The Pod must have at least `seLinuxOptions.level` assigned in its
   [security context](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
   or all containers in that Pod must have it set in their container-level [security contexts](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1).
   Kubernetes will read the default `user`, `role` and `type` from the operating
   system defaults (typically `system_u`, `system_r` and `container_t`).

   Without Kubernetes knowing at least the SELinux `level`, the container
   runtime will assign a random level after the volumes are mounted. The
   container runtime will still relabel the volumes recursively in that case.

1. The volume plugin or the CSI driver responsible for the volume supports
   mounting with SELinux mount options.

   These in-tree volume plugins support mounting with SELinux mount options:
   `fc` and `iscsi`.

   CSI drivers that support mounting with SELinux mount options must declare this capability in their
   [CSIDriver](/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/)
   instance by setting the `seLinuxMount` field.

   Volumes managed by other volume plugins or CSI drivers that do not
   set `seLinuxMount: true` will be recursively relabeled by the container
   runtime.

## The breaking change

The `SELinuxMount` feature gate changes what volumes can be shared among multiple Pods in a subtle way.

Both of these cases work with recursive relabeling:

1. Two Pods with different SELinux labels share the same volume, but each of them uses a different `subPath` to the volume.
1. A privileged Pod and an unprivileged Pod share the same volume.

The above scenarios will not work with modern, target behavior for Kubernetes mounting when SELinux is active. Instead, one of these Pods will be stuck in `ContainerCreating` until the other Pod is terminated.

The first case is very niche and hasn't been seen in practice.
Although the second case is still quite rare, this setup has been observed in applications.
Kubernetes v1.36 offers metrics and events to identify these Pods and allows cluster administrators to opt out of the
mount option through the Pod field `spec.securityContext.seLinuxChangePolicy`.

### `seLinuxChangePolicy`

The new Pod field `spec.securityContext.seLinuxChangePolicy` specifies how the SELinux label is applied to all Pod volumes.
In Kubernetes v1.36, this field is part of the stable Pod API.

There are three choices available:

_field not set_ (default)
: In Kubernetes v1.36, the behavior depends on whether the `SELinuxMount` feature gate is enabled. By default that feature gate is not enabled, and the SELinux label is applied recursively. If you enable that feature gate in your cluster, and [all other conditions](#what-kubernetes-is-improving) are met, labelling will be applied using the mount option.

`Recursive`
: the SELinux label is applied recursively. This opts out from using the mount option.

`MountOption`
: the SELinux label is applied using the mount option, if [all other conditions](#what-kubernetes-is-improving) are met. 
  This choice is available only when the `SELinuxMount` feature gate is enabled.

## SELinux warning controller (optional) {#selinux-warning-controller}

Kubernetes v1.36 provides a new controller within the control plane, `selinux-warning-controller`.
This controller runs within the kube-controller-manager controller.
To use it, you pass `--controllers=*,selinux-warning-controller` on the kube-controller-manager command line;
you also must not have explicitly overridden the `SELinuxChangePolicy` feature gate to be disabled.

The controller watches all Pods in the cluster and emits an Event when it finds two Pods that share the same
volume in a way that is not compatible with the `SELinuxMount` feature gate.
All such conflicting Pods will receive an event, such as:
```console
SELinuxLabel "system_u:system_r:container_t:s0:c98,c99" conflicts with pod my-other-pod that uses the same volume as this pod with SELinuxLabel "system_u:system_r:container_t:s0:c0,c1". If both pods land on the same node, only one of them may access the volume.
```
The actual Pod name may be censored when the conflicting Pods run in different namespaces to prevent leaking information across namespace boundaries.

The controller reports such an event even when these Pods don't run on the same node, to make sure all Pods work
regardless of the Kubernetes scheduler decision. They could run on the same node next time.

In addition, the controller emits the metric `selinux_warning_controller_selinux_volume_conflict` that lists all current conflicts among Pods.
The metric has labels that identify the conflicting Pods and their SELinux labels, such as:
```
selinux_warning_controller_selinux_volume_conflict{pod1_name="my-other-pod",pod1_namespace="default",pod1_value="system_u:object_r:container_file_t:s0:c0,c1",pod2_name="my-pod",pod2_namespace="default",pod2_value="system_u:object_r:container_file_t:s0:c0,c2",property="SELinuxLabel"} 1
```

There is a security consequence from enabling this opt-in controller: it may reveal namespace names, which are always present in the metric.
The Kubernetes project assumes only cluster administrators can access kube-controller-manager metrics.

## Suggested upgrade path

To ensure a smooth upgrade path from v1.36 to a release with `SELinuxMount` enabled (anticipated to be v1.37), we suggest you follow these steps:

1. Enable selinux-warning-controller in the kube-controller-manager.
1. Check the `selinux_warning_controller_selinux_volume_conflict` metric. It shows all *potential* conflicts between Pods.
   For each conflicting Pod (Deployment, StatefulSet, etc.), either apply the opt-out (set Pod's `spec.securityContext.seLinuxChangePolicy: Recursive`)
   or re-architect the application to remove such a conflict. For example, do your Pods really need to run as privileged?
1. Check the `volume_manager_selinux_volume_context_mismatch_warnings_total` metric. This metric is emitted by the kubelet when it actually
   starts a Pod that runs when `SELinuxMount` is disabled, but such a Pod won't start when `SELinuxMount` is enabled.
   This metric lists the number of Pods that will experience a true conflict. Unfortunately, this metric does not expose the exact Pod name as a label.
   The full Pod name is available only in the `selinux_warning_controller_selinux_volume_conflict` metric.
1. Once both metrics have been accounted for, upgrade to a Kubernetes version that has `SELinuxMount` enabled.

Consider using a [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/),
a [mutating webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks_),
or a policy engine like [Kyverno](https://github.com/kyverno/kyverno/) or [Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
to apply the opt-out to all Pods in a namespace or across the entire cluster.

When `SELinuxMount` is enabled, the kubelet will emit the metric `volume_manager_selinux_volume_context_mismatch_errors_total` with the number of
Pods that could not start because their SELinux label conflicts with an existing Pod that uses the same volume.
The exact Pod names should still be available in the `selinux_warning_controller_selinux_volume_conflict` metric,
if the selinux-warning-controller is enabled.

## Further reading

- KEP: [Speed up SELinux volume relabeling using mounts](https://kep.k8s.io/1710)
- [SELinux Volume Relabeling Feature Gates](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#feature-gates)
- [Story 3: cluster upgrade](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling#story-3-cluster-upgrade)
- [Configure a security context for a Pod](/docs/tasks/configure-pod-container/security-context/) — Efficient SELinux volume relabeling and selinux-warning-controller

## Acknowledgements

If you run into issues, have feedback, or want to contribute, find us
on the Kubernetes Slack in `#sig-node` and `#sig-storage` or join a
[SIG Node](https://github.com/kubernetes/community/tree/main/sig-node) or [SIG Storage](https://github.com/kubernetes/community/tree/main/sig-storage) meetings.