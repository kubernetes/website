---
layout: blog
title: "Kubernetes 1.28: Beta support for using swap on Linux"
date: 2023-08-24T10:00:00-08:00
slug: swap-linux-beta
author: >
 Itamar Holder (Red Hat)
---

The 1.22 release [introduced Alpha support](/blog/2021/08/09/run-nodes-with-swap-alpha/)
for configuring swap memory usage for Kubernetes workloads running on Linux on a per-node basis.
Now, in release 1.28, support for swap on Linux nodes has graduated to Beta, along with many
new improvements.

Prior to version 1.22, Kubernetes did not provide support for swap memory on Linux systems.
This was due to the inherent difficulty in guaranteeing and accounting for pod memory utilization
when swap memory was involved. As a result, swap support was deemed out of scope in the initial
design of Kubernetes, and the default behavior of a kubelet was to fail to start if swap memory
was detected on a node.

In version 1.22, the swap feature for Linux was initially introduced in its Alpha stage. This represented
a significant advancement, providing Linux users with the opportunity to experiment with the swap
feature for the first time. However, as an Alpha version, it was not fully developed and had
several issues, including inadequate support for cgroup v2, insufficient metrics and summary
API statistics, inadequate testing, and more.

Swap in Kubernetes has numerous [use cases](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md#user-stories)
for a wide range of users. As a result, the node special interest group within the Kubernetes project
has invested significant effort into supporting swap on Linux nodes for beta.
Compared to the alpha, the kubelet's support for running with swap enabled is more stable and
robust, more user-friendly, and addresses many known shortcomings. This graduation to beta
represents a crucial step towards achieving the goal of fully supporting swap in Kubernetes.

## How do I use it?

The utilization of swap memory on a node where it has already been provisioned can be
facilitated by the activation of the `NodeSwap` feature gate on the kubelet.
Additionally, you must disable the `failSwapOn` configuration setting, or the deprecated
`--fail-swap-on` command line flag must be deactivated.

It is possible to configure the `memorySwap.swapBehavior` option to define the manner in which a node utilizes swap memory. For instance,

```yaml
# this fragment goes into the kubelet's configuration file
memorySwap:
  swapBehavior: UnlimitedSwap
```

The available configuration options for `swapBehavior` are:
- `UnlimitedSwap` (default): Kubernetes workloads can use as much swap memory as they
  request, up to the system limit.
- `LimitedSwap`: The utilization of swap memory by Kubernetes workloads is subject to limitations.
Only Pods of [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable) QoS are permitted to employ swap.

If configuration for `memorySwap` is not specified and the feature gate is
enabled, by default the kubelet will apply the same behaviour as the
`UnlimitedSwap` setting.

Note that `NodeSwap` is supported for **cgroup v2** only. For Kubernetes v1.28,
using swap along with cgroup v1 is no longer supported.

## Install a swap-enabled cluster with kubeadm

### Before you begin

It is required for this demo that the kubeadm tool be installed, following the steps outlined in the
[kubeadm installation guide](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm).
If swap is already enabled on the node, cluster creation may
proceed. If swap is not enabled, please refer to the provided instructions for enabling swap.

### Create a swap file and turn swap on

I'll demonstrate creating 4GiB of unencrypted swap.

```bash
dd if=/dev/zero of=/swapfile bs=128M count=32
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
swapon -s # enable the swap file only until this node is rebooted
```

To start the swap file at boot time, add line like `/swapfile swap swap defaults 0 0` to `/etc/fstab` file.

### Set up a Kubernetes cluster that uses swap-enabled nodes

To make things clearer, here is an example kubeadm configuration file `kubeadm-config.yaml` for the swap enabled cluster.

```yaml
---
apiVersion: "kubeadm.k8s.io/v1beta3"
kind: InitConfiguration
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
failSwapOn: false
featureGates:
  NodeSwap: true
memorySwap:
  swapBehavior: LimitedSwap
```

Then create a single-node cluster using `kubeadm init --config kubeadm-config.yaml`.
During init, there is a warning that swap is enabled on the node and in case the kubelet
`failSwapOn` is set to true. We plan to remove this warning in a future release.

## How is the swap limit being determined with LimitedSwap?

The configuration of swap memory, including its limitations, presents a significant
challenge. Not only is it prone to misconfiguration, but as a system-level property, any
misconfiguration could potentially compromise the entire node rather than just a specific
workload. To mitigate this risk and ensure the health of the node, we have implemented
Swap in Beta with automatic configuration of limitations.

With `LimitedSwap`, Pods that do not fall under the Burstable QoS classification (i.e.
`BestEffort`/`Guaranteed` Qos Pods) are prohibited from utilizing swap memory.
`BestEffort` QoS Pods exhibit unpredictable memory consumption patterns and lack
information regarding their memory usage, making it difficult to determine a safe
allocation of swap memory. Conversely, `Guaranteed` QoS Pods are typically employed for
applications that rely on the precise allocation of resources specified by the workload,
with memory being immediately available. To maintain the aforementioned security and node
health guarantees, these Pods are not permitted to use swap memory when `LimitedSwap` is
in effect.

Prior to detailing the calculation of the swap limit, it is necessary to define the following terms:
* `nodeTotalMemory`: The total amount of physical memory available on the node.
* `totalPodsSwapAvailable`: The total amount of swap memory on the node that is available for use by Pods (some swap memory may be reserved for system use).
* `containerMemoryRequest`: The container's memory request.

Swap limitation is configured as:
`(containerMemoryRequest / nodeTotalMemory) × totalPodsSwapAvailable`

In other words, the amount of swap that a container is able to use is proportionate to its
memory request, the node's total physical memory and the total amount of swap memory on
the node that is available for use by Pods.

It is important to note that, for containers within Burstable QoS Pods, it is possible to
opt-out of swap usage by specifying memory requests that are equal to memory limits.
Containers configured in this manner will not have access to swap memory.

## How does it work?

There are a number of possible ways that one could envision swap use on a node.
When swap is already provisioned and available on a node,
SIG Node have [proposed](https://github.com/kubernetes/enhancements/blob/9d127347773ad19894ca488ee04f1cd3af5774fc/keps/sig-node/2400-node-swap/README.md#proposal)
the kubelet should be able to be configured so that:
- It can start with swap on.
- It will direct the Container Runtime Interface to allocate zero swap memory
  to Kubernetes workloads by default.

Swap configuration on a node is exposed to a cluster admin via the
[`memorySwap` in the KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1).
As a cluster administrator, you can specify the node's behaviour in the
presence of swap memory by setting `memorySwap.swapBehavior`.

The kubelet [employs the CRI](/docs/concepts/architecture/cri/)
(container runtime interface) API to direct the CRI to
configure specific cgroup v2 parameters (such as `memory.swap.max`) in a manner that will
enable the desired swap configuration for a container. The CRI is then responsible to
write these settings to the container-level cgroup.

## How can I monitor swap?

A notable deficiency in the Alpha version was the inability to monitor and introspect swap
usage. This issue has been addressed in the Beta version introduced in Kubernetes 1.28, which now
provides the capability to monitor swap usage through several different methods.

The beta version of kubelet now collects
[node-level metric statistics](/docs/reference/instrumentation/node-metrics/),
which can be accessed at the `/metrics/resource` and `/stats/summary` kubelet HTTP endpoints.
This allows clients who can directly interrogate the kubelet to
monitor swap usage and remaining swap memory when using LimitedSwap. Additionally, a
`machine_swap_bytes` metric has been added to cadvisor to show the total physical swap capacity of the
machine.

## Caveats

Having swap available on a system reduces predictability. Swap's performance is
worse than regular memory, sometimes by many orders of magnitude, which can
cause unexpected performance regressions. Furthermore, swap changes a system's
behaviour under memory pressure. Since enabling swap permits
greater memory usage for workloads in Kubernetes that cannot be predictably
accounted for, it also increases the risk of noisy neighbours and unexpected
packing configurations, as the scheduler cannot account for swap memory usage.

The performance of a node with swap memory enabled depends on the underlying
physical storage. When swap memory is in use, performance will be significantly
worse in an I/O operations per second (IOPS) constrained environment, such as a
cloud VM with I/O throttling, when compared to faster storage mediums like
solid-state drives or NVMe.

As such, we do not advocate the utilization of swap memory for workloads or
environments that are subject to performance constraints. Furthermore, it is
recommended to employ `LimitedSwap`, as this significantly mitigates the risks
posed to the node.

Cluster administrators and developers should benchmark their nodes and applications
before using swap in production scenarios, and [we need your help](#how-do-i-get-involved) with that!

### Security risk

Enabling swap on a system without encryption poses a security risk, as critical information,
such as volumes that represent Kubernetes Secrets, [may be swapped out to the disk](/docs/concepts/configuration/secret/#information-security-for-secrets).
If an unauthorized individual gains
access to the disk, they could potentially obtain these confidential data. To mitigate this risk, the
Kubernetes project strongly recommends that you encrypt your swap space.
However, handling encrypted swap is not within the scope of
kubelet; rather, it is a general OS configuration concern and should be addressed at that level.
It is the administrator's responsibility to provision encrypted swap to mitigate this risk.

Furthermore, as previously mentioned, with `LimitedSwap` the user has the option to completely
disable swap usage for a container by specifying memory requests that are equal to memory limits.
This will prevent the corresponding containers from accessing swap memory.

## Looking ahead

The Kubernetes 1.28 release introduced Beta support for swap memory on Linux nodes,
and we will continue to work towards [general availability](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)
for this feature. I hope that this will include:

* Add the ability to set a system-reserved quantity of swap from what kubelet detects on the host.
* Adding support for controlling swap consumption at the Pod level via cgroups.
  * This point is still under discussion.
* Collecting feedback from test user cases.
  * We will consider introducing new configuration modes for swap, such as a
    node-wide swap limit for workloads.

## How can I learn more?

You can review the current [documentation](/docs/concepts/architecture/nodes/#swap-memory)
for using swap with Kubernetes.

For more information, and to assist with testing and provide feedback, please
see [KEP-2400](https://github.com/kubernetes/enhancements/issues/4128) and its
[design proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).

## How do I get involved?

Your feedback is always welcome! SIG Node [meets regularly](https://github.com/kubernetes/community/tree/master/sig-node#meetings)
and [can be reached](https://github.com/kubernetes/community/tree/master/sig-node#contact)
via [Slack](https://slack.k8s.io/) (channel **#sig-node**), or the SIG's
[mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node). A Slack
channel dedicated to swap is also available at **#sig-node-swap**.

Feel free to reach out to me, Itamar Holder (**@iholder101** on Slack and GitHub)
if you'd like to help or ask further questions.


