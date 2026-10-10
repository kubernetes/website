---
title: Using sysctls in a Kubernetes Cluster
reviewers:
- sttts
content_type: task
weight: 400
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

This document describes how to configure and use kernel parameters within a
Kubernetes cluster using the {{< glossary_tooltip term_id="sysctl" >}}
interface.

{{< note >}}
Starting from Kubernetes version 1.23, the kubelet supports the use of either `/` or `.`
as separators for sysctl names.
Starting from Kubernetes version 1.25, setting Sysctls for a Pod supports setting sysctls with slashes.
For example, you can represent the same sysctl name as `kernel.shm_rmid_forced` using a
period as the separator, or as `kernel/shm_rmid_forced` using a slash as a separator.
For more sysctl parameter conversion method details, please refer to
the page [sysctl.d(5)](https://man7.org/linux/man-pages/man5/sysctl.d.5.html) from
the Linux man-pages project.
{{< /note >}}
## {{% heading "prerequisites" %}}

{{< note >}}
`sysctl` is a Linux-specific command-line tool used to configure various kernel parameters
and it is not available on non-Linux operating systems.
{{< /note >}}

{{< include "task-tutorial-prereqs.md" >}}

For some steps, you also need to be able to reconfigure the command line
options for the kubelets running on your cluster.


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

## Safe and Unsafe Sysctls

Kubernetes classes sysctls as either _safe_ or _unsafe_. In addition to proper
namespacing, a _safe_ sysctl must be properly _isolated_ between pods on the
same node. This means that setting a _safe_ sysctl for one pod

- must not have any influence on any other pod on the node
- must not allow to harm the node's health
- must not allow to gain CPU or memory resources outside of the resource limits
  of a pod.

By far, most of the _namespaced_ sysctls are not necessarily considered _safe_.
The following sysctls are supported in the _safe_ set:

- `kernel.shm_rmid_forced`;
- `net.ipv4.ip_local_port_range`;
- `net.ipv4.tcp_syncookies`;
- `net.ipv4.ping_group_range` (since Kubernetes 1.18);
- `net.ipv4.ip_unprivileged_port_start` (since Kubernetes 1.22);
- `net.ipv4.ip_local_reserved_ports` (since Kubernetes 1.27, needs kernel 3.16+);
- `net.ipv4.tcp_keepalive_time` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_fin_timeout` (since Kubernetes 1.29, needs kernel 4.6+);
- `net.ipv4.tcp_keepalive_intvl` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_keepalive_probes` (since Kubernetes 1.29, needs kernel 4.5+).
- `net.ipv4.tcp_rmem` (since Kubernetes 1.32, needs kernel 4.15+).
- `net.ipv4.tcp_wmem` (since Kubernetes 1.32, needs kernel 4.15+).
- `net.ipv4.tcp_slow_start_after_idle` (since Kubernetes 1.37, needs kernel 4.15+).
- `net.ipv4.tcp_notsent_lowat` (since Kubernetes 1.37, needs kernel 4.6+).

{{< note >}}
There are some exceptions to the set of safe sysctls:

- The `net.*` sysctls are not allowed with host networking enabled.
- The `net.ipv4.tcp_syncookies` sysctl is not namespaced on Linux kernel version 4.5 or lower.
{{< /note >}}

This list will be extended in future Kubernetes versions when the kubelet
supports better isolation mechanisms.

### Enabling Unsafe Sysctls

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
- Those `net.*` that can be set in container networking namespace. However,
  there are exceptions (e.g., `net.netfilter.nf_conntrack_max` and
  `net.netfilter.nf_conntrack_expect_max` can be set in container networking
  namespace but are unnamespaced before Linux 5.12.2).

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

## Setting Sysctls for All Pods

{{< feature-state feature_gate_name="DefaultPodSysctls" >}}

You can configure a default set of kernel parameters (sysctls) that the `kubelet`
applies to all Pods running on a Linux Node, including {{< glossary_tooltip text="static Pods" term_id="static-pod" >}}.
This is useful when Node administrators need to enforce consistent kernel parameter
tuning across all workloads on a Node or within a Node group (for example,
adjusting TCP buffer sizes for high-performance networking) without requiring
every Pod specification to individually set `securityContext.sysctls`.

To use this feature, enable the `DefaultPodSysctls`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for the `kubelet` and specify key-value pairs in the `defaultPodSysctls` field
of your
[KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).

The `defaultPodSysctls` field supports all namespaced sysctls (`kernel.shm*`,
`kernel.msg*`, `kernel.sem`, `kernel.domainname`, `fs.mqueue.*`, `net.*`, and
`user.*`), covering both _safe_ and _unsafe_ sysctls. Because these defaults
are configured directly by the Node administrator on the `kubelet`, you do not
need to allow-list unsafe sysctls in `allowedUnsafeSysctls`.

The following example configures the `kubelet` to apply default sysctls across
multiple namespaced subsystems (networking, IPC, and user namespaces) to all
Pods on the Node:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  DefaultPodSysctls: true
defaultPodSysctls:
  # Network namespace sysctls (skipped if Pod uses hostNetwork: true)
  net.ipv4.ip_forward: "1"
  net.ipv4.tcp_rmem: "4096 87380 16777216"
  net.ipv4.tcp_wmem: "4096 65536 16777216"
  net.core.somaxconn: "1024"
  # IPC namespace sysctls (skipped if Pod uses hostIPC: true)
  kernel.shmall: "1048576"
  kernel.msgmax: "65536"
  kernel.sem: "250 32000 32 128"
  fs.mqueue.msg_max: "1024"
  # User namespace sysctls (skipped if Pod shares the host user namespace)
  user.max_user_namespaces: "1000"
```

### Precedence and Overriding

Values explicitly set in a Pod's `spec.securityContext.sysctls` always override
the matching default values specified in the `kubelet`'s `defaultPodSysctls`. Overrides
are applied individually on a per-key basis: if a Pod specifies a value for a sysctl
that is also defined in `defaultPodSysctls`, the Pod-level setting takes precedence
for that specific sysctl, while other defaults continue to apply. Note that there are
no groups of connected sysctl settings; if your workload overrides a sysctl that is part
of a related group (for example, networking buffer sizes), the Pod specification must
account for all related settings as needed.

### Host Namespaces and Filtering

The `kubelet` applies default sysctls during Pod sandbox creation only if the Pod
runs in a separate namespace for the corresponding subsystem. If a Pod shares a
host namespace, default sysctls for that namespace are skipped for that Pod:

- `net.*` sysctls are skipped if the Pod uses host networking (`hostNetwork: true`).
- IPC sysctls (`kernel.sem`, `kernel.msg*`, `kernel.shm*`, `fs.mqueue.*`) are
  skipped if the Pod uses host IPC (`hostIPC: true`).
- `user.*` sysctls are skipped if the Pod shares the host user namespace
  (`hostUsers: true` or unset).
- UTS sysctls (`kernel.domainname`) are skipped if the Pod uses host networking
  (`hostNetwork: true`).

### Validation and Limitations

The `kubelet` validates `defaultPodSysctls` during startup. Non-namespaced
sysctls, invalid sysctl names, or duplicate keys will prevent the `kubelet` from
starting.

In addition, certain `net.*` sysctls might be unnamespaced depending on your
kernel version. Specifying an unnamespaced `net.*` sysctl in `defaultPodSysctls`
will cause Pod sandbox creation to fail with a `FailedCreatePodSandBox` error.
The Pod will keep retrying to create a sandbox forever. Ensure that all
specified sysctls are namespaced on your Node's kernel.

Changes to `defaultPodSysctls` apply only to newly created Pods. The `kubelet`
does not dynamically reconfigure existing Pods (see [What Happens After a Node Restart](/docs/reference/node/what-happens-on-restart/#impact-of-a-kubelet-restart)).
Existing Pods continue to run with the sysctls applied when their sandbox was created.
If you want existing Pods to adopt the updated default sysctls, you must recreate those
Pods (for example, by cordoning and draining the Node).
