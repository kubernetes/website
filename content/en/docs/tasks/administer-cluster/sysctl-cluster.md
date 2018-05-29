---
title: Using Sysctls in a Kubernetes Cluster
reviewers:
- sttts
content_template: templates/task
---

{{% capture overview %}}
{{< feature-state for_k8s_version="v1.11" state="beta" >}}

This document describes how sysctls are used within a Kubernetes cluster.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

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

{{< note >}}
**Note**: The example `net.ipv4.tcp_syncookies` is not namespaced on Linux kernel version 4.4 or lower.
{{< /note >}}

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
$ kubelet --allowed-unsafe-sysctls \
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

The sysctls are set through pod security context on pods.
They apply to all containers in the same pod.

Here is an example of setting a safe sysctl `kernel.shm_rmid_forced` and two
unsafe sysctls `net.ipv4.route.min_pmtu` and `kernel.msgmax` (notice there is no
distinction between _safe_ and _unsafe_ sysctls on the spec level):

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
spec:
  securityContext:
    sysctls:
    - name: kernel.shm_rmid_forced
      value: "1"
    - name: net.ipv4.route.min_pmtu
      value: "1000"
    - name: kernel.msgmax
      value: "1 2 3"
  ...
```
{{% /capture %}}

{{% capture discussion %}}

{{< warning >}}
**Warning**: Due to their nature of being _unsafe_, the use of _unsafe_ sysctls
is at-your-own-risk and can lead to severe problems like wrong behavior of
containers, resource shortage or complete breakage of a node.
{{< /warning >}}

It is good practice to consider nodes with special sysctl settings as
_tainted_ within a cluster, and only schedule pods onto them which need those
sysctl settings. It is suggested to use the Kubernetes [_taints and toleration_
feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) to implement this.

A pod with the _unsafe_ sysctls will fail to launch on any node which has not
enabled those two _unsafe_ sysctls explicitly. As with _node-level_ sysctls it
is recommended to use
[_taints and toleration_ feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) or
[taints on nodes](/docs/concepts/configuration/taint-and-toleration/)
to schedule those pods onto the right nodes.

## PodSecurityPolicy

The use of sysctl in pods can be controlled through `forbiddenSysctls` and
`allowedUnsafeSysctls` fields in the PodSecurityPolicy.

By default, all safe sysctls in the whitelist are allowed.

Both `forbiddenSysctls` and `allowedUnsafeSysctls` are lists of plain sysctl names
or sysctl patterns (which end with `*`). The string `*` matches all sysctls.

The `forbiddenSysctls` field excludes sysctls from both safe and unsafe set (`*` means
no sysctl allowed).
Any unsafe sysctl specified in the `allowedUnsafeSysctls` field (and not in the `forbiddenSysctls`)
is allowed by admission via the PodSecurityPolicy.
The string `*` means all unsafe sysctls allowed which effectively translates into
all unsafe sysctls allowed on the Kubelet side.
Both `forbiddenSysctls` and `allowedUnsafeSysctls` must not overlap.

{{< note >}}
**Note**: Even though the `allowedUnsafeSysctls` field allows certain unsafe sysctls,
if they are not allowed on the kubelet side (by setting the `--allowed-unsafe-sysctls` flag),
the pod fails to start.
{{< /note >}}

Here is an example, it authorizes binding user creating pod with unsafe
`kernel.msg`-prefixed sysctls and disallowing the `kernel.shm_rmid_forced` sysctl.

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: sysctl-psp
spec:
  allowedUnsafeSysctls:
  - kernel.msg*
  forbiddenSysctls:
  - kernel.shm_rmid_forced
 ...
```

{{% /capture %}}
