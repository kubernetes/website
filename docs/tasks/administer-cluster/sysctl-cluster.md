---
title: Using Sysctls in a Kubernetes Cluster
reviewers:
- sttts
---

{% capture overview %}

This document describes how sysctls are used within a Kubernetes cluster.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Listing all Sysctl Parameters

In Linux, the sysctl interface allows an administrator to modify kernel
parameters at runtime. Parameters are available via the `/proc/sys/` virtual
process file system. The parameters cover various subsystems such as:

- kernel (common prefix: `kernel.`)
- networking (common prefix: `net.`)
- virtual memory (common prefix: `vm.`)
- MDADM (common prefix: `dev.`)
- More subsystems are described in [Kernel docs](https://www.kernel.org/doc/Documentation/sysctl/README).

To get a list of all parameters, you can run

```shell
$ sudo sysctl -a
```

## Enabling Unsafe Sysctls

Sysctls are grouped into _safe_  and _unsafe_ sysctls. In addition to proper
namespacing a _safe_ sysctl must be properly _isolated_ between pods on the same
node. This means that setting a _safe_ sysctl for one pod

- must not have any influence on any other pod on the node
- must not allow to harm the node's health
- must not allow to gain CPU or memory resources outside of the resource limits
  of a pod.

By far, most of the _namespaced_ sysctls are not necessarily considered _safe_.
The following sysctls are supported in the _safe_ set:

- `kernel.shm_rmid_forced`,
- `net.ipv4.ip_local_port_range`,
- `net.ipv4.tcp_syncookies`.

**Note**: The example `net.ipv4.tcp_syncookies` is not namespaced on Linux kernel version 4.4 or lower.
{: .note}

This list will be extended in future Kubernetes versions when the kubelet
supports better isolation mechanisms.

All _safe_ sysctls are enabled by default.

All _unsafe_ sysctls are disabled by default and must be allowed manually by the
cluster admin on a per-node basis. Pods with disabled unsafe sysctls will be
scheduled, but will fail to launch.

With the warning above in mind, the cluster admin can allow certain _unsafe_
sysctls for very special situations like e.g. high-performance or real-time
application tuning. _Unsafe_ sysctls are enabled on a node-by-node basis with a
flag of the kubelet, e.g.:

```shell
$ kubelet --experimental-allowed-unsafe-sysctls \
  'kernel.msg*,net.ipv4.route.min_pmtu' ...
```

For minikube, this can be done via the `extra-config` flag:

```shell
$ minikube start --extra-config="kubelet.AllowedUnsafeSysctls=kernel.msg*,net.ipv4.route.min_pmtu"...
```

Only _namespaced_ sysctls can be enabled this way.

## Setting Sysctls for a Pod

A number of sysctls are _namespaced_ in today's Linux kernels. This means that
they can be set independently for each pod on a node. Being namespaced is a
requirement for sysctls to be accessible in a pod context within Kubernetes.

The following sysctls are known to be _namespaced_:

- `kernel.shm*`,
- `kernel.msg*`,
- `kernel.sem`,
- `fs.mqueue.*`,
- `net.*`.

Sysctls which are not namespaced are called _node-level_ and must be set
manually by the cluster admin, either by means of the underlying Linux
distribution of the nodes (e.g. via `/etc/sysctls.conf`) or using a DaemonSet
with privileged containers.

The sysctl feature is an alpha API. Therefore, sysctls are set using annotations
on pods. They apply to all containers in the same pod.

Here is an example, with different annotations for _safe_ and _unsafe_ sysctls:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
  annotations:
    security.alpha.kubernetes.io/sysctls: kernel.shm_rmid_forced=1
    security.alpha.kubernetes.io/unsafe-sysctls: net.ipv4.route.min_pmtu=1000,kernel.msgmax=1 2 3
spec:
  ...
```
{% endcapture %}

{% capture discussion %}

**Warning**: Due to their nature of being _unsafe_, the use of _unsafe_ sysctls
is at-your-own-risk and can lead to severe problems like wrong behavior of
containers, resource shortage or complete breakage of a node.
{: .warning}

It is good practice to consider nodes with special sysctl settings as
_tainted_ within a cluster, and only schedule pods onto them which need those
sysctl settings. It is suggested to use the Kubernetes [_taints and toleration_
feature](/docs/user-guide/kubectl/{{page.version}}/#taint) to implement this.

A pod with the _unsafe_ sysctls will fail to launch on any node which has not
enabled those two _unsafe_ sysctls explicitly. As with _node-level_ sysctls it
is recommended to use
[_taints and toleration_ feature](/docs/user-guide/kubectl/{{page.version}}/#taint) or
[taints on nodes](/docs/concepts/configuration/taint-and-toleration/)
to schedule those pods onto the right nodes.

## PodSecurityPolicy Annotations

The use of sysctl in pods can be controlled via annotation on the PodSecurityPolicy.

Sysctl annotation represents a whitelist of allowed safe and unsafe sysctls
in a pod spec. It's a comma-separated list of plain sysctl names or sysctl patterns
(which end in `*`). The string `*` matches all sysctls.

Here is an example, it authorizes binding user creating pod with corresponding sysctls.

```yaml
apiVersion: extensions/v1beta1
kind: PodSecurityPolicy
metadata:
  name: sysctl-psp
  annotations:
    security.alpha.kubernetes.io/sysctls: 'net.ipv4.route.*,kernel.msg*'
spec:
 ...
```

{% endcapture %}

{% include templates/task.md %}
