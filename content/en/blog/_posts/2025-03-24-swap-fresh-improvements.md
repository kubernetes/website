---
layout: blog
title: "Fresh Swap Features for Linux Users in Kubernetes 1.32"
date: 2025-03-24T10:00:00-08:00
slug: swap-linux-improvements
author: >
  Itamar Holder (Red Hat)
---

Swap is a fundamental and an invaluable Linux feature.
It offers numerous benefits, such as effectively increasing a node’s memory by
swapping out unused data,
shielding nodes from system-level memory spikes,
preventing Pods from crashing when they hit their memory limits,
and [much more](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md#user-stories).
As a result, the node special interest group within the Kubernetes project
has invested significant effort into supporting swap on Linux nodes.

The 1.22 release [introduced](/blog/2021/08/09/run-nodes-with-swap-alpha/) Alpha support
for configuring swap memory usage for Kubernetes workloads running on Linux on a per-node basis.
Later, in release 1.28, support for swap on Linux nodes has graduated to Beta, along with many
new improvements.
In the following Kubernetes releases more improvements were made, paving the way
to GA in the near future.

Prior to version 1.22, Kubernetes did not provide support for swap memory on Linux systems.
This was due to the inherent difficulty in guaranteeing and accounting for pod memory utilization
when swap memory was involved. As a result, swap support was deemed out of scope in the initial
design of Kubernetes, and the default behavior of a kubelet was to fail to start if swap memory
was detected on a node.

In version 1.22, the swap feature for Linux was initially introduced in its Alpha stage.
This provided Linux users the opportunity to experiment with the swap feature for the first time.
However, as an Alpha version, it was not fully developed and only partially worked on limited environments.

In version 1.28 swap support on Linux nodes was promoted to Beta.
The Beta version was a drastic leap forward.
Not only did it fix a large amount of bugs and made swap work in a stable way,
but it also brought cgroup v2 support, introduced a wide variety of tests
which include complex scenarios such as node-level pressure, and more.
It also brought many exciting new capabilities such as the `LimitedSwap` behavior
which sets an auto-calculated swap limit to containers, OpenMetrics instrumentation
support (through the `/metrics/resource` endpoint) and Summary API for
VerticalPodAutoscalers (through the `/stats/summary` endpoint), and more.

Today we are working on more improvements, paving the way for GA.
Currently, the focus is especially towards ensuring node stability,
enhanced debug abilities, addressing user feedback,
polishing the feature and making it stable.
For example, in order to increase stability, containers in high-priority pods
cannot access swap which ensures the memory they need is ready to use.
In addition, the `UnlimitedSwap` behavior was removed since it might compromise
the node's health.
Secret content protection against swapping has also been introduced
(see relevant [security-risk section](#memory-backed-volumes) for more info).

To conclude, compared to previous releases, the kubelet's support for running with swap enabled
is more stable and robust, more user-friendly, and addresses many known shortcomings.
That said, the NodeSwap feature introduces basic swap support, and this is just the beginning.
In the near future, additional features are planned to enhance swap functionality in various ways,
such as improving evictions, extending the API, increasing customizability, and more!

## How do I use it?

In order for the kubelet to initialize on a swap-enabled node, the `failSwapOn`
field must be set to `false` on kubelet's configuration setting, or the deprecated
`--fail-swap-on` command line flag must be deactivated.

It is possible to configure the `memorySwap.swapBehavior` option to define the
manner in which a node utilizes swap memory.
For instance,

```yaml
# this fragment goes into the kubelet's configuration file
memorySwap:
  swapBehavior: LimitedSwap
```

The currently available configuration options for `swapBehavior` are:
- `NoSwap` (default): Kubernetes workloads cannot use swap. However, processes
  outside of Kubernetes' scope, like system daemons (such as kubelet itself!) can utilize swap.
  This behavior is beneficial for protecting the node from system-level memory spikes,
  but it does not safeguard the workloads themselves from such spikes.
- `LimitedSwap`: Kubernetes workloads can utilize swap memory, but with certain limitations.
  The amount of swap available to a Pod is determined automatically,
  based on the proportion of the memory requested relative to the node's total memory.
  Only non-high-priority Pods under the [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable)
  Quality of Service (QoS) tier are permitted to use swap.
  For more details, see the [section below](#how-is-the-swap-limit-being-determined-with-limitedswap).

If configuration for `memorySwap` is not specified,
by default the kubelet will apply the same behaviour as the `NoSwap` setting.

On Linux nodes, Kubernetes only supports running with swap enabled for hosts that use cgroup v2.
On cgroup v1 systems, all Kubernetes workloads are not allowed to use swap memory.

## Install a swap-enabled cluster with kubeadm

### Before you begin

It is required for this demo that the kubeadm tool be installed, following the steps outlined in the
[kubeadm installation guide](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm).
If swap is already enabled on the node, cluster creation may proceed.
If swap is not enabled, please refer to the provided instructions for enabling swap.

### Create a swap file and turn swap on

I'll demonstrate creating 4GiB of swap, both in the encrypted and unencrypted case.

#### Setting up unencrypted swap

An unencrypted swap file can be set up as follows.

```bash
# Allocate storage and restrict access
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Format the swap space
mkswap /swapfile

# Activate the swap space for paging
swapon /swapfile
```

#### Setting up encrypted swap

An encrypted swap file can be set up as follows.
Bear in mind that this example uses the `cryptsetup` binary (which is available
on most Linux distributions).

```bash
# Allocate storage and restrict access
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Create an encrypted device backed by the allocated storage
cryptsetup --type plain --cipher aes-xts-plain64 --key-size 256 -d /dev/urandom open /swapfile cryptswap

# Format the swap space
mkswap /dev/mapper/cryptswap

# Activate the swap space for paging
swapon /dev/mapper/cryptswap
```

#### Verify that swap is enabled

Swap can be verified to be enabled with both `swapon -s` command or the `free` command

```
> swapon -s
Filename				Type		Size		Used		Priority
/dev/dm-0                               partition	4194300		0		-2
```

```
> free -h
               total        used        free      shared  buff/cache   available
Mem:           3.8Gi       1.3Gi       249Mi        25Mi       2.5Gi       2.5Gi
Swap:          4.0Gi          0B       4.0Gi
```

#### Enable swap on boot

After setting up swap, to start the swap file at boot time,
you either set up a systemd unit to activate (encrypted) swap, or you
add a line similar to `/swapfile swap swap defaults 0 0` into `/etc/fstab`.

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
Swap with automatic configuration of limitations.

With `LimitedSwap`, Pods that do not fall under the Burstable QoS classification (i.e.
`BestEffort`/`Guaranteed` QoS Pods) are prohibited from utilizing swap memory.
`BestEffort` QoS Pods exhibit unpredictable memory consumption patterns and lack
information regarding their memory usage, making it difficult to determine a safe
allocation of swap memory.
Conversely, `Guaranteed` QoS Pods are typically employed for applications that rely on the
precise allocation of resources specified by the workload, with memory being immediately available.
To maintain the aforementioned security and node health guarantees,
these Pods are not permitted to use swap memory when `LimitedSwap` is in effect.
In addition, high-priority pods are not permitted to use swap in order to ensure the memory
they consume always residents on disk, hence ready to use.

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
the kubelet is able to be configured so that:
- It can start with swap on.
- It will direct the Container Runtime Interface to allocate zero swap memory
  to Kubernetes workloads by default.

Swap configuration on a node is exposed to a cluster admin via the
[`memorySwap` in the KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1).
As a cluster administrator, you can specify the node's behaviour in the
presence of swap memory by setting `memorySwap.swapBehavior`.

The kubelet employs the [CRI](https://kubernetes.io/docs/concepts/architecture/cri/)
(container runtime interface) API, and directs the container runtime to
configure specific cgroup v2 parameters (such as `memory.swap.max`) in a manner that will
enable the desired swap configuration for a container. For runtimes that use control groups,
the container runtime is then responsible for writing these settings to the container-level cgroup.

## How can I monitor swap?

### Node and container level metric statistics

Kubelet now collects node and container level metric statistics,
which can be accessed at the `/metrics/resource` (which is used mainly by monitoring
tools like Prometheus) and `/stats/summary` (which is used mainly by Autoscalers) kubelet HTTP endpoints.
This allows clients who can directly interrogate the kubelet to
monitor swap usage and remaining swap memory when using `LimitedSwap`.
Additionally, a `machine_swap_bytes` metric has been added to cadvisor to show
the total physical swap capacity of the machine.
See [this page](/docs/reference/instrumentation/node-metrics/) for more info.

### Node Feature Discovery (NFD) {#node-feature-discovery}

[Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery)
is a Kubernetes addon for detecting hardware features and configuration.
It can be utilized to discover which nodes are provisioned with swap.

As an example, to figure out which nodes are provisioned with swap,
use the following command:
```shell
kubectl get nodes -o jsonpath='{range .items[?(@.metadata.labels.feature\.node\.kubernetes\.io/memory-swap)]}{.metadata.name}{"\t"}{.metadata.labels.feature\.node\.kubernetes\.io/memory-swap}{"\n"}{end}'
```

This will result in an output similar to:
```
k8s-worker1: true
k8s-worker2: true
k8s-worker3: false
```

In this example, swap is provisioned on nodes `k8s-worker1` and `k8s-worker2`, but not on `k8s-worker3`.

## Caveats

Having swap available on a system reduces predictability.
While swap can enhance performance by making more RAM available, swapping data
back to memory is a heavy operation, sometimes slower by many orders of magnitude,
which can cause unexpected performance regressions.
Furthermore, swap changes a system's behaviour under memory pressure.
Enabling swap increases the risk of noisy neighbors,
where Pods that frequently use their RAM may cause other Pods to swap.
In addition, since swap allows for greater memory usage for workloads in Kubernetes that cannot be predictably accounted for,
and due to unexpected packing configurations,
the scheduler currently does not account for swap memory usage.
This heightens the risk of noisy neighbors.

The performance of a node with swap memory enabled depends on the underlying physical storage.
When swap memory is in use, performance will be significantly worse in an I/O
operations per second (IOPS) constrained environment, such as a cloud VM with
I/O throttling, when compared to faster storage mediums like solid-state drives
or NVMe.
As swap might cause IO pressure, it is recommended to give a higher IO latency
priority to system critical daemons. See the relevant section in the
[recommended practices](#good-practice-for-using-swap-in-a-kubernetes-cluster) section below.

### Memory-backed volumes

On Linux nodes, memory-backed volumes (such as [`secret`](/docs/concepts/configuration/secret/)
volume mounts, or [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) with `medium: Memory`)
are implemented with a `tmpfs` filesystem.
The contents of such volumes should remain in memory at all times, hence should
not be swapped to disk.
To ensure the contents of such volumes remain in memory, the `noswap` tmpfs option
is being used.

The Linux kernel officially supports the `noswap` option from version 6.3 (more info
can be found in [Linux Kernel Version Requirements](/docs/reference/node/kernel-version-requirements/#requirements-other)).
However, the different distributions often choose to backport this mount option to older
Linux versions as well.

In order to verify whether the node supports the `noswap` option, the kubelet will do the following:
* If the kernel's version is above 6.3 then the `noswap` option will be assumed to be supported.
* Otherwise, kubelet would try to mount a dummy tmpfs with the `noswap` option at startup.
  If kubelet fails with an error indicating of an unknown option, `noswap` will be assumed
  to not be supported, hence will not be used.
  A kubelet log entry will be emitted to warn the user about memory-backed volumes might swap to disk.
  If kubelet succeeds, the dummy tmpfs will be deleted and the `noswap` option will be used.
  * If the `noswap` option is not supported, kubelet will emit a warning log entry,
    then continue its execution.

It is deeply encouraged to encrypt the swap space.
See the [section above](#setting-up-encrypted-swap) with an example for setting unencrypted swap.
However, handling encrypted swap is not within the scope of kubelet;
rather, it is a general OS configuration concern and should be addressed at that level.
It is the administrator's responsibility to provision encrypted swap to mitigate this risk.

## Good practice for using swap in a Kubernetes cluster

### Disable swap for system-critical daemons

During the testing phase and based on user feedback, it was observed that the performance
of system-critical daemons and services might degrade.
This implies that system daemons, including the kubelet, could operate slower than usual.
If this issue is encountered, it is advisable to configure the cgroup of the system slice
to prevent swapping (i.e., set `memory.swap.max=0`).

### Protect system-critical daemons for I/O latency

Swap can increase the I/O load on a node.
When memory pressure causes the kernel to rapidly swap pages in and out,
system-critical daemons and services that rely on I/O operations may
experience performance degradation.

To mitigate this, it is recommended for systemd users to prioritize the system slice in terms of I/O latency.
For non-systemd users,
setting up a dedicated cgroup for system daemons and processes and prioritizing I/O latency in the same way is advised.
This can be achieved by setting `io.latency` for the system slice,
thereby granting it higher I/O priority.
See [cgroup's documentation](https://www.kernel.org/doc/Documentation/admin-guide/cgroup-v2.rst) for more info.

### Swap and control plane nodes

The Kubernetes project recommends running control plane nodes without any swap space configured.
The control plane primarily hosts Guaranteed QoS Pods, so swap can generally be disabled.
The main concern is that swapping critical services on the control plane could negatively impact performance.

### Use of a dedicated disk for swap

It is recommended to use a separate, encrypted disk for the swap partition.
If swap resides on a partition or the root filesystem, workloads may interfere
with system processes that need to write to disk.
When they share the same disk, processes can overwhelm swap,
disrupting the I/O of kubelet, container runtime, and systemd, which would impact other workloads.
Since swap space is located on a disk, it is crucial to ensure the disk is fast enough for the intended use cases.
Alternatively, one can configure I/O priorities between different mapped areas of a single backing device.

## Looking ahead

As you can see, the swap feature was dramatically improved lately,
paving the way for a feature GA.
However, this is just the beginning.
It's a foundational implementation marking the beginning of enhanced swap functionality.

In the near future, additional features are planned to further improve swap capabilities,
including better eviction mechanisms, extended API support, increased customizability,
better debug abilities and more!

## How can I learn more?

You can review the current [documentation](/docs/concepts/architecture/nodes/#swap-memory)
for using swap with Kubernetes.

For more information, please see [KEP-2400](https://github.com/kubernetes/enhancements/issues/4128) and its
[design proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).

## How do I get involved?

Your feedback is always welcome! SIG Node [meets regularly](https://github.com/kubernetes/community/tree/master/sig-node#meetings)
and [can be reached](https://github.com/kubernetes/community/tree/master/sig-node#contact)
via [Slack](https://slack.k8s.io/) (channel **#sig-node**), or the SIG's
[mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node). A Slack
channel dedicated to swap is also available at **#sig-node-swap**.

Feel free to reach out to me, Itamar Holder (**@iholder101** on Slack and GitHub)
if you'd like to help or ask further questions.

