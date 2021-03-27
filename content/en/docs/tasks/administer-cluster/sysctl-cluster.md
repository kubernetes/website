---
title: Using sysctls in a Kubernetes Cluster
reviewers:
- sttts
content_type: task
---

<!-- overview -->

This document describes how to configure and use kernel parameters within a
Kubernetes cluster using the {{< glossary_tooltip term_id="sysctl" >}}
interface.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

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
sudo sysctl -a
```

## Enabling Unsafe Sysctls

Sysctls are grouped into _safe_ and _unsafe_ sysctls. In addition to proper
namespacing, a _safe_ sysctl must be properly _isolated_ between pods on the
same node. This means that setting a _safe_ sysctl for one pod

- must not have any influence on any other pod on the node
- must not allow to harm the node's health
- must not allow to gain CPU or memory resources outside of the resource limits
  of a pod.

By far, most of the _namespaced_ sysctls are not necessarily considered _safe_.
The following sysctls are supported in the _safe_ set:

- `kernel.shm_rmid_forced`,
- `net.ipv4.ip_local_port_range`,
- `net.ipv4.tcp_syncookies`,
- `net.ipv4.ping_group_range` (since Kubernetes 1.18).

{{< note >}}
The example `net.ipv4.tcp_syncookies` is not namespaced on Linux kernel version 4.4 or lower.
{{< /note >}}

This list will be extended in future Kubernetes versions when the kubelet
supports better isolation mechanisms.

All _safe_ sysctls are enabled by default.

All _unsafe_ sysctls are disabled by default and must be allowed manually by the
cluster admin on a per-node basis. Pods with disabled unsafe sysctls will be
scheduled, but will fail to launch.

With the warning above in mind, the cluster admin can allow certain _unsafe_
sysctls for very special situations such as high-performance or real-time
application tuning. _Unsafe_ sysctls are enabled on a node-by-node basis with a
flag of the kubelet; for example:

```shell
kubelet --allowed-unsafe-sysctls \
  'kernel.msg*,net.core.somaxconn' ...
```

For {{< glossary_tooltip term_id="minikube" >}}, this can be done via the `extra-config` flag:

```shell
minikube start --extra-config="kubelet.allowed-unsafe-sysctls=kernel.msg*,net.core.somaxconn"...
```

Only _namespaced_ sysctls can be enabled this way.

## Setting Sysctls for a Pod

A number of sysctls are _namespaced_ in today's Linux kernels. This means that
they can be set independently for each pod on a node. Only namespaced sysctls
are configurable via the pod securityContext within Kubernetes.

The following sysctls are known to be namespaced. This list could change
in future versions of the Linux kernel.

- `kernel.shm*`,
- `kernel.msg*`,
- `kernel.sem`,
- `fs.mqueue.*`,
- The parameters under `net.*` that can be set in container networking
  namespace. However, there are exceptions (e.g.,
  `net.netfilter.nf_conntrack_max` and `net.netfilter.nf_conntrack_expect_max`
  can be set in container networking namespace but they are unnamespaced).

Sysctls with no namespace are called _node-level_ sysctls. If you need to set
them, you must manually configure them on each node's operating system, or by
using a DaemonSet with privileged containers.

Use the pod securityContext to configure namespaced sysctls. The securityContext
applies to all containers in the same pod.

This example uses the pod securityContext to set a safe sysctl
`kernel.shm_rmid_forced` and two unsafe sysctls `net.core.somaxconn` and
`kernel.msgmax`. There is no distinction between _safe_ and _unsafe_ sysctls in
the specification.

{{< warning >}}
Only modify sysctl parameters after you understand their effects, to avoid
destabilizing your operating system.
{{< /warning >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
spec:
  securityContext:
    sysctls:
    - name: kernel.shm_rmid_forced
      value: "0"
    - name: net.core.somaxconn
      value: "1024"
    - name: kernel.msgmax
      value: "65536"
  ...
```


<!-- discussion -->

{{< warning >}}
Due to their nature of being _unsafe_, the use of _unsafe_ sysctls
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
[taints on nodes](/docs/concepts/scheduling-eviction/taint-and-toleration/)
to schedule those pods onto the right nodes.

## PodSecurityPolicy

You can further control which sysctls can be set in pods by specifying lists of
sysctls or sysctl patterns in the `forbiddenSysctls` and/or
`allowedUnsafeSysctls` fields of the PodSecurityPolicy. A sysctl pattern ends
with a `*` character, such as `kernel.*`. A `*` character on its own matches
all sysctls.

By default, all safe sysctls are allowed.

Both `forbiddenSysctls` and `allowedUnsafeSysctls` are lists of plain sysctl names
or sysctl patterns (which end with `*`). The string `*` matches all sysctls.

The `forbiddenSysctls` field excludes specific sysctls. You can forbid a
combination of safe and unsafe sysctls in the list. To forbid setting any
sysctls, use `*` on its own.

If you specify any unsafe sysctl in the `allowedUnsafeSysctls` field and it is
not present in the `forbiddenSysctls` field, that sysctl can be used in Pods
using this PodSecurityPolicy. To allow all unsafe sysctls in the
PodSecurityPolicy to be set, use `*` on its own.

Do not configure these two fields such that there is overlap, meaning that a
given sysctl is both allowed and forbidden.

{{< warning >}}
If you allow unsafe sysctls via the `allowedUnsafeSysctls` field
in a PodSecurityPolicy, any pod using such a sysctl will fail to start
if the sysctl is not allowed via the `--allowed-unsafe-sysctls` kubelet
flag as well on that node.
{{< /warning >}}

This example allows unsafe sysctls prefixed with `kernel.msg` to be set and
disallows setting of the `kernel.shm_rmid_forced` sysctl.

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


